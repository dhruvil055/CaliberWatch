const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

// Public route
router.post('/login', adminController.adminLogin);

// Protected route
router.get('/profile', authenticateAdmin, adminController.getAdminProfile);

module.exports = router;
