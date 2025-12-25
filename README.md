# EduckPro - School Management System

A comprehensive school management system built with React, Node.js, Express, Prisma, and PostgreSQL.

## 🚀 Features

### For Parents
- 👨‍👩‍👧‍👦 Manage multiple children's profiles
- 🏫 Browse and enroll in schools
- 💰 View and pay invoices
- 💬 Chat with teachers and school admins
- 📄 Upload student documents
- 🔔 Real-time notifications
- 📱 Progressive Web App (PWA) - Install on mobile/desktop

### For Teachers
- 📚 Manage assigned classes
- 👨‍🎓 View enrolled students
- 💬 Communicate with parents and admins
- 📊 Track class information

### For School Admins
- 🏫 Manage school information
- 👥 Create and manage classes
- 👨‍🏫 Assign teachers to classes
- 💵 Create fees and invoices
- ✅ Approve/reject enrollments
- 📧 Send invoice emails with PDF attachments
- 💬 Chat with teachers and parents
- 📊 View school statistics

### For Super Admins (Owners)
- 🏢 Manage multiple schools
- 👥 Create and manage all users
- 🔐 Reset user passwords
- 📊 System-wide statistics
- 🎛️ Full platform control

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Socket.IO Client** - Real-time communication
- **Service Workers** - PWA support
- **Web Push API** - Push notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **PDFKit** - PDF generation
- **Web Push** - Push notifications
- **PM2** - Process manager (production)

## 📋 Prerequisites

- Node.js 20+ and npm
- PostgreSQL 14+
- Git
- Nginx (for production)
- PM2 (for production)

## 🏃‍♂️ Quick Start (Development)

### 1. Clone the Repository

```bash
git clone https://github.com/geraud82/EdukPro.git
cd EdukPro
```

### 2. Set Up Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/educkpro"
JWT_SECRET="your-secret-key-here"
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="EduckPro <noreply@school.com>"
```

Generate VAPID keys for push notifications:
```bash
node generate-vapid-keys.js
```

Add the generated keys to `.env`:
```env
VAPID_PUBLIC_KEY="your-public-key"
VAPID_PRIVATE_KEY="your-private-key"
```

Run database migrations:
```bash
npx prisma migrate dev
npx prisma db seed
```

Start backend server:
```bash
npm run dev
```

### 3. Set Up Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:4000
```

Start development server:
```bash
npm run dev
```

Visit: http://localhost:5173

### 4. Login

**Super Admin:**
- Email: `admin@educkpro.com`
- Password: `admin123`

**Test School Admin:**
- Email: `john.admin@brightfuture.edu`
- Password: `password123`

**Test Teacher:**
- Email: `sarah.teacher@brightfuture.edu`
- Password: `password123`

**Test Parent:**
- Email: `mike.parent@email.com`
- Password: `password123`

## 🚀 Production Deployment (VPS/Hostinger)

For complete deployment instructions on a VPS server (Hostinger or similar), see:

**📖 [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md)**

### Quick Overview

1. **Server Setup**: Ubuntu 22.04 with Node.js, PostgreSQL, Nginx
2. **Backend**: Runs with PM2 process manager on port 4000
3. **Frontend**: Built and served by Nginx
4. **SSL**: Let's Encrypt certificates
5. **Database**: PostgreSQL on the same server

### Key Files

- `nginx.conf` - Nginx configuration template
- `backend/ecosystem.config.js` - PM2 configuration
- `backend/.env.example` - Backend environment template
- `frontend/.env.example` - Frontend environment template

### Quick Deploy Commands

```bash
# Build frontend
cd frontend
npm install
npm run build

# Setup backend with PM2
cd backend
npm install
npx prisma migrate deploy
pm2 start ecosystem.config.js --env production
```

## 📚 Documentation

### API Documentation

The backend API runs on port 4000 and provides RESTful endpoints for:

- **Auth**: `/api/auth/*` - Login, register, profile
- **Students**: `/api/students/*` - Student management
- **Classes**: `/api/classes/*` - Class management
- **Fees**: `/api/fees/*` - Fee management
- **Invoices**: `/api/invoices/*` - Invoice management
- **Enrollments**: `/api/enrollments/*` - Enrollment management
- **Chat**: `/api/chat/*` - Messaging system
- **Notifications**: `/api/notifications/*` - In-app notifications
- **Push**: `/api/push/*` - Push notifications
- **Schools**: `/api/schools/*` - School management
- **Owner**: `/api/owner/*` - Super admin operations

### Database Schema

See `backend/prisma/schema.prisma` for the complete database schema.

**Main Models:**
- User (parent, teacher, admin, owner)
- School
- Student
- Class
- Fee
- Invoice
- Payment
- Enrollment
- Message
- Notification
- StudentDocument

### Features Documentation

- **Invoice PDF Generation**: See `backend/README-INVOICE-PDF-EMAIL.md`
- **Push Notifications**: See `backend/README-PUSH-NOTIFICATIONS.md`

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- CORS protection
- SQL injection protection (Prisma)
- XSS protection
- HTTPS in production
- Security headers (Nginx)

## 🎨 Customization

### Branding

1. **App Icons**:
   - Replace `frontend/public/images/icon-192.png`
   - Replace `frontend/public/images/icon-512.png`

2. **Colors**:
   - Edit `frontend/src/index.css`
   - Modify CSS variables

3. **Name**:
   - Update `frontend/public/manifest.json`
   - Update `frontend/index.html` title

### Email Templates

Edit email templates in:
- `backend/services/emailService.js`

### PDF Invoice Design

Customize PDF layout in:
- `backend/services/pdfService.js`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 PWA Features

- **Offline Support**: Service worker caches assets
- **Install Prompt**: Add to home screen
- **Push Notifications**: Real-time updates
- **Responsive**: Works on all screen sizes
- **Fast Loading**: Optimized performance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Geraud - [GitHub](https://github.com/geraud82)

## 📧 Support

For support, create an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile apps (React Native)
- [ ] Advanced analytics and reporting
- [ ] Attendance tracking
- [ ] Grade management
- [ ] Exam scheduling
- [ ] Parent-teacher meeting scheduler
- [ ] Multi-language support
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] SMS notifications
- [ ] Calendar integration
- [ ] Export data (CSV, Excel)

## 📊 Project Structure

```
educkpro/
├── backend/
│   ├── prisma/              # Database schema & migrations
│   ├── services/            # Business logic (email, PDF, push)
│   ├── uploads/             # File uploads
│   ├── server.js            # Express server
│   ├── ecosystem.config.js  # PM2 configuration
│   └── package.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── utils/           # Utilities (notifications, etc)
│   │   ├── config.js        # Configuration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
├── nginx.conf               # Nginx configuration template
├── VPS-DEPLOYMENT-GUIDE.md  # Deployment guide
└── README.md                # This file
```

## 🐛 Known Issues

- Push notifications require HTTPS (works in production)
- Email service requires Gmail App Password or SMTP server

## 💡 Tips

- Use Chrome DevTools → Application → Service Workers for PWA debugging
- Check PM2 logs for backend errors: `pm2 logs educkpro-api`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
- Test push notifications in production (requires HTTPS)

---

**Happy Coding! 🎉**
