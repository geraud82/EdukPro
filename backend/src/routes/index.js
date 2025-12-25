// ===========================
// Main Router - Combines All Routes
// ===========================

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Import route modules
const authRoutes = require('./auth.routes');
const schoolRoutes = require('./school.routes');
const classRoutes = require('./class.routes');
const studentRoutes = require('./student.routes');
const enrollmentRoutes = require('./enrollment.routes');
const feeRoutes = require('./fee.routes');
const chatRoutes = require('./chat.routes');
const notificationRoutes = require('./notification.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/', feeRoutes); // Mounts /fees and /invoices
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);

// Profile routes (need auth)
const authController = require('../controllers/authController');
router.get('/profile', authMiddleware, authController.getProfile);
router.patch('/profile', authMiddleware, authController.updateProfile);
router.post('/profile/change-password', authMiddleware, authController.changePassword);

// Push notifications
const pushService = require('../../services/pushService');

router.get('/push/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Subscribe to push notifications (requires auth)
router.post('/push/subscribe', authMiddleware, (req, res) => {
  const { subscription } = req.body;
  
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription object is required' });
  }
  
  const saved = pushService.saveSubscription(req.user.id, subscription);
  
  if (saved) {
    res.json({ message: 'Push subscription saved successfully' });
  } else {
    res.status(503).json({ error: 'Push notifications are not enabled' });
  }
});

// Unsubscribe from push notifications (requires auth)
router.delete('/push/subscribe', authMiddleware, (req, res) => {
  pushService.removeSubscription(req.user.id);
  res.json({ message: 'Push subscription removed successfully' });
});

module.exports = router;
