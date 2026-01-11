// ===========================
// Admin Routes
// ===========================

const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const enrollmentController = require('../controllers/enrollmentController');
const feeController = require('../controllers/feeController');
const studentController = require('../controllers/studentController');
const ownerController = require('../controllers/ownerController');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

// ==================== ENROLLMENT ROUTES ====================

/**
 * Get all enrollments (with filtering)
 * GET /api/admin/enrollments
 */
router.get('/enrollments', enrollmentController.getAllEnrollments);

/**
 * Approve enrollment
 * PATCH /api/admin/enrollments/:id/approve
 */
router.patch('/enrollments/:id/approve', async (req, res, next) => {
  req.body.status = 'APPROVED';
  return enrollmentController.updateEnrollment(req, res, next);
});

/**
 * Reject enrollment
 * PATCH /api/admin/enrollments/:id/reject
 */
router.patch('/enrollments/:id/reject', async (req, res, next) => {
  req.body.status = 'REJECTED';
  return enrollmentController.updateEnrollment(req, res, next);
});

// ==================== INVOICE ROUTES ====================

/**
 * Get all invoices
 * GET /api/admin/invoices
 */
router.get('/invoices', feeController.getAllInvoices);

/**
 * Update invoice status
 * PATCH /api/admin/invoices/:id/status
 */
router.patch('/invoices/:id/status', async (req, res, next) => {
  const { status } = req.body;
  req.body = { status };
  return feeController.updateInvoice(req, res, next);
});

/**
 * Update invoice due date
 * PATCH /api/admin/invoices/:id/due-date
 */
router.patch('/invoices/:id/due-date', async (req, res, next) => {
  const { dueDate } = req.body;
  req.body = { dueDate };
  return feeController.updateInvoice(req, res, next);
});

// ==================== STUDENT ROUTES ====================

/**
 * Get all students
 * GET /api/admin/students
 */
router.get('/students', studentController.getAllStudents);

// ==================== TEACHER ROUTES ====================

/**
 * Get all teachers
 * GET /api/admin/teachers
 */
router.get('/teachers', async (req, res, next) => {
  // Get all users with teacher role
  req.query.role = 'teacher';
  return ownerController.getAllUsers(req, res, next);
});

/**
 * Create teacher
 * POST /api/admin/teachers
 */
router.post('/teachers', async (req, res, next) => {
  // Ensure role is set to teacher
  req.body.role = 'teacher';
  return ownerController.createUser(req, res, next);
});

/**
 * Reset teacher password
 * POST /api/admin/teachers/:id/reset-password
 */
router.post('/teachers/:id/reset-password', async (req, res, next) => {
  return ownerController.resetUserPassword(req, res, next);
});

module.exports = router;
