// ===========================
// Enrollment Routes
// ===========================

const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', enrollmentController.getAllEnrollments);
router.get('/:id', enrollmentController.getEnrollmentById);
router.post('/', enrollmentController.createEnrollment);
router.patch('/:id', requireAdmin, enrollmentController.updateEnrollment);
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
