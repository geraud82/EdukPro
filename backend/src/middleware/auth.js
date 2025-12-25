// ===========================
// Authentication Middleware
// ===========================

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Verify JWT token and attach user to request
 */
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Optional auth - doesn't fail if no token, just doesn't set user
 */
const optionalAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  
  if (auth?.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      req.user = jwt.verify(token, config.jwtSecret);
    } catch {
      // Token invalid, but we continue without user
    }
  }
  next();
};

/**
 * Check if user has specific role(s)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    next();
  };
};

/**
 * Check if user is owner
 */
const requireOwner = requireRole('owner');

/**
 * Check if user is admin or owner
 */
const requireAdmin = requireRole('admin', 'owner');

/**
 * Check if user is teacher, admin, or owner
 */
const requireTeacher = requireRole('teacher', 'admin', 'owner');

/**
 * Create JWT token for user
 */
const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId || null,
      isActive: user.isActive,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

module.exports = {
  authMiddleware,
  optionalAuth,
  requireRole,
  requireOwner,
  requireAdmin,
  requireTeacher,
  createToken,
};
