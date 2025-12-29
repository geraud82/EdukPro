// ===========================
// Owner Routes
// ===========================

const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const ownerController = require('../controllers/ownerController');

// All routes require authentication and owner role
router.use(authMiddleware);
router.use(requireRole('owner'));

// Dashboard & Analytics
router.get('/dashboard/stats', ownerController.getDashboardStats);
router.get('/analytics', ownerController.getAnalytics);

// School management
router.get('/schools', ownerController.getAllSchools);

// User management routes
router.get('/users', ownerController.getAllUsers);
router.post('/users', ownerController.createUser);
router.post('/users/bulk-status', ownerController.bulkUpdateStatus);
router.patch('/users/:id/role', ownerController.updateUserRole);
router.patch('/users/:id/status', ownerController.updateUserStatus);
router.post('/users/:id/reset-password', ownerController.resetUserPassword);
router.delete('/users/:id', ownerController.deleteUser);

module.exports = router;
