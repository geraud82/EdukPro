// ===========================
// Enrollment Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all enrollments
 * GET /api/enrollments
 */
const getAllEnrollments = asyncHandler(async (req, res) => {
  const { schoolId, classId, studentId, status } = req.query;
  
  let where = {};
  
  if (classId) where.classId = Number(classId);
  if (studentId) where.studentId = Number(studentId);
  if (status) where.status = status;
  
  // Filter by school through class
  if (schoolId) {
    where.class = { schoolId: Number(schoolId) };
  }
  
  // Parent can only see their children's enrollments
  if (req.user.role === 'parent') {
    where.student = { parentId: req.user.id };
  }
  
  // Admin/Teacher see only their school
  if (['admin', 'teacher'].includes(req.user.role) && req.user.schoolId) {
    where.class = { schoolId: req.user.schoolId };
  }

  const enrollments = await prisma.enrollment.findMany({
    where,
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      class: {
        select: {
          id: true,
          name: true,
          school: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(enrollments);
});

/**
 * Get enrollment by ID
 * GET /api/enrollments/:id
 */
const getEnrollmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: Number(id) },
    include: {
      student: true,
      class: {
        include: {
          school: true,
          teacher: { select: { id: true, name: true } },
          enrollmentFee: true,
          tuitionFee: true,
        },
      },
    },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  res.json(enrollment);
});

/**
 * Create enrollment (request enrollment)
 * POST /api/enrollments
 */
const createEnrollment = asyncHandler(async (req, res) => {
  const { studentId, classId } = req.body;

  if (!studentId || !classId) {
    throw new ApiError(400, 'Student ID and Class ID are required');
  }

  // Verify student exists
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
  });

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Parent can only enroll their own children
  if (req.user.role === 'parent' && student.parentId !== req.user.id) {
    throw new ApiError(403, 'You can only enroll your own children');
  }

  // Check if already enrolled
  const existing = await prisma.enrollment.findFirst({
    where: {
      studentId: Number(studentId),
      classId: Number(classId),
    },
  });

  if (existing) {
    throw new ApiError(409, 'Student is already enrolled or has pending enrollment in this class');
  }

  // Get class info for school assignment
  const classInfo = await prisma.class.findUnique({
    where: { id: Number(classId) },
  });

  if (!classInfo) {
    throw new ApiError(404, 'Class not found');
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: Number(studentId),
      classId: Number(classId),
      status: 'pending',
    },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      class: {
        select: {
          id: true,
          name: true,
          school: { select: { id: true, name: true } },
        },
      },
    },
  });

  // Update student's school if not set
  if (!student.schoolId) {
    await prisma.student.update({
      where: { id: Number(studentId) },
      data: { schoolId: classInfo.schoolId },
    });
  }

  res.status(201).json(enrollment);
});

/**
 * Update enrollment status (approve/reject)
 * PATCH /api/enrollments/:id
 */
const updateEnrollment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Valid status is required (pending, approved, rejected)');
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: Number(id) },
    include: {
      class: true,
      student: true,
    },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  // Only admin/owner can approve/reject
  if (['admin', 'teacher'].includes(req.user.role) && req.user.schoolId !== enrollment.class.schoolId) {
    throw new ApiError(403, 'Access denied');
  }

  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: Number(id) },
    data: { status },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      class: {
        select: {
          id: true,
          name: true,
          school: { select: { id: true, name: true } },
          enrollmentFee: true,
          tuitionFee: true,
        },
      },
    },
  });

  // If approved, create invoices for fees
  if (status === 'approved') {
    const classWithFees = await prisma.class.findUnique({
      where: { id: enrollment.classId },
      include: { enrollmentFee: true, tuitionFee: true },
    });

    if (classWithFees.enrollmentFee) {
      await prisma.invoice.create({
        data: {
          studentId: enrollment.studentId,
          feeId: classWithFees.enrollmentFee.id,
          amount: classWithFees.enrollmentFee.amount,
          currency: classWithFees.enrollmentFee.currency,
          status: 'pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    if (classWithFees.tuitionFee) {
      await prisma.invoice.create({
        data: {
          studentId: enrollment.studentId,
          feeId: classWithFees.tuitionFee.id,
          amount: classWithFees.tuitionFee.amount,
          currency: classWithFees.tuitionFee.currency,
          status: 'pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }
  }

  res.json(updatedEnrollment);
});

/**
 * Delete enrollment
 * DELETE /api/enrollments/:id
 */
const deleteEnrollment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: Number(id) },
    include: { class: true, student: true },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }

  // Check access
  if (req.user.role === 'parent' && enrollment.student.parentId !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  await prisma.enrollment.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Enrollment deleted successfully' });
});

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
