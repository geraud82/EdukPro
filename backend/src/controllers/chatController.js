// ===========================
// Chat Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * Get all conversations for current user
 * GET /api/chat/conversations
 */
const getConversations = asyncHandler(async (req, res) => {
  // Get unique users the current user has chatted with
  const sentMessages = await prisma.message.findMany({
    where: { senderId: req.user.id },
    select: { receiverId: true },
    distinct: ['receiverId'],
  });

  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: req.user.id },
    select: { senderId: true },
    distinct: ['senderId'],
  });

  const userIds = new Set([
    ...sentMessages.map(m => m.receiverId),
    ...receivedMessages.map(m => m.senderId),
  ]);

  // Get user details and last message for each conversation
  const conversations = await Promise.all(
    Array.from(userIds).map(async (userId) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
      });

      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: req.user.id, receiverId: userId },
            { senderId: userId, receiverId: req.user.id },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      const unreadCount = await prisma.message.count({
        where: {
          senderId: userId,
          receiverId: req.user.id,
          isRead: false,
        },
      });

      return {
        user,
        lastMessage,
        unreadCount,
      };
    })
  );

  // Sort by last message date
  conversations.sort((a, b) => {
    const dateA = a.lastMessage?.createdAt || new Date(0);
    const dateB = b.lastMessage?.createdAt || new Date(0);
    return dateB - dateA;
  });

  res.json(conversations);
});

/**
 * Get messages with a specific user
 * GET /api/chat/messages/:userId
 */
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit = 50, before } = req.query;

  const where = {
    OR: [
      { senderId: req.user.id, receiverId: Number(userId) },
      { senderId: Number(userId), receiverId: req.user.id },
    ],
  };

  if (before) {
    where.createdAt = { lt: new Date(before) };
  }

  const messages = await prisma.message.findMany({
    where,
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      senderId: Number(userId),
      receiverId: req.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  res.json(messages.reverse());
});

/**
 * Send a message
 * POST /api/chat/messages
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    throw new ApiError(400, 'Receiver ID and content are required');
  }

  // Verify receiver exists
  const receiver = await prisma.user.findUnique({
    where: { id: Number(receiverId) },
  });

  if (!receiver) {
    throw new ApiError(404, 'Receiver not found');
  }

  const message = await prisma.message.create({
    data: {
      senderId: req.user.id,
      receiverId: Number(receiverId),
      content,
    },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });

  // Emit socket event for real-time messaging
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${receiverId}`).emit('chat:message', message);
  }

  res.status(201).json(message);
});

/**
 * Mark messages as read
 * POST /api/chat/messages/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { senderId } = req.body;

  if (!senderId) {
    throw new ApiError(400, 'Sender ID is required');
  }

  await prisma.message.updateMany({
    where: {
      senderId: Number(senderId),
      receiverId: req.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  res.json({ message: 'Messages marked as read' });
});

/**
 * Delete a message
 * DELETE /api/chat/messages/:id
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await prisma.message.findUnique({
    where: { id: Number(id) },
  });

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  // Only sender can delete their message
  if (message.senderId !== req.user.id) {
    throw new ApiError(403, 'You can only delete your own messages');
  }

  await prisma.message.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Message deleted successfully' });
});

/**
 * Get users available for chat
 * GET /api/chat/users
 */
const getChatUsers = asyncHandler(async (req, res) => {
  let where = {
    id: { not: req.user.id },
    isActive: true,
  };

  // Filter based on role
  if (req.user.role === 'parent') {
    // Parents can chat with admins and teachers of their children's schools
    const children = await prisma.student.findMany({
      where: { parentId: req.user.id },
      select: { schoolId: true },
    });
    
    const schoolIds = [...new Set(children.map(c => c.schoolId).filter(Boolean))];
    
    where.OR = [
      { role: 'admin', schoolId: { in: schoolIds } },
      { role: 'teacher', schoolId: { in: schoolIds } },
    ];
  } else if (['admin', 'teacher'].includes(req.user.role) && req.user.schoolId) {
    // Admin/Teacher can chat with parents of students in their school, and other staff
    const studentParentIds = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      select: { parentId: true },
    });
    
    const parentIds = studentParentIds.map(s => s.parentId).filter(Boolean);
    
    where.OR = [
      { schoolId: req.user.schoolId },
      { id: { in: parentIds } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
  });

  res.json(users);
});

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  getChatUsers,
};
