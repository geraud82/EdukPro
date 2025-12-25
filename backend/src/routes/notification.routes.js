// ===========================
// Notification Routes
// ===========================

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin only routes
router.post('/', requireAdmin, notificationController.createNotification);
router.post('/bulk', requireAdmin, notificationController.sendBulkNotifications);

module.exports = router;
