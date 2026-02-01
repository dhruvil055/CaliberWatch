const Watch = require('../models/Watch');

// Get all watches
exports.getAllWatches = async (req, res) => {
  try {
    const watches = await Watch.find();
    res.json(watches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watches', error: error.message });
  }
};

// Get watch by ID
exports.getWatchById = async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json(watch);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watch', error: error.message });
  }
};

// Create watch (Admin only)
exports.createWatch = async (req, res) => {
  try {
    const { image, title, description, price } = req.body;

    if (!image || !title || !description || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newWatch = new Watch({
      image,
      title,
      description,
      price: Number(price),
    });

    await newWatch.save();
    res.status(201).json({ message: 'Watch created successfully', watch: newWatch });
  } catch (error) {
    res.status(500).json({ message: 'Error creating watch', error: error.message });
  }
};

// Update watch (Admin only)
exports.updateWatch = async (req, res) => {
  try {
    const { image, title, description, price } = req.body;

    const updatedWatch = await Watch.findByIdAndUpdate(
      req.params.id,
      { image, title, description, price: Number(price) },
      { new: true }
    );

    if (!updatedWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    res.json({ message: 'Watch updated successfully', watch: updatedWatch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating watch', error: error.message });
  }
};

// Delete watch (Admin only)
exports.deleteWatch = async (req, res) => {
  try {
    const deletedWatch = await Watch.findByIdAndDelete(req.params.id);

    if (!deletedWatch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    res.json({ message: 'Watch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting watch', error: error.message });
  }
};
