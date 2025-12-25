// ===========================
// Chat Routes
// ===========================

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/conversations', chatController.getConversations);
router.get('/users', chatController.getChatUsers);
router.get('/messages/:userId', chatController.getMessages);
router.post('/messages', chatController.sendMessage);
router.post('/messages/read', chatController.markAsRead);
router.delete('/messages/:id', chatController.deleteMessage);

module.exports = router;
