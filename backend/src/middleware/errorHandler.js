// ===========================
// Error Handler Middleware
// ===========================

const config = require('../config');

/**
 * Custom Error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found handler - 404
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // Default to 500 if no status code
  statusCode = statusCode || 500;
  
  // Log error in development
  if (config.nodeEnv !== 'production') {
    console.error('❌ Error:', err);
  }
  
  // Handle Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
  }
  
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Send response
  res.status(statusCode).json({
    status: err.status || 'error',
    message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
};

/**
 * Async handler wrapper to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  ApiError,
  notFound,
  errorHandler,
  asyncHandler,
};
