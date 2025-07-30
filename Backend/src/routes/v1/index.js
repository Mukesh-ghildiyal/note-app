const express = require('express');
const { InfoController } = require('../../controllers');
const noteRoutes = require('./note-routes');
const userRoutes = require('./user-routes');
const router = express.Router();

router.use('/notes', noteRoutes);
router.use('/users', userRoutes);

router.get('/info', InfoController.info);

module.exports = router;
