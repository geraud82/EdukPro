// ===========================
// Teacher Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get teacher's assigned classes
 * GET /api/teachers/my-classes
 */
const getMyClasses = asyncHandler(async (req, res) => {
  if (req.user.role !== 'teacher') {
    throw new ApiError(403, 'Only teachers can access this endpoint');
  }

  const classes = await prisma.class.findMany({
    where: {
      teachers: {
        some: {
          teacherId: req.user.id,
        },
      },
    },
    include: {
      school: { select: { id: true, name: true, address: true } },
      teachers: {
        include: {
          teacher: { select: { id: true, name: true, email: true } },
        },
      },
      enrollmentFee: true,
      tuitionFee: true,
      enrollments: {
        where: { status: 'APPROVED' },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              parent: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { name: 'asc' },
  });

  res.json(classes);
});

/**
 * Get all students of a teacher (across all assigned classes)
 * GET /api/teachers/my-students
 */
const getMyStudents = asyncHandler(async (req, res) => {
  if (req.user.role !== 'teacher') {
    throw new ApiError(403, 'Only teachers can access this endpoint');
  }

  const classes = await prisma.class.findMany({
    where: {
      teachers: {
        some: {
          teacherId: req.user.id,
        },
      },
    },
    include: {
      enrollments: {
        where: { status: 'APPROVED' },
        include: {
          student: {
            include: {
              parent: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          class: {
            select: { id: true, name: true, level: true },
          },
        },
      },
    },
  });

  // Flatten all students from all classes
  const students = [];
  const studentIds = new Set();

  classes.forEach(cls => {
    cls.enrollments.forEach(enrollment => {
      if (!studentIds.has(enrollment.student.id)) {
        studentIds.add(enrollment.student.id);
        students.push({
          ...enrollment.student,
          enrolledClasses: classes
            .filter(c => c.enrollments.some(e => e.studentId === enrollment.student.id))
            .map(c => ({
              id: c.id,
              name: c.name,
              level: c.level,
            })),
        });
      }
    });
  });

  res.json(students);
});

/**
 * Assign teacher to a class (Admin only)
 * POST /api/teachers/:teacherId/classes/:classId
 */
const assignToClass = asyncHandler(async (req, res) => {
  const { teacherId, classId } = req.params;

  // Verify admin access
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    throw new ApiError(403, 'Only admins can assign teachers to classes');
  }

  // Verify teacher exists and is a teacher
  const teacher = await prisma.user.findUnique({
    where: { id: Number(teacherId) },
  });

  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  if (teacher.role !== 'teacher') {
    throw new ApiError(400, 'User is not a teacher');
  }

  // Verify class exists
  const classData = await prisma.class.findUnique({
    where: { id: Number(classId) },
  });

  if (!classData) {
    throw new ApiError(404, 'Class not found');
  }

  // For admins, verify they manage the same school
  if (req.user.role === 'admin') {
    if (!req.user.schoolId || req.user.schoolId !== classData.schoolId) {
      throw new ApiError(403, 'You can only assign teachers to classes in your school');
    }
    if (teacher.schoolId !== req.user.schoolId) {
      throw new ApiError(403, 'You can only assign teachers from your school');
    }
  }

  // Check if assignment already exists
  const existingAssignment = await prisma.classTeacher.findUnique({
    where: {
      classId_teacherId: {
        classId: Number(classId),
        teacherId: Number(teacherId),
      },
    },
  });

  if (existingAssignment) {
    throw new ApiError(400, 'Teacher is already assigned to this class');
  }

  // Create the assignment
  const assignment = await prisma.classTeacher.create({
    data: {
      classId: Number(classId),
      teacherId: Number(teacherId),
    },
    include: {
      teacher: { select: { id: true, name: true, email: true } },
      class: { select: { id: true, name: true, level: true } },
    },
  });

  res.status(201).json({
    message: 'Teacher assigned to class successfully',
    assignment,
  });
});

/**
 * Remove teacher from a class (Admin only)
 * DELETE /api/teachers/:teacherId/classes/:classId
 */
const removeFromClass = asyncHandler(async (req, res) => {
  const { teacherId, classId } = req.params;

  // Verify admin access
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    throw new ApiError(403, 'Only admins can remove teachers from classes');
  }

  // Verify class exists
  const classData = await prisma.class.findUnique({
    where: { id: Number(classId) },
  });

  if (!classData) {
    throw new ApiError(404, 'Class not found');
  }

  // For admins, verify they manage the same school
  if (req.user.role === 'admin' && req.user.schoolId !== classData.schoolId) {
    throw new ApiError(403, 'You can only manage teachers in your school');
  }

  // Find and delete the assignment
  const assignment = await prisma.classTeacher.findUnique({
    where: {
      classId_teacherId: {
        classId: Number(classId),
        teacherId: Number(teacherId),
      },
    },
  });

  if (!assignment) {
    throw new ApiError(404, 'Teacher is not assigned to this class');
  }

  await prisma.classTeacher.delete({
    where: {
      id: assignment.id,
    },
  });

  res.json({ message: 'Teacher removed from class successfully' });
});

/**
 * Get all teachers with their assigned classes (Admin only)
 * GET /api/teachers
 */
const getAllTeachers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    throw new ApiError(403, 'Access denied');
  }

  const where = { role: 'teacher' };

  // Filter by school for admins
  if (req.user.role === 'admin' && req.user.schoolId) {
    where.schoolId = req.user.schoolId;
  }

  const teachers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      schoolId: true,
      school: { select: { id: true, name: true } },
      teacherClasses: {
        include: {
          class: {
            select: {
              id: true,
              name: true,
              level: true,
              _count: { select: { enrollments: true } },
            },
          },
        },
      },
      _count: { select: { teacherClasses: true } },
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });

  res.json(teachers);
});

/**
 * Create teacher (Admin only)
 * POST /api/teachers
 */
const createTeacher = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    throw new ApiError(403, 'Access denied');
  }

  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw new ApiError(400, 'Missing required fields: name, email, password');
  }

  // Validate admin has a school assigned
  if (req.user.role === 'admin' && !req.user.schoolId) {
    throw new ApiError(403, 'Admin account must be associated with a school to create teachers');
  }

  // Check if email exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new ApiError(409, 'Email already registered');
  }

  // Hash password
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash(password, 10);

  // Create teacher with admin's school
  const teacher = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'teacher',
      schoolId: req.user.role === 'admin' ? req.user.schoolId : (req.body.schoolId ? Number(req.body.schoolId) : null),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      schoolId: true,
      school: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  res.status(201).json({
    message: 'Teacher created successfully',
    teacher,
  });
});

module.exports = {
  getMyClasses,
  getMyStudents,
  assignToClass,
  removeFromClass,
  getAllTeachers,
  createTeacher,
};
