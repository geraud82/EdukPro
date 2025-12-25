# EduckPro Backend

A Node.js/Express backend for the EduckPro school management system.

## 📁 Project Structure

```
backend/
├── server.js              # Entry point - HTTP server & Socket.IO
├── src/
│   ├── app.js             # Express app configuration
│   ├── config/
│   │   └── index.js       # Configuration settings
│   ├── middleware/
│   │   ├── index.js       # Middleware exports
│   │   ├── auth.js        # JWT authentication
│   │   └── errorHandler.js # Error handling
│   ├── controllers/
│   │   ├── authController.js   # Auth & profile
│   │   └── schoolController.js # School CRUD
│   └── routes/
│       ├── index.js       # Main router
│       ├── auth.routes.js
│       └── school.routes.js
├── services/              # External services
│   ├── emailService.js
│   ├── pdfService.js
│   └── pushService.js
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Database seeding
│   └── migrations/        # Database migrations
├── uploads/               # File uploads
└── .env                   # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/school_db"

# Security
JWT_SECRET=your-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password

# Push Notifications (optional)
VAPID_PUBLIC_KEY=your-key
VAPID_PRIVATE_KEY=your-key
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/profile` | Get current user profile |
| PATCH | `/api/profile` | Update profile |
| POST | `/api/profile/change-password` | Change password |

### Schools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools` | List all schools |
| GET | `/api/schools/:id` | Get school by ID |
| POST | `/api/schools` | Create school (Admin) |
| PATCH | `/api/schools/:id` | Update school (Admin) |
| DELETE | `/api/schools/:id` | Delete school (Owner) |

### Push Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/push/vapid-public-key` | Get VAPID public key |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### User Roles

- **parent** - Can view and manage their children
- **teacher** - Can manage classes and students
- **admin** - Full school management access
- **owner** - Platform owner, can manage all schools

## 🔌 Socket.IO

Real-time features use Socket.IO. Connect with your JWT token:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('notification:new', (data) => {
  console.log('New notification:', data);
});
```

## 🛠 Development

```bash
# Run development server with auto-reload
npm run dev

# Run production server
npm start

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (database browser)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name
```

## 📝 Adding New Features

### 1. Create Controller

```javascript
// src/controllers/featureController.js
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const getAll = asyncHandler(async (req, res) => {
  // Your logic here
  res.json({ data: [] });
});

module.exports = { getAll };
```

### 2. Create Routes

```javascript
// src/routes/feature.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/featureController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, controller.getAll);

module.exports = router;
```

### 3. Register Routes

```javascript
// src/routes/index.js
const featureRoutes = require('./feature.routes');
router.use('/features', featureRoutes);
```

## 📦 Production Deployment

See [VPS-DEPLOYMENT-GUIDE.md](../VPS-DEPLOYMENT-GUIDE.md) for detailed deployment instructions.

```bash
# Using PM2
pm2 start ecosystem.config.js --env production
```
