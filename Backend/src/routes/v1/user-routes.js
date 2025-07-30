const express = require('express');
const { UserController } = require('../../controllers');
const { AuthMiddleware, otpLimiter, loginLimiter, userProfileLimiter } = require('../../middlewares');
const router = express.Router();

// Public routes with rate limiting
router.post('/send-otp', otpLimiter, UserController.sendOTP);
router.post('/login', loginLimiter, UserController.login);
router.post('/verify-otp', otpLimiter, UserController.verifyOTP);

// Protected routes with rate limiting
router.get('/me', AuthMiddleware, userProfileLimiter, UserController.me);

module.exports = router; 