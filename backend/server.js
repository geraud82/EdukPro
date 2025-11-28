require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express(); // 👈 define app BEFORE app.use
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import PDF, Email and Push services
const { generateInvoicePDF } = require('./services/pdfService');
const { sendInvoiceEmail, sendPaymentConfirmationEmail } = require('./services/emailService');
const pushService = require('./services/pushService');

let io; // we'll set this later

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types and images
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// Middleware
app.use(express.json());

// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4000',
  'https://edukpro.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Helper: create JWT =====
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId || null,
      isActive: user.isActive,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}


// ===== Auth middleware (for protected routes later) =====
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}

// Helper: Create in-app notification
async function createNotification(userId, type, title, message, relatedId = null, relatedType = null) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId,
        relatedType,
      },
    });

    // Broadcast via Socket.IO if available
    if (io) {
      io.to(`user:${userId}`).emit('notification:new', notification);
    }

    return notification;
  } catch (err) {
    console.error('Create notification error:', err);
  }
}



// ===== Routes =====

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'School API is running' });
});

// ===== Auth routes =====

// Register
// body: { name, email, password, role }
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const allowedRoles = ['parent', 'teacher', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // ✅ Check existing user in DB
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create user in DB
    const newUser = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });

    const token = createToken(newUser);

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
// body: { email, password }
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Get user from DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Example protected route
// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===== Students routes (parent) =====

// Parent creates a student (child) with comprehensive information
app.post('/api/students', authMiddleware, async (req, res) => {
  try {
    // Only parents and admins can create students
    if (req.user.role !== 'parent' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only parents and admins can add students' });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      bloodGroup,
      address,
      city,
      state,
      postalCode,
      phone,
      email,
      guardianName,
      guardianRelation,
      guardianPhone,
      guardianEmail,
      guardianAddress,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      allergies,
      medicalConditions,
      medications,
      doctorName,
      doctorPhone,
      previousSchool,
      previousGrade,
      transferReason,
      specialNeeds,
      notes,
      schoolId,
    } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: 'firstName and lastName are required' });
    }

    const studentData = {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || null,
      nationality: nationality || null,
      bloodGroup: bloodGroup || null,
      address: address || null,
      city: city || null,
      state: state || null,
      postalCode: postalCode || null,
      phone: phone || null,
      email: email || null,
      guardianName: guardianName || null,
      guardianRelation: guardianRelation || null,
      guardianPhone: guardianPhone || null,
      guardianEmail: guardianEmail || null,
      guardianAddress: guardianAddress || null,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      emergencyContactRelation: emergencyContactRelation || null,
      allergies: allergies || null,
      medicalConditions: medicalConditions || null,
      medications: medications || null,
      doctorName: doctorName || null,
      doctorPhone: doctorPhone || null,
      previousSchool: previousSchool || null,
      previousGrade: previousGrade || null,
      transferReason: transferReason || null,
      specialNeeds: specialNeeds || null,
      notes: notes || null,
      parentId: req.user.id,
      schoolId: schoolId ? Number(schoolId) : null,
    };

    const student = await prisma.student.create({
      data: studentData,
      include: {
        documents: true,
      },
    });

    res.status(201).json(student);
  } catch (err) {
    console.error('Create student error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload documents for a student
app.post('/api/students/:id/documents', authMiddleware, upload.array('files', 10), async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    const { documentTypes, descriptions } = req.body;

    // Verify student exists and user has access
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'parent' && student.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to upload documents for this student' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Parse documentTypes and descriptions (sent as JSON strings)
    const types = documentTypes ? JSON.parse(documentTypes) : [];
    const descs = descriptions ? JSON.parse(descriptions) : [];

    // Create document records
    const documents = await Promise.all(
      req.files.map((file, index) => {
        return prisma.studentDocument.create({
          data: {
            studentId: studentId,
            documentType: types[index] || 'other',
            fileName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadedBy: req.user.id,
            description: descs[index] || null,
          },
        });
      })
    );

    res.status(201).json(documents);
  } catch (err) {
    console.error('Upload documents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student documents
app.get('/api/students/:id/documents', authMiddleware, async (req, res) => {
  try {
    const studentId = Number(req.params.id);

    // Verify student exists and user has access
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'parent' && student.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view documents for this student' });
    }

    const documents = await prisma.studentDocument.findMany({
      where: { studentId: studentId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(documents);
  } catch (err) {
    console.error('Get documents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a student document
app.delete('/api/students/:studentId/documents/:documentId', authMiddleware, async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const documentId = Number(req.params.documentId);

    // Verify student exists and user has access
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'parent' && student.parentId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get document to delete file
    const document = await prisma.studentDocument.findUnique({
      where: { id: documentId },
    });

    if (!document || document.studentId !== studentId) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, document.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.studentDocument.delete({
      where: { id: documentId },
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Parent gets his/her own students
app.get('/api/students/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can view this' });
    }

    const students = await prisma.student.findMany({
      where: { parentId: req.user.id },
      include: {
        documents: true,
        enrollments: {
          include: {
            class: {
              include: {
                school: true,
                teacher: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(students);
  } catch (err) {
    console.error('Get my students error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== Fees & Payments =====
// Admin: list all students (with parent info)
app.get('/api/admin/students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view students' });
    }

    const students = await prisma.student.findMany({
      include: {
        parent: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(students);
  } catch (err) {
    console.error('Admin get students error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list all teachers
app.get('/api/admin/teachers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view teachers' });
    }

    const teachers = await prisma.user.findMany({
      where: { 
        role: 'teacher',
        schoolId: req.user.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(teachers);
  } catch (err) {
    console.error('Admin get teachers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create a teacher
app.post('/api/admin/teachers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create teachers' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Get admin's current schoolId from database
    const admin = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { schoolId: true },
    });

    if (!admin.schoolId) {
      return res.status(400).json({ message: 'You must set up your school before creating teachers' });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const teacher = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'teacher',
        schoolId: admin.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        schoolId: true,
      },
    });

    res.status(201).json(teacher);
  } catch (err) {
    console.error('Admin create teacher error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list all invoices (with student & fee)
app.get('/api/admin/invoices', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view invoices' });
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        student: true,
        fee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(invoices);
  } catch (err) {
    console.error('Admin get invoices error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin creates a fee
app.post('/api/fees', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    const { name, description, amount, currency, schoolId } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ message: 'name and amount are required' });
    }

    // Fetch user's current schoolId from database (not from JWT which may be outdated)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { schoolId: true },
    });

    // Use schoolId from request body, or fall back to user's current schoolId from database
    const feeSchoolId = schoolId ? Number(schoolId) : user.schoolId;

    // schoolId is required (not nullable in schema)
    if (!feeSchoolId) {
      return res.status(400).json({ message: 'schoolId is required to create a fee. Please set up your school first.' });
    }

    const fee = await prisma.fee.create({
      data: {
        name,
        description: description || null,
        amount: Number(amount),
        currency: currency || 'XOF',
        schoolId: feeSchoolId,
      },
    });

    res.status(201).json(fee);
  } catch (err) {
    console.error('Create fee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List all fees (any logged user)
app.get('/api/fees', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    // If admin has a schoolId, filter by it. Otherwise, return all fees (for global admins)
    const where = req.user.schoolId ? { schoolId: req.user.schoolId } : {};

    const fees = await prisma.fee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(fees);
  } catch (err) {
    console.error('Get fees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Admin creates an invoice for a student and fee
app.post('/api/invoices', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create invoices' });
    }

    const { studentId, feeId, amount, dueDate } = req.body;

    if (!studentId || !feeId) {
      return res.status(400).json({ message: 'studentId and feeId are required' });
    }

    // Get fee to use its amount if not provided
    const fee = await prisma.fee.findUnique({ where: { id: Number(feeId) } });
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    // Get student with parent info
    const student = await prisma.student.findUnique({
      where: { id: Number(studentId) },
      include: { parent: true },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const invoiceAmount = amount ? Number(amount) : fee.amount;

    const invoice = await prisma.invoice.create({
      data: {
        studentId: Number(studentId),
        feeId: Number(feeId),
        amount: invoiceAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        student: {
          include: {
            parent: true,
          },
        },
        fee: true,
        payments: true,
      },
    });

    // Generate PDF and send email
    try {
      const pdfBuffer = await generateInvoicePDF(invoice);
      
      if (student.parent && student.parent.email) {
        await sendInvoiceEmail(student.parent.email, invoice, pdfBuffer);
      }
    } catch (emailErr) {
      console.error('Error sending invoice email:', emailErr);
      // Don't fail the request if email fails
    }

    // 🔴 Create in-app notification for parent
    if (student.parent) {
      await createNotification(
        student.parent.id,
        'invoice',
        '💰 New Invoice Created',
        `New invoice for ${student.firstName} ${student.lastName}: ${fee.name} - ${invoiceAmount.toLocaleString()} ${fee.currency}`,
        invoice.id,
        'invoice'
      );
    }

    res.status(201).json(invoice);
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download invoice PDF
app.get('/api/invoices/:id/download', authMiddleware, async (req, res) => {
  try {
    const invoiceId = Number(req.params.id);

    // Fetch invoice with full details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        student: {
          include: {
            parent: true,
          },
        },
        fee: true,
        payments: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check permissions
    if (req.user.role === 'parent') {
      if (invoice.student.parentId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to download this invoice' });
      }
    } else if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Set headers for PDF download
    const invoiceNumber = `INV-${String(invoice.id).padStart(6, '0')}`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Download invoice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send invoice email
app.post('/api/invoices/:id/send-email', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can send invoice emails' });
    }

    const invoiceId = Number(req.params.id);

    // Fetch invoice with full details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        student: {
          include: {
            parent: true,
          },
        },
        fee: true,
        payments: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (!invoice.student.parent || !invoice.student.parent.email) {
      return res.status(400).json({ message: 'Parent email not available' });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Send email
    const result = await sendInvoiceEmail(invoice.student.parent.email, invoice, pdfBuffer);

    if (result.success) {
      res.json({ message: 'Invoice email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ message: result.message || 'Failed to send email' });
    }
  } catch (err) {
    console.error('Send invoice email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ===== Classes & Enrollments =====
// Admin creates an enrollment directly (auto APPROVED + invoices)
app.post('/api/admin/enrollments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can enroll students' });
    }

    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: 'studentId and classId are required' });
    }

    // Load student + class with fees
    const student = await prisma.student.findUnique({
      where: { id: Number(studentId) },
      include: { parent: true },
    });
    const cls = await prisma.class.findUnique({
      where: { id: Number(classId) },
      include: {
        enrollmentFee: true,
        tuitionFee: true,
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Avoid duplicate enrollment
    const existing = await prisma.enrollment.findFirst({
      where: { studentId: Number(studentId), classId: Number(classId) },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'Student already has an enrollment for this class' });
    }

    // Create enrollment as APPROVED
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        classId: Number(classId),
        status: 'APPROVED', // uses your EnrollmentStatus enum
      },
      include: {
        student: { include: { parent: true } },
        class: true,
      },
    });

    // Create invoices for enrollment & tuition fees (if any)
    const invoicesToCreate = [];

    if (cls.enrollmentFee) {
      invoicesToCreate.push({
        studentId: Number(studentId),
        feeId: cls.enrollmentFee.id,
        amount: cls.enrollmentFee.amount,
        status: 'PENDING',
      });
    }

    if (cls.tuitionFee) {
      invoicesToCreate.push({
        studentId: Number(studentId),
        feeId: cls.tuitionFee.id,
        amount: cls.tuitionFee.amount,
        status: 'PENDING',
      });
    }

    let createdInvoices = [];
    if (invoicesToCreate.length > 0) {
      createdInvoices = await prisma.$transaction(
        invoicesToCreate.map(data => prisma.invoice.create({ data, include: { fee: true } }))
      );
    }

    res.status(201).json({
      enrollment,
      invoices: createdInvoices,
      message: 'Enrollment created and invoices generated',
    });
  } catch (err) {
    console.error('Admin direct enrollment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Admin creates a class, linking to optional enrollment & tuition fees and teacher
app.post('/api/classes', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create classes' });
    }

    const { name, description, level, enrollmentFeeId, tuitionFeeId, teacherId, schoolId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    // Fetch user's current schoolId from database (not from JWT which may be outdated)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { schoolId: true },
    });

    // Use schoolId from request body, or fall back to user's current schoolId from database
    const classSchoolId = schoolId ? Number(schoolId) : user.schoolId;

    // schoolId is required (not nullable in schema)
    if (!classSchoolId) {
      return res.status(400).json({ message: 'schoolId is required to create a class. Please set up your school first.' });
    }

    const data = {
      name,
      description: description || null,
      level: level || null,
      enrollmentFeeId: enrollmentFeeId ? Number(enrollmentFeeId) : null,
      tuitionFeeId: tuitionFeeId ? Number(tuitionFeeId) : null,
      teacherId: teacherId ? Number(teacherId) : null,
      schoolId: classSchoolId,
    };

    const cls = await prisma.class.create({
      data,
      include: {
        enrollmentFee: true,
        tuitionFee: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        school: true,
      },
    });

    res.status(201).json(cls);
  } catch (err) {
    console.error('Create class error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin assigns/updates teacher for a class
app.patch('/api/classes/:id/teacher', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can assign teachers' });
    }

    const classId = Number(req.params.id);
    const { teacherId } = req.body;

    // Verify teacher exists and has teacher role
    if (teacherId) {
      const teacher = await prisma.user.findUnique({
        where: { id: Number(teacherId) },
      });

      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      if (teacher.role !== 'teacher') {
        return res.status(400).json({ message: 'User is not a teacher' });
      }
    }

    const cls = await prisma.class.update({
      where: { id: classId },
      data: {
        teacherId: teacherId ? Number(teacherId) : null,
      },
      include: {
        enrollmentFee: true,
        tuitionFee: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        school: true,
        enrollments: {
          where: {
            status: 'APPROVED',
          },
          include: {
            student: {
              include: {
                parent: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json(cls);
  } catch (err) {
    console.error('Assign teacher error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin updates a class
app.patch('/api/classes/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update classes' });
    }

    const classId = Number(req.params.id);
    const { name, description, level, enrollmentFeeId, tuitionFeeId, teacherId } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description || null;
    if (level !== undefined) data.level = level || null;
    if (enrollmentFeeId !== undefined) data.enrollmentFeeId = enrollmentFeeId ? Number(enrollmentFeeId) : null;
    if (tuitionFeeId !== undefined) data.tuitionFeeId = tuitionFeeId ? Number(tuitionFeeId) : null;
    if (teacherId !== undefined) data.teacherId = teacherId ? Number(teacherId) : null;

    const cls = await prisma.class.update({
      where: { id: classId },
      data,
      include: {
        enrollmentFee: true,
        tuitionFee: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        school: true,
      },
    });

    res.json(cls);
  } catch (err) {
    console.error('Update class error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin deletes a class
app.delete('/api/classes/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete classes' });
    }

    const classId = Number(req.params.id);

    // Check if class exists
    const cls = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        enrollments: true,
      },
    });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if class has enrollments
    if (cls.enrollments.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete class with existing enrollments. Please remove all enrollments first.' 
      });
    }

    // Delete the class
    await prisma.class.delete({
      where: { id: classId },
    });

    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error('Delete class error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin updates a fee
app.patch('/api/fees/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update fees' });
    }

    const feeId = Number(req.params.id);
    const { name, description, amount, currency } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description || null;
    if (amount !== undefined) data.amount = Number(amount);
    if (currency !== undefined) data.currency = currency;

    const fee = await prisma.fee.update({
      where: { id: feeId },
      data,
    });

    res.json(fee);
  } catch (err) {
    console.error('Update fee error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Fee not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin deletes a fee
app.delete('/api/fees/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete fees' });
    }

    const feeId = Number(req.params.id);

    // Check if fee exists
    const fee = await prisma.fee.findUnique({
      where: { id: feeId },
      include: {
        invoices: true,
        enrollmentClasses: true,
        tuitionClasses: true,
      },
    });

    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    // Check if fee is being used
    if (fee.invoices.length > 0 || fee.enrollmentClasses.length > 0 || fee.tuitionClasses.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete fee that is being used in invoices or classes. Please remove all references first.' 
      });
    }

    // Delete the fee
    await prisma.fee.delete({
      where: { id: feeId },
    });

    res.json({ message: 'Fee deleted successfully' });
  } catch (err) {
    console.error('Delete fee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Teacher: get their assigned classes with enrollments
app.get('/api/classes/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view their classes' });
    }

    const classes = await prisma.class.findMany({
      where: {
        teacherId: req.user.id,
      },
      include: {
        enrollmentFee: true,
        tuitionFee: true,
        school: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
          where: {
            status: 'APPROVED',
          },
          include: {
            student: {
              include: {
                parent: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(classes);
  } catch (err) {
    console.error('Get teacher classes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Any logged-in user: list all classes
app.get('/api/classes', authMiddleware, async (req, res) => {
  try {
    const { schoolId } = req.query;
    
    const where = schoolId ? { schoolId: Number(schoolId) } : {};
    
    const classes = await prisma.class.findMany({
      where,
      include: {
        enrollmentFee: true,
        tuitionFee: true,
        school: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
          where: {
            status: 'APPROVED',
          },
          include: {
            student: {
              include: {
                parent: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            student: {
              firstName: 'asc',
            },
          },
        },
        _count: {
          select: {
            enrollments: {
              where: {
                status: 'APPROVED',
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(classes);
  } catch (err) {
    console.error('Get classes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Parent creates an enrollment for one of their children
app.post('/api/enrollments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can enroll students' });
    }

    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({ message: 'studentId and classId are required' });
    }

    // Check that the student belongs to this parent
    const student = await prisma.student.findFirst({
      where: {
        id: Number(studentId),
        parentId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found for this parent' });
    }

    // Optional: check class exists
    const cls = await prisma.class.findUnique({
      where: { id: Number(classId) },
    });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Optional: avoid duplicate pending enrollment
    const existing = await prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        classId: cls.id,
        status: 'PENDING',
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: 'Enrollment already pending for this class' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: cls.id,
        status: 'PENDING',
      },
      include: {
        student: true,
        class: true,
      },
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error('Create enrollment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Admin: list enrollments (filter by status optional)
app.get('/api/admin/enrollments', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view enrollments' });
    }

    const { status } = req.query; // PENDING / APPROVED / REJECTED

    const where = status
      ? { status: status.toUpperCase() }
      : {};

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        student: {
          include: {
            parent: true,
          },
        },
        class: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(enrollments);
  } catch (err) {
    console.error('Admin get enrollments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Admin approves enrollment and automatically creates invoices
app.post('/api/admin/enrollments/:id/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve enrollments' });
    }

    const enrollmentId = Number(req.params.id);

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        student: true,
        class: {
          include: {
            enrollmentFee: true,
            tuitionFee: true,
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.status !== 'PENDING') {
      return res.status(400).json({ message: 'Enrollment is not pending' });
    }

    const invoicesToCreate = [];

    if (enrollment.class.enrollmentFee) {
      invoicesToCreate.push({
        studentId: enrollment.studentId,
        feeId: enrollment.class.enrollmentFee.id,
        amount: enrollment.class.enrollmentFee.amount,
        status: 'PENDING',
      });
    }

    if (enrollment.class.tuitionFee) {
      invoicesToCreate.push({
        studentId: enrollment.studentId,
        feeId: enrollment.class.tuitionFee.id,
        amount: enrollment.class.tuitionFee.amount,
        status: 'PENDING',
      });
    }

    const result = await prisma.$transaction(async tx => {
      const updatedEnrollment = await tx.enrollment.update({
        where: { id: enrollmentId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
        include: {
          student: {
            include: {
              parent: true,
            },
          },
          class: true,
        },
      });

      let createdInvoices = [];
      if (invoicesToCreate.length > 0) {
        createdInvoices = await Promise.all(
          invoicesToCreate.map(inv =>
            tx.invoice.create({
              data: {
                studentId: inv.studentId,
                feeId: inv.feeId,
                amount: inv.amount,
                status: inv.status,
              },
            })
          )
        );
      }

      return { updatedEnrollment, createdInvoices };
    });

    // 🔴 Create in-app notification for parent
    if (result.updatedEnrollment.student.parent) {
      await createNotification(
        result.updatedEnrollment.student.parent.id,
        'enrollment',
        '✅ Enrollment Approved!',
        `${result.updatedEnrollment.student.firstName} ${result.updatedEnrollment.student.lastName} has been enrolled in ${result.updatedEnrollment.class.name}`,
        result.updatedEnrollment.id,
        'enrollment'
      );
    }

    res.json(result);
  } catch (err) {
    console.error('Approve enrollment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== Chat: contacts & messages =====

// Get chat contacts based on role
app.get('/api/chat/contacts', authMiddleware, async (req, res) => {
  try {
    let contacts = [];

    if (req.user.role === 'parent') {
      // Parents can chat with:
      // 1. Their children's teachers
      // 2. Admins of schools where their children are enrolled

      // Get all students of this parent
      const students = await prisma.student.findMany({
        where: { parentId: req.user.id },
        include: {
          enrollments: {
            where: { status: 'APPROVED' },
            include: {
              class: {
                include: {
                  teacher: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true,
                    },
                  },
                  school: true,
                },
              },
            },
          },
        },
      });

      const contactMap = new Map();

      // Add teachers and school admins
      students.forEach(student => {
        student.enrollments.forEach(enrollment => {
          // Add teacher
          if (enrollment.class.teacher) {
            const teacher = enrollment.class.teacher;
            if (!contactMap.has(teacher.id)) {
              contactMap.set(teacher.id, teacher);
            }
          }

          // Add school admins
          if (enrollment.class.schoolId) {
            // We'll get admins for this school
          }
        });
      });

      // Get unique school IDs
      const schoolIds = new Set();
      students.forEach(student => {
        student.enrollments.forEach(enrollment => {
          if (enrollment.class.schoolId) {
            schoolIds.add(enrollment.class.schoolId);
          }
        });
      });

      // Get admins for these schools
      if (schoolIds.size > 0) {
        const admins = await prisma.user.findMany({
          where: {
            role: 'admin',
            schoolId: { in: Array.from(schoolIds) },
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        admins.forEach(admin => {
          if (!contactMap.has(admin.id)) {
            contactMap.set(admin.id, admin);
          }
        });
      }

      contacts = Array.from(contactMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      );

    } else if (req.user.role === 'teacher') {
      // Teachers can chat with:
      // 1. Parents of students in their classes
      // 2. Their school admin

      const teacherClasses = await prisma.class.findMany({
        where: { teacherId: req.user.id },
        include: {
          enrollments: {
            where: { status: 'APPROVED' },
            include: {
              student: {
                include: {
                  parent: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const contactMap = new Map();

      // Add parents
      teacherClasses.forEach(cls => {
        cls.enrollments.forEach(enrollment => {
          const parent = enrollment.student.parent;
          if (parent && !contactMap.has(parent.id)) {
            contactMap.set(parent.id, parent);
          }
        });
      });

      // Add school admin (if teacher has a school)
      if (req.user.schoolId) {
        const admins = await prisma.user.findMany({
          where: {
            role: 'admin',
            schoolId: req.user.schoolId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        admins.forEach(admin => {
          if (!contactMap.has(admin.id)) {
            contactMap.set(admin.id, admin);
          }
        });
      }

      contacts = Array.from(contactMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      );

    } else if (req.user.role === 'admin') {
      // Admins can chat with:
      // 1. Teachers in their school
      // 2. Parents of ALL students at their school (with or without enrollments)

      const contactMap = new Map();

      // Get teachers in this school
      if (req.user.schoolId) {
        const teachers = await prisma.user.findMany({
          where: {
            role: 'teacher',
            schoolId: req.user.schoolId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        teachers.forEach(teacher => {
          contactMap.set(teacher.id, teacher);
        });

        // Get parents of ALL students at this school
        const students = await prisma.student.findMany({
          where: {
            schoolId: req.user.schoolId,
          },
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        });

        students.forEach(student => {
          const parent = student.parent;
          if (parent && !contactMap.has(parent.id)) {
            contactMap.set(parent.id, parent);
          }
        });
      }

      contacts = Array.from(contactMap.values()).sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    }

    // Add unread message count for each contact
    const contactsWithUnread = await Promise.all(
      contacts.map(async (contact) => {
        const unreadCount = await prisma.message.count({
          where: {
            senderId: contact.id,
            receiverId: req.user.id,
            readAt: null,
          },
        });
        return {
          ...contact,
          unreadCount,
        };
      })
    );

    res.json(contactsWithUnread);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversation between current user and another user
app.get('/api/chat/conversation/:userId', authMiddleware, async (req, res) => {
  try {
    const otherUserId = Number(req.params.userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
app.post('/api/chat/mark-read/:contactId', authMiddleware, async (req, res) => {
  try {
    const contactId = Number(req.params.contactId);

    // Mark all unread messages from this contact as read
    await prisma.message.updateMany({
      where: {
        senderId: contactId,
        receiverId: req.user.id,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('Mark messages as read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message to another user
app.post('/api/chat/messages', authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'receiverId and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        receiverId: Number(receiverId),
      },
    });

    // Get sender info for push notification
    const sender = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true },
    });

    // 🔴 Broadcast in real-time to receiver only (sender already has the message from API response)
    if (io) {
      io.to(`user:${message.receiverId}`)
        .emit('chat:new-message', message);
    }

    // 📱 Send push notification to receiver (if app is closed and push is enabled)
    if (sender && pushService.isPushNotificationsEnabled()) {
      await pushService.sendNewMessageNotification(
        Number(receiverId),
        sender.name,
        content.substring(0, 100) // Preview first 100 chars
      );
    }

    // 🔴 Create in-app notification for receiver
    await createNotification(
      Number(receiverId),
      'message',
      `💬 New Message from ${sender.name}`,
      content.substring(0, 100),
      message.id,
      'message'
    );

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===== IN-APP NOTIFICATION ROUTES =====

// Get user's notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    
    const where = {
      userId: req.user.id,
    };
    
    if (unreadOnly === 'true') {
      where.isRead = false;
    }
    
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 notifications
    });
    
    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notificationId = Number(req.params.id);
    
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    
    res.json(updated);
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
app.post('/api/notifications/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });
    
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all notifications read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notification count
app.get('/api/notifications/unread-count', authMiddleware, async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false,
      },
    });
    
    res.json({ count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification
app.delete('/api/notifications/:id', authMiddleware, async (req, res) => {
  try {
    const notificationId = Number(req.params.id);
    
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== PUSH NOTIFICATION ROUTES =====

// Get VAPID public key
app.get('/api/push/vapid-public-key', (req, res) => {
  const publicKey = pushService.getVapidPublicKey();
  res.json({ publicKey });
});

// Subscribe to push notifications
app.post('/api/push/subscribe', authMiddleware, async (req, res) => {
  try {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Invalid subscription' });
    }

    // Save subscription for this user
    pushService.saveSubscription(req.user.id, subscription);

    res.json({ message: 'Subscription saved successfully' });
  } catch (err) {
    console.error('Push subscribe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe from push notifications
app.post('/api/push/unsubscribe', authMiddleware, async (req, res) => {
  try {
    pushService.removeSubscription(req.user.id);
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Push unsubscribe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test push notification (for testing purposes)
app.post('/api/push/test', authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;

    const payload = {
      title: title || 'Test Notification',
      body: body || 'This is a test push notification from EduckPro',
      icon: '/images/icon-192.png',
      badge: '/images/icon-192.png',
      data: {
        url: '/',
      },
    };

    const success = await pushService.sendPushNotification(req.user.id, payload);

    if (success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(404).json({ message: 'No push subscription found for this user' });
    }
  } catch (err) {
    console.error('Push test error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Parent gets all invoices for their children
app.get('/api/invoices/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can view their invoices' });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        student: {
          parentId: req.user.id,
        },
      },
      include: {
        student: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            enrollments: {
              include: {
                class: {
                  select: {
                    id: true,
                    name: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
        fee: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(invoices);
  } catch (err) {
    console.error('Get my invoices error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Parent "pays" an invoice (simulation, no real gateway yet)
app.post('/api/invoices/:id/pay', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only parents and admins can pay invoices' });
    }

    const invoiceId = Number(req.params.id);

    // For parents, make sure invoice belongs to them
    // For admins, allow any invoice
    const whereClause = req.user.role === 'parent' 
      ? {
          id: invoiceId,
          student: {
            parentId: req.user.id,
          },
        }
      : { id: invoiceId };

    const invoice = await prisma.invoice.findFirst({
      where: whereClause,
      include: {
        student: {
          include: {
            parent: true,
            enrollments: {
              include: {
                class: true,
              },
            },
          },
        },
        fee: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({ message: 'Invoice already paid' });
    }

    // Create payment record (simulate success)
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.amount,
        method: 'SIMULATED',
        status: 'SUCCESS',
        transactionRef: `SIM-${Date.now()}`,
      },
    });

    // Update invoice status to PAID
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: { 
        status: 'PAID',
        paidAt: new Date(),
      },
      include: { 
        student: {
          include: {
            parent: true,
            enrollments: {
              include: {
                class: true,
              },
            },
          },
        }, 
        fee: true,
        payments: true,
      },
    });

    // Send payment confirmation email
    try {
      const pdfBuffer = await generateInvoicePDF(updatedInvoice);
      
      if (invoice.student.parent && invoice.student.parent.email) {
        await sendPaymentConfirmationEmail(invoice.student.parent.email, updatedInvoice, pdfBuffer);
      }
    } catch (emailErr) {
      console.error('Error sending payment confirmation email:', emailErr);
      // Don't fail the request if email fails
    }

    // 🔴 Create in-app notification for parent
    if (invoice.student.parent) {
      await createNotification(
        invoice.student.parent.id,
        'payment',
        '✅ Payment Received',
        `Payment of ${invoice.amount.toLocaleString()} ${invoice.fee.name} confirmed for ${invoice.student.firstName} ${invoice.student.lastName}`,
        updatedInvoice.id,
        'payment'
      );
    }

    res.json({
      invoice: updatedInvoice,
      payment,
    });
  } catch (err) {
    console.error('Pay invoice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin updates invoice status
app.patch('/api/admin/invoices/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update invoice status' });
    }

    const invoiceId = Number(req.params.id);
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'PAID' && !invoice?.paidAt) {
      updateData.paidAt = new Date();
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      include: {
        student: {
          include: {
            parent: true,
            enrollments: {
              include: {
                class: true,
              },
            },
          },
        },
        fee: true,
        payments: true,
      },
    });

    res.json(invoice);
  } catch (err) {
    console.error('Update invoice status error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin updates invoice due date
app.patch('/api/admin/invoices/:id/due-date', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update invoice due date' });
    }

    const invoiceId = Number(req.params.id);
    const { dueDate } = req.body;

    if (!dueDate) {
      return res.status(400).json({ message: 'Due date is required' });
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { dueDate: new Date(dueDate) },
      include: {
        student: {
          include: {
            parent: true,
            enrollments: {
              include: {
                class: true,
              },
            },
          },
        },
        fee: true,
        payments: true,
      },
    });

    res.json(invoice);
  } catch (err) {
    console.error('Update invoice due date error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

const server = http.createServer(app);

io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Authenticate socket connections with the same JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('No token'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = payload; // { id, name, email, role }
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', socket => {
  console.log('Socket connected:', socket.user?.id);

  // Each user joins a private room
  if (socket.user?.id) {
    socket.join(`user:${socket.user.id}`);
  }

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.user?.id);
  });
});
// LIST users (with simple search & pagination)
app.get('/api/owner/users', authMiddleware, requireRoles('owner'), async (req, res) => {
  try {
    const { q = '', skip = '0', take = '50' } = req.query;
    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { name:   { contains: q, mode: 'insensitive' } },
              { email:  { contains: q, mode: 'insensitive' } },
              { role:   { equals: q.toLowerCase() } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      skip: Number(skip),
      take: Number(take),
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE user (owner can create any role)
app.post('/api/owner/users', authMiddleware, requireRoles('owner'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const allowed = ['parent', 'teacher', 'admin', 'owner'];
    if (!name || !email || !password || !role || !allowed.includes(role)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE user (change name/email/role/isActive)
app.patch('/api/owner/users/:id', authMiddleware, requireRoles('owner'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, role, isActive } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) {
      const allowed = ['parent', 'teacher', 'admin', 'owner'];
      if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' });
      data.role = role;
    }
    if (isActive !== undefined) data.isActive = !!isActive;

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    res.json(updated);
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// RESET password
app.patch('/api/owner/users/:id/password', authMiddleware, requireRoles('owner'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password too short' });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
    res.json({ message: 'Password updated' });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// SOFT DELETE (disable)
app.delete('/api/owner/users/:id', authMiddleware, requireRoles('owner'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, isActive: true },
    });
    res.json({ message: 'User disabled', user });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

function requireOwner(req, res, next) {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner only' });
  }
  next();
}
// ===== OWNER ROUTES (manage all users) =====

// GET /api/owner/users?search=...
app.get('/api/owner/users', authMiddleware, requireOwner, async (req, res) => {
  try {
    const { search } = req.query;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { school: true },
    });

    res.json(users);
  } catch (err) {
    console.error('Owner list users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/owner/users  (create user)
app.post('/api/owner/users', authMiddleware, requireOwner, async (req, res) => {
  try {
    const { name, email, password, role, schoolId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const allowedRoles = ['parent', 'teacher', 'admin', 'owner'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const data = {
      name,
      email,
      passwordHash,
      role,
    };

    // Attach schoolId for non-owner users
    if (role !== 'owner') {
      if (!schoolId) {
        return res.status(400).json({ message: 'schoolId is required for non-owner users' });
      }
      data.schoolId = Number(schoolId);
    }

    const user = await prisma.user.create({ data });

    res.status(201).json(user);
  } catch (err) {
    console.error('Owner create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/owner/users/:id/role  (change role)
app.patch(
  '/api/owner/users/:id/role',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { role } = req.body;

      const allowedRoles = ['parent', 'teacher', 'admin', 'owner'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      res.json(user);
    } catch (err) {
      console.error('Owner change role error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PATCH /api/owner/users/:id/status  (enable/disable user)
app.patch(
  '/api/owner/users/:id/status',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { isActive } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !!isActive },
      });

      res.json(user);
    } catch (err) {
      console.error('Owner change status error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST /api/owner/users/:id/reset-password
app.post(
  '/api/owner/users/:id/reset-password',
  authMiddleware,
  requireOwner,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);

      const tempPassword = generateTempPassword(10);
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const user = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });

      res.json({
        user,
        newPassword: tempPassword, // show once to owner
      });
    } catch (err) {
      console.error('Owner reset password error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
// ===== USER PROFILE ROUTES =====

// GET current user profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        school: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE profile (name, email)
app.patch('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const data = {};
    if (name) data.name = name;
    
    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      data.email = email;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    // Generate new token with updated info
    const token = createToken(user);

    res.json({ user, token });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CHANGE password
app.post('/api/profile/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== OWNER: SCHOOLS =====

// List schools
app.get('/api/owner/schools', authMiddleware, requireOwner, async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(schools);
  } catch (err) {
    console.error('Owner list schools error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create school
app.post('/api/owner/schools', authMiddleware, requireOwner, async (req, res) => {
  try {
    const { 
      name, 
      address, 
      city,
      state,
      country,
      postalCode,
      phone,
      email,
      website,
      description
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const school = await prisma.school.create({
      data: {
        name,
        address: address || null,
        city: city || null,
        state: state || null,
        country: country || null,
        postalCode: postalCode || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        description: description || null,
      },
    });

    res.status(201).json(school);
  } catch (err) {
    console.error('Owner create school error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin creates school (for themselves)
app.post('/api/schools', authMiddleware, async (req, res) => {
  try {
    // Only admins without a school can create one
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create schools' });
    }

    if (req.user.schoolId) {
      return res.status(400).json({ message: 'You already have a school assigned' });
    }

    const { 
      name, 
      address, 
      city,
      state,
      country,
      postalCode,
      phone,
      email,
      website,
      description
    } = req.body;
    
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    // Create the school
    const school = await prisma.school.create({
      data: {
        name,
        address,
        city: city || null,
        state: state || null,
        country: country || null,
        postalCode: postalCode || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        description: description || null,
      },
    });

    // Update the admin's schoolId
    await prisma.user.update({
      where: { id: req.user.id },
      data: { schoolId: school.id },
    });

    res.status(201).json(school);
  } catch (err) {
    console.error('Admin create school error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all schools (accessible by authenticated users - for parents to browse)
app.get('/api/schools', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { country: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const schools = await prisma.school.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            classes: true,
            students: true,
          },
        },
      },
    });

    res.json(schools);
  } catch (err) {
    console.error('Get schools error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get school by ID (accessible by authenticated users)
app.get('/api/schools/:id', authMiddleware, async (req, res) => {
  try {
    const schoolId = Number(req.params.id);
    
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        classes: {
          include: {
            enrollmentFee: true,
            tuitionFee: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json(school);
  } catch (err) {
    console.error('Get school error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update school (admin only)
app.patch('/api/schools/:id', authMiddleware, async (req, res) => {
  try {
    const schoolId = Number(req.params.id);
    
    // Only allow admins and owners
    if (req.user.role !== 'admin' && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only admins and owners can update schools' });
    }

    // For admins, verify they own this school by checking the database
    if (req.user.role === 'admin') {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { schoolId: true },
      });

      if (user.schoolId !== schoolId) {
        return res.status(403).json({ message: 'You can only update your own school' });
      }
    }

    const {
      name,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      email,
      website,
      description,
    } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (country !== undefined) data.country = country;
    if (postalCode !== undefined) data.postalCode = postalCode;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (website !== undefined) data.website = website;
    if (description !== undefined) data.description = description;

    const school = await prisma.school.update({
      where: { id: schoolId },
      data,
      include: {
        classes: {
          include: {
            enrollmentFee: true,
            tuitionFee: true,
          },
        },
      },
    });

    res.json(school);
  } catch (err) {
    console.error('Update school error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});



server.listen(PORT, () => {
  console.log(`School API + Socket.IO listening on http://localhost:${PORT}`);
});
