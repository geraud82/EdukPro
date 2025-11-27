const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send invoice email with PDF attachment
 * @param {string} to - Recipient email address
 * @param {Object} invoice - Invoice data
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Object>} - Email send result
 */
async function sendInvoiceEmail(to, invoice, pdfBuffer) {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const invoiceNumber = `INV-${String(invoice.id).padStart(6, '0')}`;
    const studentName = `${invoice.student.firstName} ${invoice.student.lastName}`;
    const amount = `${invoice.amount.toLocaleString()} ${invoice.fee.currency}`;
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A';
    
    // Email HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
    }
    .invoice-details {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .invoice-details h2 {
      margin: 0 0 15px 0;
      color: #2563eb;
      font-size: 18px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
    }
    .detail-value {
      color: #111827;
    }
    .total {
      background: #2563eb;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .total h3 {
      margin: 0 0 5px 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .total p {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }
    .cta-button {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
      background: #f9fafb;
      border-radius: 0 0 10px 10px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 EduckPro</h1>
    <p>School Management System</p>
  </div>
  
  <div class="content">
    <h2>New Invoice Received</h2>
    <p>Dear Parent,</p>
    <p>A new invoice has been generated for <strong>${studentName}</strong>. Please find the details below:</p>
    
    <div class="invoice-details">
      <h2>Invoice Details</h2>
      <div class="detail-row">
        <span class="detail-label">Invoice Number:</span>
        <span class="detail-value">${invoiceNumber}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Student:</span>
        <span class="detail-value">${studentName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Fee Type:</span>
        <span class="detail-value">${invoice.fee.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span class="detail-value">${dueDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">
          <span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span>
        </span>
      </div>
    </div>
    
    <div class="total">
      <h3>TOTAL AMOUNT</h3>
      <p>${amount}</p>
    </div>
    
    ${invoice.status === 'PENDING' ? `
    <p style="text-align: center;">
      <a href="#" class="cta-button">Pay Now</a>
    </p>
    ` : ''}
    
    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      The invoice is attached to this email as a PDF file. Please download and keep it for your records.
    </p>
    
    <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
      If you have any questions regarding this invoice, please contact your school administration.
    </p>
  </div>
  
  <div class="footer">
    <p><strong>Thank you for choosing EduckPro!</strong></p>
    <p>This is an automated email. Please do not reply to this message.</p>
    <p style="margin-top: 15px; font-size: 12px;">
      © ${new Date().getFullYear()} EduckPro. All rights reserved.
    </p>
  </div>
</body>
</html>
    `;
    
    // Plain text version
    const textContent = `
EduckPro - New Invoice

Dear Parent,

A new invoice has been generated for ${studentName}.

Invoice Details:
- Invoice Number: ${invoiceNumber}
- Student: ${studentName}
- Fee Type: ${invoice.fee.name}
- Amount: ${amount}
- Due Date: ${dueDate}
- Status: ${invoice.status}

The invoice is attached to this email as a PDF file.

If you have any questions, please contact your school administration.

Thank you for choosing EduckPro!
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'EduckPro <noreply@educkpro.com>',
      to: to,
      subject: `New Invoice ${invoiceNumber} - ${studentName}`,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment confirmation email
 * @param {string} to - Recipient email address
 * @param {Object} invoice - Invoice data with payment info
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Object>} - Email send result
 */
async function sendPaymentConfirmationEmail(to, invoice, pdfBuffer) {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const invoiceNumber = `INV-${String(invoice.id).padStart(6, '0')}`;
    const studentName = `${invoice.student.firstName} ${invoice.student.lastName}`;
    const amount = `${invoice.amount.toLocaleString()} ${invoice.fee.currency}`;
    const payment = invoice.payments && invoice.payments[0];
    const paymentDate = payment ? new Date(payment.createdAt).toLocaleDateString() : 'N/A';
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 10px 10px 0 0;
    }
    .success-icon {
      font-size: 60px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
    }
    .payment-box {
      background: #d1fae5;
      border: 2px solid #10b981;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .payment-box h2 {
      margin: 0 0 10px 0;
      color: #065f46;
    }
    .payment-box p {
      margin: 5px 0;
      color: #047857;
    }
    .amount {
      font-size: 32px;
      font-weight: bold;
      color: #059669;
      margin: 15px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
      background: #f9fafb;
      border-radius: 0 0 10px 10px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="success-icon">✓</div>
    <h1>Payment Confirmed!</h1>
  </div>
  
  <div class="content">
    <h2>Dear Parent,</h2>
    <p>We have successfully received your payment for <strong>${studentName}</strong>.</p>
    
    <div class="payment-box">
      <h2>Payment Received</h2>
      <div class="amount">${amount}</div>
      <p><strong>Invoice:</strong> ${invoiceNumber}</p>
      <p><strong>Payment Date:</strong> ${paymentDate}</p>
      ${payment && payment.transactionRef ? `<p><strong>Transaction Reference:</strong> ${payment.transactionRef}</p>` : ''}
    </div>
    
    <p>Your updated invoice receipt is attached to this email.</p>
    
    <p style="margin-top: 30px;">Thank you for your prompt payment!</p>
  </div>
  
  <div class="footer">
    <p><strong>EduckPro - School Management System</strong></p>
    <p>© ${new Date().getFullYear()} EduckPro. All rights reserved.</p>
  </div>
</body>
</html>
    `;
    
    const textContent = `
Payment Confirmed!

Dear Parent,

We have successfully received your payment for ${studentName}.

Payment Details:
- Amount: ${amount}
- Invoice: ${invoiceNumber}
- Payment Date: ${paymentDate}
${payment && payment.transactionRef ? `- Transaction Reference: ${payment.transactionRef}` : ''}

Your updated invoice receipt is attached to this email.

Thank you for your prompt payment!

EduckPro - School Management System
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'EduckPro <noreply@educkpro.com>',
      to: to,
      subject: `Payment Confirmation - ${invoiceNumber}`,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: `receipt-${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendInvoiceEmail,
  sendPaymentConfirmationEmail,
};
