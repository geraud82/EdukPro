// ===========================
// EduckPro Server Entry Point
// ===========================

require('dotenv').config();

const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const app = require('./src/app');
const config = require('./src/config');

// Create HTTP server
const server = http.createServer(app);

// Get allowed origins for Socket.IO
const allowedOrigins = config.getAllowedOrigins();

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  
  try {
    socket.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.user.id);
  
  // Join user's personal room
  socket.join(`user:${socket.user.id}`);
  
  // Join school room if user belongs to a school
  if (socket.user.schoolId) {
    socket.join(`school:${socket.user.schoolId}`);
  }
  
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.user.id);
  });
});

// Make io accessible to routes via app
app.set('io', io);

// Start server
const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, '0.0.0.0', () => {

  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🎓 EduckPro API Server                       ║
║                                                ║
║   Port: ${PORT}                                   ║
║   Environment: ${config.nodeEnv.padEnd(27)}║
║   CORS: ${allowedOrigins.length} origin(s) allowed                ║
║                                                ║
║   Ready to accept connections!                 ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
