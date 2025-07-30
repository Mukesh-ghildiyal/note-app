const { UserRepository, OTPRepository } = require('../repositories');
const { sendOTP } = require('./email-service');
const AppError = require('../utils/errors/app-error');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MUKU';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for login/signup
const sendOTPService = async (email) => {
  // Check if user exists for login
  const existingUser = await UserRepository.findByEmail(email);
  
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP to database
  await OTPRepository.create({
    email,
    otp,
    expiresAt
  });

  // Send email
  const emailSent = await sendOTP(email, otp);
  if (!emailSent) {
    throw new AppError('Failed to send OTP email', 500);
  }

  return {
    message: existingUser ? 'OTP sent for login' : 'OTP sent for registration'
  };
};

// Login with OTP
const login = async ({ email, otp }) => {
  // Verify OTP
  const otpRecord = await OTPRepository.findValidOTP(email, otp);
  if (!otpRecord) {
    throw new AppError('Invalid or expired OTP', 401);
  }

  // Find user
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Mark OTP as used
  await OTPRepository.markAsUsed(otpRecord._id);

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token };
};

// Verify OTP for signup
const verifyOTP = async ({ name, dob, email, otp }) => {
  // Verify OTP
  const otpRecord = await OTPRepository.findValidOTP(email, otp);
  if (!otpRecord) {
    throw new AppError('Invalid or expired OTP', 401);
  }

  // Check if user already exists
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Create new user
  const user = await UserRepository.create({
    name,
    email,
    dob: new Date(dob)
  });

  // Mark OTP as used
  await OTPRepository.markAsUsed(otpRecord._id);

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token };
};

// Get user profile
const getMe = async (id) => {
  const user = await UserRepository.get(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    dob: user.dob
  };
};

module.exports = {
  sendOTPService,
  login,
  verifyOTP,
  getMe
}; 