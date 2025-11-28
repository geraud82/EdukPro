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

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## 🏃‍♂️ Quick Start (Development)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/educkpro.git
cd educkpro
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
FRONTEND_URL="http://localhost:5173"
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

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Vercel (frontend) and Render (backend).

### Quick Deployment Summary

1. **Backend (Render)**:
   - Create PostgreSQL database
   - Deploy backend service
   - Set environment variables
   - Run `npx prisma db seed`

2. **Frontend (Vercel)**:
   - Deploy from GitHub
   - Set `VITE_API_URL` environment variable
   - Auto-deploys on push

3. **Configure**:
   - Update CORS in backend with Vercel URL
   - Update PWA manifest with production URL

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

- Your Name - [GitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- React community
- Prisma team
- Express.js
- Vercel and Render for hosting

## 📧 Support

For support, email support@educkpro.com or create an issue on GitHub.

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
│   ├── prisma/          # Database schema & migrations
│   ├── services/        # Business logic (email, PDF, push)
│   ├── uploads/         # File uploads
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── utils/       # Utilities (notifications, etc)
│   │   ├── config.js    # Configuration
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json
├── DEPLOYMENT.md        # Deployment guide
├── README.md           # This file
├── render.yaml         # Render configuration
└── vercel.json         # Vercel configuration
```

## 🐛 Known Issues

- Free tier backend (Render) sleeps after 15 min inactivity
- Push notifications require HTTPS (works in production)
- Email service requires Gmail App Password

## 💡 Tips

- Use Chrome DevTools → Application → Service Workers for PWA debugging
- Check Render logs for backend errors
- Use Vercel deployment logs for frontend issues
- Test push notifications in production (requires HTTPS)

---

**Happy Coding! 🎉**
