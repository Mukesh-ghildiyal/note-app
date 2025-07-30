const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP rate limiter - more restrictive
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 OTP requests per 15 minutes
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait 15 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Notes API rate limiter
const notesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 notes requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests to notes API. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// User profile rate limiter
const userProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 profile requests per 15 minutes
  message: {
    success: false,
    message: 'Too many profile requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  otpLimiter,
  loginLimiter,
  notesLimiter,
  userProfileLimiter
}; 