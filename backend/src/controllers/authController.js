// ===========================
// Auth Controller
// ===========================

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { createToken } = require('../middleware/auth');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'Missing required fields: name, email, password, role');
  }

  const allowedRoles = ['parent', 'teacher', 'admin', 'owner'];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role. Allowed: parent, teacher, admin, owner');
  }

  // Check if email exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new ApiError(409, 'Email already registered');
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  const token = createToken(user);

  res.status(201).json({
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    },
    token,
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is disabled');
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
});

/**
 * Get current user profile
 * GET /api/profile
 */
const getProfile = asyncHandler(async (req, res) => {
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
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(user);
});

/**
 * Update user profile
 * PATCH /api/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Check if new email is already taken
  if (email && email !== req.user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new ApiError(409, 'Email already in use');
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  const token = createToken(user);

  res.json({ user, token });
});

/**
 * Change password
 * POST /api/profile/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  
  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash },
  });

  res.json({ message: 'Password changed successfully' });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
