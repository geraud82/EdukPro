// ===========================
// Class Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all classes
 * GET /api/classes
 */
const getAllClasses = asyncHandler(async (req, res) => {
  const { schoolId } = req.query;
  
  const where = schoolId ? { schoolId: Number(schoolId) } : {};
  
  // Filter by user's school if not owner
  if (req.user.role !== 'owner' && req.user.schoolId) {
    where.schoolId = req.user.schoolId;
  }

  const classes = await prisma.class.findMany({
    where,
    include: {
      school: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true, email: true } },
      enrollmentFee: true,
      tuitionFee: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { name: 'asc' },
  });

  res.json(classes);
});

/**
 * Get class by ID
 * GET /api/classes/:id
 */
const getClassById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const classData = await prisma.class.findUnique({
    where: { id: Number(id) },
    include: {
      school: true,
      teacher: { select: { id: true, name: true, email: true } },
      enrollmentFee: true,
      tuitionFee: true,
      enrollments: {
        include: {
          student: true,
        },
      },
    },
  });

  if (!classData) {
    throw new ApiError(404, 'Class not found');
  }

  res.json(classData);
});

/**
 * Create a new class
 * POST /api/classes
 */
const createClass = asyncHandler(async (req, res) => {
  const { name, level, description, schoolId, teacherId, enrollmentFee, tuitionFee } = req.body;

  if (!name || !schoolId) {
    throw new ApiError(400, 'Name and schoolId are required');
  }

  // Verify school access
  if (req.user.role !== 'owner' && req.user.schoolId !== Number(schoolId)) {
    throw new ApiError(403, 'Access denied to this school');
  }

  const classData = await prisma.class.create({
    data: {
      name,
      level,
      description,
      schoolId: Number(schoolId),
      teacherId: teacherId ? Number(teacherId) : null,
    },
    include: {
      school: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
    },
  });

  // Create fees if provided
  if (enrollmentFee) {
    await prisma.fee.create({
      data: {
        name: `${name} - Enrollment Fee`,
        amount: Number(enrollmentFee.amount),
        currency: enrollmentFee.currency || 'XOF',
        type: 'enrollment',
        schoolId: Number(schoolId),
        classEnrollmentFeeId: classData.id,
      },
    });
  }

  if (tuitionFee) {
    await prisma.fee.create({
      data: {
        name: `${name} - Tuition Fee`,
        amount: Number(tuitionFee.amount),
        currency: tuitionFee.currency || 'XOF',
        type: 'tuition',
        schoolId: Number(schoolId),
        classTuitionFeeId: classData.id,
      },
    });
  }

  // Re-fetch with fees
  const result = await prisma.class.findUnique({
    where: { id: classData.id },
    include: {
      school: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      enrollmentFee: true,
      tuitionFee: true,
    },
  });

  res.status(201).json(result);
});

/**
 * Update class
 * PATCH /api/classes/:id
 */
const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, level, description, teacherId } = req.body;

  // Verify class exists and user has access
  const existingClass = await prisma.class.findUnique({
    where: { id: Number(id) },
  });

  if (!existingClass) {
    throw new ApiError(404, 'Class not found');
  }

  if (req.user.role !== 'owner' && req.user.schoolId !== existingClass.schoolId) {
    throw new ApiError(403, 'Access denied');
  }

  const classData = await prisma.class.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(level !== undefined && { level }),
      ...(description !== undefined && { description }),
      ...(teacherId !== undefined && { teacherId: teacherId ? Number(teacherId) : null }),
    },
    include: {
      school: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      enrollmentFee: true,
      tuitionFee: true,
    },
  });

  res.json(classData);
});

/**
 * Delete class
 * DELETE /api/classes/:id
 */
const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existingClass = await prisma.class.findUnique({
    where: { id: Number(id) },
  });

  if (!existingClass) {
    throw new ApiError(404, 'Class not found');
  }

  if (req.user.role !== 'owner' && req.user.schoolId !== existingClass.schoolId) {
    throw new ApiError(403, 'Access denied');
  }

  await prisma.class.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Class deleted successfully' });
});

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
