// ===========================
// School Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all schools (with optional search)
 * GET /api/schools
 */
const getAllSchools = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  const where = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { country: { contains: search, mode: 'insensitive' } },
    ],
  } : {};

  const schools = await prisma.school.findMany({
    where,
    include: {
      _count: {
        select: {
          students: true,
          classes: true,
          users: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json(schools);
});

/**
 * Get school by ID
 * GET /api/schools/:id
 */
const getSchoolById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const school = await prisma.school.findUnique({
    where: { id: Number(id) },
    include: {
      classes: {
        include: {
          teacher: { select: { id: true, name: true, email: true } },
          enrollmentFee: true,
          tuitionFee: true,
        },
      },
      _count: {
        select: {
          students: true,
          classes: true,
          users: true,
        },
      },
    },
  });

  if (!school) {
    throw new ApiError(404, 'School not found');
  }

  res.json(school);
});

/**
 * Create a new school (Admin only)
 * POST /api/schools
 */
const createSchool = asyncHandler(async (req, res) => {
  const { name, address, city, state, country, postalCode, phone, email, website, description } = req.body;

  if (!name) {
    throw new ApiError(400, 'School name is required');
  }

  const school = await prisma.school.create({
    data: {
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
    },
  });

  // Link admin to school
  if (req.user.role === 'admin') {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { schoolId: school.id },
    });
  }

  res.status(201).json(school);
});

/**
 * Update school
 * PATCH /api/schools/:id
 */
const updateSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, country, postalCode, phone, email, website, description } = req.body;

  // Check if user has access to this school
  if (req.user.role !== 'owner' && req.user.schoolId !== Number(id)) {
    throw new ApiError(403, 'Access denied');
  }

  const school = await prisma.school.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(country !== undefined && { country }),
      ...(postalCode !== undefined && { postalCode }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(website !== undefined && { website }),
      ...(description !== undefined && { description }),
    },
  });

  res.json(school);
});

/**
 * Delete school (Owner only)
 * DELETE /api/schools/:id
 */
const deleteSchool = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.school.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'School deleted successfully' });
});

module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
};
