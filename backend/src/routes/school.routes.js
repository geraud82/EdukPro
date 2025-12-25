// ===========================
// School Routes
// ===========================

const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { authMiddleware, requireAdmin, requireOwner } = require('../middleware/auth');

// Public routes (all authenticated users can view schools)
router.get('/', authMiddleware, schoolController.getAllSchools);
router.get('/:id', authMiddleware, schoolController.getSchoolById);

// Admin routes
router.post('/', authMiddleware, requireAdmin, schoolController.createSchool);
router.patch('/:id', authMiddleware, requireAdmin, schoolController.updateSchool);

// Owner only
router.delete('/:id', authMiddleware, requireOwner, schoolController.deleteSchool);

module.exports = router;
