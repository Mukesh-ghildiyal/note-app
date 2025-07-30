const { AuthMiddleware } = require('./auth-middleware');
const { 
  generalLimiter, 
  otpLimiter, 
  loginLimiter, 
  notesLimiter, 
  userProfileLimiter 
} = require('./rate-limit-middleware');
const {
  userRateLimiter,
  notesCreationLimiter,
  notesDeletionLimiter
} = require('./user-rate-limit-middleware');

module.exports = {
  AuthMiddleware,
  generalLimiter,
  otpLimiter,
  loginLimiter,
  notesLimiter,
  userProfileLimiter,
  userRateLimiter,
  notesCreationLimiter,
  notesDeletionLimiter
};
