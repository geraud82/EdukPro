// ===========================
// Owner Controller
// ===========================

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get dashboard statistics (Owner only)
 * GET /api/owner/dashboard/stats
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts
  const [
    totalUsers,
    activeUsers,
    totalSchools,
    totalStudents,
    totalClasses,
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    totalEnrollments,
    recentUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.school.count(),
    prisma.student.count(),
    prisma.class.count(),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: 'PAID' } }),
    prisma.invoice.count({ where: { status: 'PENDING' } }),
    prisma.enrollment.count({ where: { status: 'APPROVED' } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        school: {
          select: { id: true, name: true }
        }
      }
    })
  ]);

  // Calculate revenue
  const invoices = await prisma.invoice.findMany({
    where: { status: 'PAID' },
    select: { amount: true }
  });
  
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  // Get users by role
  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: true
  });

  const roleDistribution = {
    parent: 0,
    teacher: 0,
    admin: 0,
    owner: 0
  };

  usersByRole.forEach(item => {
    roleDistribution[item.role] = item._count;
  });

  // Get growth data (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newUsersThisWeek = await prisma.user.count({
    where: { createdAt: { gte: sevenDaysAgo } }
  });

  const newSchoolsThisWeek = await prisma.school.count({
    where: { createdAt: { gte: sevenDaysAgo } }
  });

  res.json({
    overview: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalSchools,
      totalStudents,
      totalClasses,
      totalEnrollments
    },
    financial: {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalRevenue,
      averageInvoiceValue: totalInvoices > 0 ? totalRevenue / paidInvoices : 0
    },
    userDistribution: roleDistribution,
    growth: {
      newUsersThisWeek,
      newSchoolsThisWeek
    },
    recentActivity: {
      recentUsers
    }
  });
});

/**
 * Get platform analytics (Owner only)
 * GET /api/owner/analytics
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // days
  
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period));

  // User growth over time
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: daysAgo } },
    select: { createdAt: true, role: true },
    orderBy: { createdAt: 'asc' }
  });

  // Schools growth
  const schools = await prisma.school.findMany({
    where: { createdAt: { gte: daysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' }
  });

  // Revenue over time
  const paidInvoices = await prisma.invoice.findMany({
    where: { 
      updatedAt: { gte: daysAgo },
      status: 'PAID'
    },
    select: { updatedAt: true, amount: true },
    orderBy: { updatedAt: 'asc' }
  });

  // Enrollments over time
  const enrollments = await prisma.enrollment.findMany({
    where: { createdAt: { gte: daysAgo } },
    select: { createdAt: true, status: true },
    orderBy: { createdAt: 'asc' }
  });

  // Top schools by students
  const topSchools = await prisma.school.findMany({
    take: 10,
    include: {
      _count: {
        select: {
          students: true,
          classes: true,
          users: true
        }
      }
    },
    orderBy: {
      students: {
        _count: 'desc'
      }
    }
  });

  res.json({
    period: parseInt(period),
    userGrowth: users,
    schoolGrowth: schools,
    revenueGrowth: paidInvoices,
    enrollmentGrowth: enrollments,
    topSchools: topSchools.map(school => ({
      id: school.id,
      name: school.name,
      studentsCount: school._count.students,
      classesCount: school._count.classes,
      usersCount: school._count.users
    }))
  });
});

/**
 * Get all schools with details (Owner only)
 * GET /api/owner/schools
 */
const getAllSchools = asyncHandler(async (req, res) => {
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
    include: {
      _count: {
        select: {
          students: true,
          classes: true,
          users: true,
          fees: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(schools);
});

/**
 * Get all users (Owner only)
 * GET /api/owner/users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, status, schoolId } = req.query;

  const where = {};

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Role filter
  if (role) {
    where.role = role;
  }

  // Status filter
  if (status) {
    where.isActive = status === 'active';
  }

  // School filter
  if (schoolId) {
    where.schoolId = Number(schoolId);
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      schoolId: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          children: true,
          teacherClasses: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(users);
});

/**
 * Create a new user (Owner only)
 * POST /api/owner/users
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, schoolId } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'Missing required fields: name, email, password, role');
  }

  const allowedRoles = ['parent', 'teacher', 'admin', 'owner'];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  // Check if email exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new ApiError(409, 'Email already registered');
  }

  // Owner role doesn't need a school, others do
  if (role !== 'owner' && !schoolId) {
    throw new ApiError(400, 'schoolId is required for non-owner roles');
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      schoolId: role === 'owner' ? null : Number(schoolId),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      schoolId: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.status(201).json(user);
});

/**
 * Update user role (Owner only)
 * PATCH /api/owner/users/:id/role
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ['parent', 'teacher', 'admin', 'owner'];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      schoolId: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json(user);
});

/**
 * Update user status (Owner only)
 * PATCH /api/owner/users/:id/status
 */
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean');
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      schoolId: true,
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json(user);
});

/**
 * Reset user password (Owner only)
 * POST /api/owner/users/:id/reset-password
 */
const resetUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Generate a random temporary password
  const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: Number(id) },
    data: { passwordHash },
  });

  res.json({
    message: 'Password reset successful',
    newPassword: tempPassword,
  });
});

/**
 * Delete user (Owner only)
 * DELETE /api/owner/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);

  // Prevent owner from deleting themselves
  if (userId === req.user.id) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  // Check if user exists and get related data counts
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          children: true,
          teacherClasses: true,
          sentMessages: true,
          receivedMessages: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check for related data that would prevent deletion
  const relatedData = [];
  
  if (user._count.children > 0) {
    relatedData.push(`${user._count.children} student(s)`);
  }
  
  if (user._count.teacherClasses > 0) {
    relatedData.push(`${user._count.teacherClasses} class(es) as teacher`);
  }

  if (relatedData.length > 0) {
    throw new ApiError(400, 
      `Cannot delete user with related data: ${relatedData.join(', ')}. ` +
      `Please reassign or delete the related records first, or disable the user account instead.`
    );
  }

  // If no related data, proceed with deletion
  // Delete messages first (if any)
  await prisma.message.deleteMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
  });

  // Delete notifications
  await prisma.notification.deleteMany({
    where: { userId },
  });

  // Now delete the user
  await prisma.user.delete({
    where: { id: userId },
  });

  res.json({
    message: 'User deleted successfully',
  });
});

/**
 * Bulk update users status (Owner only)
 * POST /api/owner/users/bulk-status
 */
const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const { userIds, isActive } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError(400, 'userIds must be a non-empty array');
  }

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean');
  }

  await prisma.user.updateMany({
    where: {
      id: { in: userIds.map(id => Number(id)) }
    },
    data: { isActive }
  });

  res.json({
    message: `Successfully updated ${userIds.length} user(s)`,
    count: userIds.length
  });
});

module.exports = {
  getDashboardStats,
  getAnalytics,
  getAllSchools,
  getAllUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
  bulkUpdateStatus,
};
