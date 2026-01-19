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
  const { name, level, description, schoolId, teacherId, enrollmentFeeId, tuitionFeeId } = req.body;

  if (!name) {
    throw new ApiError(400, 'Class name is required');
  }

  // Determine the schoolId to use
  let targetSchoolId = schoolId ? Number(schoolId) : null;
  
  // Verify school access based on role
  if (req.user.role === 'owner') {
    // Owner can create classes for any school, but schoolId must be provided
    if (!targetSchoolId) {
      throw new ApiError(400, 'School ID is required');
    }
  } else if (req.user.role === 'admin' || req.user.role === 'school_admin') {
    // Admin can only create classes for their own school
    if (!req.user.schoolId) {
      throw new ApiError(400, 'Admin must be associated with a school first');
    }
    
    // If schoolId is provided, it must match admin's school
    if (targetSchoolId && targetSchoolId !== req.user.schoolId) {
      throw new ApiError(403, 'Access denied: You can only create classes for your own school');
    }
    
    // Use admin's schoolId
    targetSchoolId = req.user.schoolId;
  } else {
    // Other roles cannot create classes
    throw new ApiError(403, 'Insufficient permissions to create classes');
  }

  // Validate fee IDs if provided
  if (enrollmentFeeId) {
    const fee = await prisma.fee.findUnique({
      where: { id: Number(enrollmentFeeId) },
    });
    if (!fee) {
      throw new ApiError(404, 'Enrollment fee not found');
    }
    if (fee.schoolId !== targetSchoolId) {
      throw new ApiError(403, 'Enrollment fee does not belong to this school');
    }
  }

  if (tuitionFeeId) {
    const fee = await prisma.fee.findUnique({
      where: { id: Number(tuitionFeeId) },
    });
    if (!fee) {
      throw new ApiError(404, 'Tuition fee not found');
    }
    if (fee.schoolId !== targetSchoolId) {
      throw new ApiError(403, 'Tuition fee does not belong to this school');
    }
  }

  const classData = await prisma.class.create({
    data: {
      name,
      level,
      description,
      schoolId: targetSchoolId,
      teacherId: teacherId ? Number(teacherId) : null,
      enrollmentFeeId: enrollmentFeeId ? Number(enrollmentFeeId) : null,
      tuitionFeeId: tuitionFeeId ? Number(tuitionFeeId) : null,
    },
    include: {
      school: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      enrollmentFee: true,
      tuitionFee: true,
    },
  });

  res.status(201).json(classData);
});

/**
 * Update class
 * PATCH /api/classes/:id
 */
const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, level, description, teacherId, enrollmentFeeId, tuitionFeeId } = req.body;

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

  // Validate fee IDs if provided
  if (enrollmentFeeId !== undefined && enrollmentFeeId !== null && enrollmentFeeId !== '') {
    const fee = await prisma.fee.findUnique({
      where: { id: Number(enrollmentFeeId) },
    });
    if (!fee) {
      throw new ApiError(404, 'Enrollment fee not found');
    }
    if (fee.schoolId !== existingClass.schoolId) {
      throw new ApiError(403, 'Enrollment fee does not belong to this school');
    }
  }

  if (tuitionFeeId !== undefined && tuitionFeeId !== null && tuitionFeeId !== '') {
    const fee = await prisma.fee.findUnique({
      where: { id: Number(tuitionFeeId) },
    });
    if (!fee) {
      throw new ApiError(404, 'Tuition fee not found');
    }
    if (fee.schoolId !== existingClass.schoolId) {
      throw new ApiError(403, 'Tuition fee does not belong to this school');
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (level !== undefined) updateData.level = level;
  if (description !== undefined) updateData.description = description;
  if (teacherId !== undefined) updateData.teacherId = teacherId ? Number(teacherId) : null;
  if (enrollmentFeeId !== undefined) updateData.enrollmentFeeId = enrollmentFeeId ? Number(enrollmentFeeId) : null;
  if (tuitionFeeId !== undefined) updateData.tuitionFeeId = tuitionFeeId ? Number(tuitionFeeId) : null;

  const classData = await prisma.class.update({
    where: { id: Number(id) },
    data: updateData,
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
