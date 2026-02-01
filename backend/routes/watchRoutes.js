const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', watchController.getAllWatches);
router.get('/:id', watchController.getWatchById);

// Admin routes
router.post('/', authenticateAdmin, watchController.createWatch);
router.put('/:id', authenticateAdmin, watchController.updateWatch);
router.delete('/:id', authenticateAdmin, watchController.deleteWatch);

module.exports = router;
