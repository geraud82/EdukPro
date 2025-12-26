// ===========================
// Configuration
// ===========================

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: '7d',
  
  // CORS Configuration
  getAllowedOrigins: () => {
    if (process.env.ALLOWED_ORIGINS) {
      return process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    }
    // Default development origins
    return [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ];
  },
  
  // Upload Configuration
  uploadDir: 'uploads',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  
  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'EduckPro <noreply@educkpro.com>',
  },
  
  // VAPID Configuration (Push Notifications)
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@educkpro.com',
  },
  
  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

module.exports = config;
