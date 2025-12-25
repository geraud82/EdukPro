// ===========================
// Student Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all students
 * GET /api/students
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const { schoolId, parentId } = req.query;
  
  let where = {};
  
  // Filter by school
  if (schoolId) {
    where.schoolId = Number(schoolId);
  }
  
  // Filter by parent (for parent users)
  if (req.user.role === 'parent') {
    where.parentId = req.user.id;
  } else if (parentId) {
    where.parentId = Number(parentId);
  }
  
  // Filter by user's school if admin/teacher
  if (['admin', 'teacher'].includes(req.user.role) && req.user.schoolId) {
    where.schoolId = req.user.schoolId;
  }

  const students = await prisma.student.findMany({
    where,
    include: {
      school: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true, email: true } },
      enrollments: {
        include: {
          class: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { lastName: 'asc' },
  });

  res.json(students);
});

/**
 * Get student by ID
 * GET /api/students/:id
 */
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
    include: {
      school: true,
      parent: { select: { id: true, name: true, email: true } },
      enrollments: {
        include: {
          class: {
            include: {
              teacher: { select: { id: true, name: true } },
            },
          },
        },
      },
      invoices: {
        include: {
          fee: true,
          payments: true,
        },
      },
    },
  });

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Check access
  if (req.user.role === 'parent' && student.parentId !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  res.json(student);
});

/**
 * Create a new student
 * POST /api/students
 */
const createStudent = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    medicalInfo,
    notes,
    schoolId,
  } = req.body;

  if (!firstName || !lastName) {
    throw new ApiError(400, 'First name and last name are required');
  }

  // Parent creates their own child
  let parentId = req.user.role === 'parent' ? req.user.id : req.body.parentId;

  const student = await prisma.student.create({
    data: {
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      address,
      medicalInfo,
      notes,
      schoolId: schoolId ? Number(schoolId) : null,
      parentId: parentId ? Number(parentId) : null,
    },
    include: {
      school: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true, email: true } },
    },
  });

  res.status(201).json(student);
});

/**
 * Update student
 * PATCH /api/students/:id
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    medicalInfo,
    notes,
    schoolId,
  } = req.body;

  const existingStudent = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!existingStudent) {
    throw new ApiError(404, 'Student not found');
  }

  // Check access
  if (req.user.role === 'parent' && existingStudent.parentId !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  const student = await prisma.student.update({
    where: { id: Number(id) },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
      ...(gender !== undefined && { gender }),
      ...(address !== undefined && { address }),
      ...(medicalInfo !== undefined && { medicalInfo }),
      ...(notes !== undefined && { notes }),
      ...(schoolId !== undefined && { schoolId: schoolId ? Number(schoolId) : null }),
    },
    include: {
      school: { select: { id: true, name: true } },
      parent: { select: { id: true, name: true, email: true } },
    },
  });

  res.json(student);
});

/**
 * Delete student
 * DELETE /api/students/:id
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingStudent = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!existingStudent) {
    throw new ApiError(404, 'Student not found');
  }

  // Check access
  if (req.user.role === 'parent' && existingStudent.parentId !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  await prisma.student.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Student deleted successfully' });
});

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
