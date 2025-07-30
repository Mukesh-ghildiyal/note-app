const express = require('express');
const { NoteController } = require('../../controllers');
const { 
  AuthMiddleware, 
  userRateLimiter, 
  notesCreationLimiter, 
  notesDeletionLimiter 
} = require('../../middlewares');
const router = express.Router();

// All note routes require authentication
router.use(AuthMiddleware);
router.use(userRateLimiter);

// Get user's notes with user data
router.get('/me', NoteController.getMyNotes);

// CRUD operations with specific rate limiting
router.post('/', notesCreationLimiter, NoteController.create);
router.get('/:id', NoteController.get);
router.put('/:id', NoteController.update);
router.delete('/:id', notesDeletionLimiter, NoteController.destroy);

module.exports = router; 