const rateLimit = require('express-rate-limit');

// Store for user-specific rate limiting
const userLimiterStore = new Map();

// User-specific rate limiter for authenticated requests
const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each user to 100 requests per 15 minutes
  keyGenerator: (req) => {
    // Use user ID from JWT token for authenticated requests
    return req.user ? req.user.id : req.ip;
  },
  message: {
    success: false,
    message: 'Too many requests for this user. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Notes creation rate limiter (more restrictive)
const notesCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each user to 20 note creations per 15 minutes
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  message: {
    success: false,
    message: 'Too many note creations. Please wait before creating more notes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Note deletion rate limiter
const notesDeletionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each user to 30 note deletions per 15 minutes
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  message: {
    success: false,
    message: 'Too many note deletions. Please wait before deleting more notes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  userRateLimiter,
  notesCreationLimiter,
  notesDeletionLimiter
}; 