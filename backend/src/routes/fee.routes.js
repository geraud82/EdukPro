// ===========================
// Fee & Invoice Routes
// ===========================

const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Fee routes
router.get('/fees', feeController.getAllFees);
router.post('/fees', requireAdmin, feeController.createFee);
router.patch('/fees/:id', requireAdmin, feeController.updateFee);
router.delete('/fees/:id', requireAdmin, feeController.deleteFee);

// Invoice routes
router.get('/invoices', feeController.getAllInvoices);
router.get('/invoices/:id', feeController.getInvoiceById);
router.post('/invoices', requireAdmin, feeController.createInvoice);
router.patch('/invoices/:id', requireAdmin, feeController.updateInvoice);
router.delete('/invoices/:id', requireAdmin, feeController.deleteInvoice);

// Payment routes
router.post('/invoices/:id/payments', requireAdmin, feeController.recordPayment);

module.exports = router;
