# Invoice PDF Generation and Email Notifications

This document describes the invoice PDF generation and email notification features added to the EduckPro backend.

## Features Added

### 1. **PDF Invoice Generation**
- Automatically generates professional PDF invoices
- Beautiful design with company branding
- Includes all invoice details (student, fee, amount, status)
- Shows payment information for paid invoices
- Download invoices as PDF files

### 2. **Email Notifications**
- **Invoice Created**: Automatically sends email with PDF attachment when admin creates an invoice
- **Payment Confirmation**: Sends email with receipt PDF when parent pays an invoice
- Professional HTML email templates
- Fallback plain text version

### 3. **New API Endpoints**
- `GET /api/invoices/:id/download` - Download invoice as PDF
- `POST /api/invoices/:id/send-email` - Manually send invoice email (admin only)

## Setup Instructions

### 1. Install Dependencies

The required packages have been installed:
```bash
npm install pdfkit nodemailer
```

### 2. Configure Email Settings

Edit the `backend/.env` file with your email service credentials:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=EduckPro <noreply@educkpro.com>
```

#### For Gmail:
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to "App Passwords" and generate a new password
4. Use that password in `EMAIL_PASS`

#### For Other Email Services:
- **Outlook/Hotmail**: `smtp.office365.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's SMTP settings

### 3. Test Email Configuration (Optional)

The system will gracefully handle email failures - invoices will still be created even if email sending fails. Check the server logs for any email errors.

## File Structure

```
backend/
├── services/
│   ├── pdfService.js          # PDF generation logic
│   └── emailService.js        # Email sending logic
├── server.js                  # Updated with PDF/Email integration
└── .env                       # Email configuration
```

## How It Works

### When Admin Creates Invoice

1. Admin creates invoice via `POST /api/invoices`
2. System saves invoice to database
3. **Automatically**:
   - Generates PDF invoice
   - Sends email to parent with PDF attached
   - Sends Socket.IO notification to parent
4. Returns invoice data to admin

### When Parent Pays Invoice

1. Parent pays invoice via `POST /api/invoices/:id/pay`
2. System updates invoice status to PAID
3. **Automatically**:
   - Generates updated PDF receipt
   - Sends payment confirmation email with receipt
4. Returns payment confirmation to parent

### Download Invoice PDF

Parents and admins can download invoice PDFs:

```javascript
// Frontend code example
const downloadInvoice = async (invoiceId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:4000/api/invoices/${invoiceId}/download`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoiceId}.pdf`;
  a.click();
};
```

### Manual Email Sending

Admins can manually resend invoice emails:

```javascript
// Frontend code example
const sendInvoiceEmail = async (invoiceId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:4000/api/invoices/${invoiceId}/send-email`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  
  const data = await response.json();
  console.log(data.message);
};
```

## Email Templates

### Invoice Creation Email
- **Subject**: `New Invoice INV-XXXXXX - [Student Name]`
- **Content**: 
  - Invoice details (number, student, amount, due date)
  - PDF attachment
  - "Pay Now" button for pending invoices

### Payment Confirmation Email
- **Subject**: `Payment Confirmation - INV-XXXXXX`
- **Content**:
  - Payment received confirmation
  - Amount and transaction details
  - Updated invoice receipt PDF

## PDF Invoice Design

The generated PDFs include:
- **Header**: EduckPro branding with emoji logo
- **Invoice Details**: Number, date, due date, status
- **Bill To**: Student and parent information
- **Fee Details**: Description and amount
- **Total**: Highlighted total amount
- **Payment Info**: For paid invoices, shows payment date and transaction reference
- **Footer**: Thank you message and contact information

## Troubleshooting

### Email Not Sending

1. **Check console logs** for error messages
2. **Verify EMAIL_USER and EMAIL_PASS** in `.env`
3. **For Gmail**: Ensure app password is used (not regular password)
4. **Check firewall**: Ensure port 587 is not blocked
5. **Test SMTP connection**:
   ```javascript
   // Add to server.js temporarily
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransporter({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS,
     }
   });
   transporter.verify(console.log);
   ```

### PDF Generation Issues

- PDFs are generated in-memory, no disk storage required
- Check server console for PDF generation errors
- Ensure all invoice data includes required fields (student, fee)

### Development Mode

If you don't want to configure email during development:
- Leave EMAIL_USER and EMAIL_PASS empty in `.env`
- The system will log "Email not configured" but continue working
- PDFs will still be generated and downloadable

## Security Notes

1. **Never commit `.env` file** to version control
2. **Use app passwords** for email services, not main account passwords
3. **Email credentials** are only stored server-side
4. **PDF downloads** are permission-checked (parents can only download their invoices)
5. **Email sending** is restricted to admin role for manual sends

## Performance

- PDF generation: ~100-200ms per invoice
- Email sending: ~500-1000ms (async, doesn't block response)
- Both operations run asynchronously after database operations
- Failed emails don't prevent invoice creation

## Future Enhancements

Possible improvements:
- [ ] Add more PDF templates/themes
- [ ] Support multiple languages
- [ ] Bulk invoice email sending
- [ ] Email queue system for large batches
- [ ] Email open tracking
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] SMS notifications
- [ ] WhatsApp notifications

## API Reference

### Download Invoice PDF
```http
GET /api/invoices/:id/download
Authorization: Bearer <token>
```

**Permissions**: Parent (own invoices only), Admin, Owner

**Response**: PDF file download

---

### Send Invoice Email
```http
POST /api/invoices/:id/send-email
Authorization: Bearer <token>
```

**Permissions**: Admin only

**Response**:
```json
{
  "message": "Invoice email sent successfully",
  "messageId": "<email-message-id>"
}
```

---

### Create Invoice (Enhanced)
```http
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": 1,
  "feeId": 2,
  "amount": 50000,
  "dueDate": "2025-12-31"
}
```

**New Behavior**: Automatically generates PDF and sends email to parent

---

### Pay Invoice (Enhanced)
```http
POST /api/invoices/:id/pay
Authorization: Bearer <token>
```

**New Behavior**: Automatically generates receipt PDF and sends payment confirmation email

## Support

For issues or questions:
1. Check server console logs
2. Verify `.env` configuration
3. Test email credentials separately
4. Review this documentation

## License

Part of EduckPro School Management System
