const { StatusCodes } = require('http-status-codes');
const { NoteService, UserService } = require('../services');
const successResponse = require('../utils/common/success-response');
const errorResponse = require('../utils/common/error-response');

const create = async (req, res) => {
  try {
    const note = await NoteService.create({ ...req.body, userId: req.user.id });
    return res.status(StatusCodes.CREATED).json({
      ...successResponse,
      data: { note }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ...errorResponse,
      message: error.message
    });
  }
};

// Get user's notes with user data
const getMyNotes = async (req, res) => {
  try {
    const notes = await NoteService.getAll({ userId: req.user.id });
    const user = await UserService.getMe(req.user.id);
    
    return res.status(StatusCodes.OK).json({
      ...successResponse,
      data: {
        notes,
        user
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ...errorResponse,
      message: error.message
    });
  }
};

const get = async (req, res) => {
  try {
    const note = await NoteService.get(req.params.id, req.user.id);
    return res.status(StatusCodes.OK).json({
      ...successResponse,
      data: note
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ...errorResponse,
      message: error.message
    });
  }
};

const update = async (req, res) => {
  try {
    const note = await NoteService.update(req.params.id, req.body, req.user.id);
    return res.status(StatusCodes.OK).json({
      ...successResponse,
      data: note
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ...errorResponse,
      message: error.message
    });
  }
};

const destroy = async (req, res) => {
  try {
    await NoteService.destroy(req.params.id, req.user.id);
    return res.status(StatusCodes.NO_CONTENT).json({
      ...successResponse
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ...errorResponse,
      message: error.message
    });
  }
};

module.exports = {
  create,
  getMyNotes,
  get,
  update,
  destroy
}; 