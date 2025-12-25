// ===========================
// Class Routes
// ===========================

const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.post('/', requireAdmin, classController.createClass);
router.patch('/:id', requireAdmin, classController.updateClass);
router.delete('/:id', requireAdmin, classController.deleteClass);

module.exports = router;
