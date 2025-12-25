// ===========================
// Notification Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
  const { limit = 50, unreadOnly } = req.query;

  const where = { userId: req.user.id };
  
  if (unreadOnly === 'true') {
    where.isRead = false;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
  });

  res.json(notifications);
});

/**
 * Get unread notification count
 * GET /api/notifications/unread-count
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await prisma.notification.count({
    where: {
      userId: req.user.id,
      isRead: false,
    },
  });

  res.json({ count });
});

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findUnique({
    where: { id: Number(id) },
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.userId !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  const updated = await prisma.notification.update({
    where: { id: Number(id) },
    data: { isRead: true },
  });

  res.json(updated);
});

/**
 * Mark all notifications as read
 * POST /api/notifications/mark-all-read
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  res.json({ message: 'All notifications marked as read' });
});

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findUnique({
    where: { id: Number(id) },
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.userId !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  await prisma.notification.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Notification deleted successfully' });
});

/**
 * Create notification (internal use / admin)
 * POST /api/notifications
 */
const createNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, type, link } = req.body;

  if (!userId || !title || !message) {
    throw new ApiError(400, 'User ID, title, and message are required');
  }

  const notification = await prisma.notification.create({
    data: {
      userId: Number(userId),
      title,
      message,
      type: type || 'info',
      link,
    },
  });

  // Emit socket event for real-time notification
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }

  res.status(201).json(notification);
});

/**
 * Send notification to multiple users
 * POST /api/notifications/bulk
 */
const sendBulkNotifications = asyncHandler(async (req, res) => {
  const { userIds, title, message, type, link } = req.body;

  if (!userIds || !Array.isArray(userIds) || !title || !message) {
    throw new ApiError(400, 'User IDs array, title, and message are required');
  }

  const notifications = await prisma.notification.createMany({
    data: userIds.map(userId => ({
      userId: Number(userId),
      title,
      message,
      type: type || 'info',
      link,
    })),
  });

  // Emit socket events for real-time notifications
  const io = req.app.get('io');
  if (io) {
    userIds.forEach(userId => {
      io.to(`user:${userId}`).emit('notification:new', { title, message, type, link });
    });
  }

  res.status(201).json({ count: notifications.count });
});

/**
 * Helper: Create notification for a user (used by other controllers)
 */
const createNotificationForUser = async (userId, title, message, type = 'info', link = null, io = null) => {
  const notification = await prisma.notification.create({
    data: {
      userId: Number(userId),
      title,
      message,
      type,
      link,
    },
  });

  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }

  return notification;
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  sendBulkNotifications,
  createNotificationForUser,
};
