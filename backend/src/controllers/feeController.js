// ===========================
// Fee & Invoice Controller
// ===========================

const { PrismaClient } = require('@prisma/client');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

// ==================== FEES ====================

/**
 * Get all fees
 * GET /api/fees
 */
const getAllFees = asyncHandler(async (req, res) => {
  const { schoolId, type } = req.query;
  
  let where = {};
  
  if (schoolId) where.schoolId = Number(schoolId);
  if (type) where.type = type;
  
  // Filter by user's school
  if (['admin', 'teacher'].includes(req.user.role) && req.user.schoolId) {
    where.schoolId = req.user.schoolId;
  }

  const fees = await prisma.fee.findMany({
    where,
    include: {
      school: { select: { id: true, name: true } },
    },
    orderBy: { name: 'asc' },
  });

  res.json(fees);
});

/**
 * Create a fee
 * POST /api/fees
 */
const createFee = asyncHandler(async (req, res) => {
  const { name, amount, currency, type, description, schoolId } = req.body;

  if (!name || !amount || !schoolId) {
    throw new ApiError(400, 'Name, amount, and schoolId are required');
  }

  const fee = await prisma.fee.create({
    data: {
      name,
      amount: Number(amount),
      currency: currency || 'XOF',
      type: type || 'other',
      description,
      schoolId: Number(schoolId),
    },
    include: {
      school: { select: { id: true, name: true } },
    },
  });

  res.status(201).json(fee);
});

/**
 * Update fee
 * PATCH /api/fees/:id
 */
const updateFee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, amount, currency, type, description } = req.body;

  const fee = await prisma.fee.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(currency && { currency }),
      ...(type && { type }),
      ...(description !== undefined && { description }),
    },
    include: {
      school: { select: { id: true, name: true } },
    },
  });

  res.json(fee);
});

/**
 * Delete fee
 * DELETE /api/fees/:id
 */
const deleteFee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.fee.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Fee deleted successfully' });
});

// ==================== INVOICES ====================

/**
 * Get all invoices
 * GET /api/invoices
 */
const getAllInvoices = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  
  let where = {};
  
  if (studentId) where.studentId = Number(studentId);
  if (status) where.status = status;
  
  // Parent can only see their children's invoices
  if (req.user.role === 'parent') {
    where.student = { parentId: req.user.id };
  }
  
  // Admin/Teacher see only their school
  if (['admin', 'teacher'].includes(req.user.role) && req.user.schoolId) {
    where.student = { schoolId: req.user.schoolId };
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      fee: { select: { id: true, name: true, type: true } },
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(invoices);
});

/**
 * Get invoice by ID
 * GET /api/invoices/:id
 */
const getInvoiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: Number(id) },
    include: {
      student: {
        include: {
          parent: { select: { id: true, name: true, email: true } },
          school: true,
        },
      },
      fee: true,
      payments: true,
    },
  });

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  res.json(invoice);
});

/**
 * Create invoice
 * POST /api/invoices
 */
const createInvoice = asyncHandler(async (req, res) => {
  const { studentId, feeId, amount, currency, dueDate, notes } = req.body;

  if (!studentId || !feeId || !amount) {
    throw new ApiError(400, 'Student ID, Fee ID, and amount are required');
  }

  const invoice = await prisma.invoice.create({
    data: {
      studentId: Number(studentId),
      feeId: Number(feeId),
      amount: Number(amount),
      currency: currency || 'XOF',
      status: 'pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      notes,
    },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      fee: { select: { id: true, name: true, type: true } },
    },
  });

  res.status(201).json(invoice);
});

/**
 * Update invoice
 * PATCH /api/invoices/:id
 */
const updateInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, dueDate, notes } = req.body;

  const invoice = await prisma.invoice.update({
    where: { id: Number(id) },
    data: {
      ...(status && { status }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(notes !== undefined && { notes }),
    },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      fee: { select: { id: true, name: true, type: true } },
      payments: true,
    },
  });

  res.json(invoice);
});

/**
 * Delete invoice
 * DELETE /api/invoices/:id
 */
const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.invoice.delete({
    where: { id: Number(id) },
  });

  res.json({ message: 'Invoice deleted successfully' });
});

// ==================== PAYMENTS ====================

/**
 * Record a payment
 * POST /api/invoices/:id/payments
 */
const recordPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, method, reference, notes } = req.body;

  if (!amount) {
    throw new ApiError(400, 'Payment amount is required');
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: Number(id) },
    include: { payments: true },
  });

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  // Create payment
  const payment = await prisma.payment.create({
    data: {
      invoiceId: Number(id),
      amount: Number(amount),
      currency: invoice.currency,
      method: method || 'cash',
      reference,
      notes,
    },
  });

  // Calculate total paid
  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + Number(amount);

  // Update invoice status if fully paid
  if (totalPaid >= invoice.amount) {
    await prisma.invoice.update({
      where: { id: Number(id) },
      data: { status: 'paid', paidAt: new Date() },
    });
  } else if (totalPaid > 0) {
    await prisma.invoice.update({
      where: { id: Number(id) },
      data: { status: 'partial' },
    });
  }

  res.status(201).json(payment);
});

module.exports = {
  // Fees
  getAllFees,
  createFee,
  updateFee,
  deleteFee,
  // Invoices
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  // Payments
  recordPayment,
};
