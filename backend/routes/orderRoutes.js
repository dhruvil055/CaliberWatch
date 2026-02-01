const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

// User routes (protected)
router.post('/', authenticateToken, orderController.createOrder);
router.get('/user', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);

// Admin routes
router.get('/', authenticateAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticateAdmin, orderController.updateOrderStatus);

module.exports = router;
