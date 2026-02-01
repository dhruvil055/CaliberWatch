const Order = require('../models/Order');
const User = require('../models/User');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
    } = req.body;

    if (!fullName || !phone || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newOrder = new Order({
      user: req.user.id,
      userEmail: user.email,
      fullName,
      phone,
      shippingAddress,
      items,
      subtotal,
      shipping,
      total,
      status: 'Pending',
    });

    await newOrder.save();
    await newOrder.populate('items.watch');

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.watch');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.watch');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id && req.admin?.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.watch');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.watch');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};
