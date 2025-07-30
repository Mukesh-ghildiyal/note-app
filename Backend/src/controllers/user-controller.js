const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const successResponse = require('../utils/common/success-response');
const errorResponse = require('../utils/common/error-response');

// Send OTP for login/signup
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...errorResponse,
        message: 'Email is required'
      });
    }

    const result = await UserService.sendOTPService(email);
    return res.status(StatusCodes.OK).json({
      ...successResponse,
      message: result.message
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ...errorResponse,
      message: error.message
    });
  }
};

// Login with OTP
const login = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...errorResponse,
        message: 'Email and OTP are required'
      });
    }

    const result = await UserService.login({ email, otp });
    return res.status(StatusCodes.OK).json({
      ...successResponse,
      data: result
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      ...errorResponse,
      message: error.message
    });
  }
};

// Verify OTP for signup
const verifyOTP = async (req, res) => {
  try {
    const { name, dob, email, otp } = req.body;
    if (!name || !dob || !email || !otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...errorResponse,
        message: 'Name, DOB, email and OTP are required'
      });
    }

    const result = await UserService.verifyOTP({ name, dob, email, otp });
    return res.status(StatusCodes.CREATED).json({
      ...successResponse,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      ...errorResponse,
      message: error.message
    });
  }
};

// Get user profile
const me = async (req, res) => {
  try {
    const user = await UserService.getMe(req.user.id);
    return res.status(StatusCodes.OK).json({
      ...successResponse,
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      ...errorResponse,
      message: error.message
    });
  }
};

module.exports = {
  sendOTP,
  login,
  verifyOTP,
  me
}; 