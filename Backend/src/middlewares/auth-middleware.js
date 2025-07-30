const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const JWT_SECRET = process.env.JWT_SECRET || 'MUKU';

const AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AppError('Access token required', StatusCodes.UNAUTHORIZED);
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user exists
    const user = await UserRepository.get(decoded.id);
    if (!user) {
      throw new AppError('User not found', StatusCodes.UNAUTHORIZED);
    }

    // Add user to request
    req.user = {
      id: user._id,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Token expired'
      });
    }

    return res.status(error.statusCode || StatusCodes.UNAUTHORIZED).json({
      message: error.message
    });
  }
};

module.exports = { AuthMiddleware }; 