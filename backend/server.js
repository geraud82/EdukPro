require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* =========================
   🔐 CORS CONFIG (CRITICAL)
========================= */
/* =========================
   🔐 CORS CONFIG (FIXED)
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://eduk-pro.vercel.app',
  'https://edukpro.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server, Postman, mobile apps
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ CORS blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('/*', cors(corsOptions)); // ✅ MUST use same config


app.use((req, res, next) => {
  if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});


/* =========================
   📂 UPLOADS
========================= */
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

/* =========================
   🔑 HELPERS
========================= */
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId || null,
      isActive: user.isActive,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }
  try {
    req.user = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/* =========================
   🩺 HEALTH
========================= */
app.get('/', (_, res) => {
  res.json({ status: 'EduckPro API running' });
});

/* =========================
   🔐 AUTH ROUTES
========================= */

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const allowedRoles = ['parent', 'teacher', 'admin', 'owner'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });

    const token = createToken(user);

    res.status(201).json({
      user: { id: user.id, name, email, role },
      token,
    });
  } catch (e) {
    console.error('REGISTER ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN (✔️ UNIQUE)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      token,
    });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =========================
   👤 PROFILE
========================= */
app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  res.json(user);
});

/* =========================
   🔔 PUSH (TEST)
========================= */
app.get('/api/push/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

/* =========================
   🚀 SERVER + SOCKET.IO
========================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token'));
  try {
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', socket => {
  console.log('🔌 Socket connected:', socket.user.id);
  socket.join(`user:${socket.user.id}`);
});

/* =========================
   ▶️ START
========================= */
server.listen(PORT, () => {
  console.log(`✅ EduckPro API running on port ${PORT}`);
});
