const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate an invoice PDF
 * @param {Object} invoice - Invoice data with student, fee, and payment info
 * @param {string} outputPath - Path where PDF should be saved (optional)
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateInvoicePDF(invoice, outputPath = null) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      const buffers = [];
      
      // Collect PDF data in buffers
      doc.on('data', buffers.push.bind(buffers));
      
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        
        // Save to file if path provided
        if (outputPath) {
          fs.writeFileSync(outputPath, pdfBuffer);
        }
        
        resolve(pdfBuffer);
      });

      doc.on('error', reject);

      // Header with logo placeholder and company name
      doc
        .fontSize(24)
        .fillColor('#2563eb')
        .text('🎓 EduckPro', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor('#6b7280')
        .text('School Management System', { align: 'center' })
        .moveDown(1.5);

      // Invoice Title
      doc
        .fontSize(20)
        .fillColor('#111827')
        .text('INVOICE', { align: 'center' })
        .moveDown(0.5);

      // Horizontal line
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor('#e5e7eb')
        .stroke()
        .moveDown(1);

      // Invoice details in two columns
      const leftColumn = 50;
      const rightColumn = 320;
      const startY = doc.y;

      // Left column - Bill To
      doc
        .fontSize(10)
        .fillColor('#6b7280')
        .text('BILL TO:', leftColumn, startY);
      
      doc
        .fontSize(12)
        .fillColor('#111827')
        .text(`${invoice.student.firstName} ${invoice.student.lastName}`, leftColumn, doc.y + 5);
      
      if (invoice.student.parent) {
        doc
          .fontSize(10)
          .fillColor('#6b7280')
          .text(`Parent: ${invoice.student.parent.name}`, leftColumn, doc.y + 5)
          .text(`Email: ${invoice.student.parent.email}`, leftColumn, doc.y + 3);
      }

      // Right column - Invoice details
      doc
        .fontSize(10)
        .fillColor('#6b7280')
        .text('INVOICE #:', rightColumn, startY);
      
      doc
        .fontSize(12)
        .fillColor('#111827')
        .text(`INV-${String(invoice.id).padStart(6, '0')}`, rightColumn, doc.y + 5);

      doc
        .fontSize(10)
        .fillColor('#6b7280')
        .text('DATE:', rightColumn, doc.y + 10)
        .fontSize(11)
        .fillColor('#111827')
        .text(new Date(invoice.createdAt).toLocaleDateString(), rightColumn, doc.y + 5);

      if (invoice.dueDate) {
        doc
          .fontSize(10)
          .fillColor('#6b7280')
          .text('DUE DATE:', rightColumn, doc.y + 10)
          .fontSize(11)
          .fillColor('#111827')
          .text(new Date(invoice.dueDate).toLocaleDateString(), rightColumn, doc.y + 5);
      }

      doc
        .fontSize(10)
        .fillColor('#6b7280')
        .text('STATUS:', rightColumn, doc.y + 10);
      
      // Status with color
      const statusColor = invoice.status === 'PAID' ? '#10b981' : 
                         invoice.status === 'PENDING' ? '#f59e0b' : '#ef4444';
      doc
        .fontSize(11)
        .fillColor(statusColor)
        .text(invoice.status, rightColumn, doc.y + 5);

      doc.moveDown(4);

      // Table header
      const tableTop = doc.y + 20;
      const tableHeaders = ['Description', 'Amount'];
      const colWidths = [350, 145];
      let colX = leftColumn;

      // Draw table header background
      doc
        .rect(leftColumn, tableTop - 10, 495, 25)
        .fillColor('#f3f4f6')
        .fill();

      // Table header text
      doc
        .fontSize(10)
        .fillColor('#374151');
      
      tableHeaders.forEach((header, i) => {
        doc.text(
          header, 
          colX, 
          tableTop, 
          { width: colWidths[i], align: i === 0 ? 'left' : 'right' }
        );
        colX += colWidths[i];
      });

      // Table row
      const rowTop = tableTop + 30;
      doc
        .fontSize(11)
        .fillColor('#111827')
        .text(invoice.fee.name, leftColumn, rowTop, { width: colWidths[0] });
      
      if (invoice.fee.description) {
        doc
          .fontSize(9)
          .fillColor('#6b7280')
          .text(invoice.fee.description, leftColumn, doc.y + 3, { width: colWidths[0] });
      }

      doc
        .fontSize(11)
        .fillColor('#111827')
        .text(
          `${invoice.amount.toLocaleString()} ${invoice.fee.currency}`, 
          leftColumn + colWidths[0], 
          rowTop, 
          { width: colWidths[1], align: 'right' }
        );

      // Horizontal line after row
      const lineY = doc.y + 15;
      doc
        .moveTo(50, lineY)
        .lineTo(545, lineY)
        .strokeColor('#e5e7eb')
        .stroke();

      // Total section
      doc.moveDown(2);
      const totalY = doc.y;
      
      doc
        .fontSize(12)
        .fillColor('#111827')
        .text('TOTAL:', leftColumn + colWidths[0] - 50, totalY);
      
      doc
        .fontSize(14)
        .fillColor('#2563eb')
        .text(
          `${invoice.amount.toLocaleString()} ${invoice.fee.currency}`, 
          leftColumn + colWidths[0], 
          totalY, 
          { width: colWidths[1], align: 'right' }
        );

      // Payment information if paid
      if (invoice.status === 'PAID' && invoice.payments && invoice.payments.length > 0) {
        doc.moveDown(2);
        
        // Payment info box
        const boxY = doc.y;
        doc
          .rect(leftColumn, boxY, 495, 60)
          .fillColor('#d1fae5')
          .fill();

        doc
          .fontSize(12)
          .fillColor('#065f46')
          .text('✓ PAYMENT RECEIVED', leftColumn + 10, boxY + 10);

        const payment = invoice.payments[0];
        doc
          .fontSize(10)
          .fillColor('#047857')
          .text(`Payment Date: ${new Date(payment.createdAt).toLocaleDateString()}`, leftColumn + 10, doc.y + 5)
          .text(`Method: ${payment.method || 'N/A'}`, leftColumn + 10, doc.y + 3)
          .text(`Transaction Ref: ${payment.transactionRef || 'N/A'}`, leftColumn + 10, doc.y + 3);
      }

      // Footer
      doc
        .fontSize(9)
        .fillColor('#9ca3af')
        .text(
          'Thank you for your payment!',
          50,
          doc.page.height - 80,
          { align: 'center', width: 495 }
        )
        .text(
          'For any queries, please contact your school administration.',
          50,
          doc.page.height - 65,
          { align: 'center', width: 495 }
        );

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateInvoicePDF
};
