const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// @route   POST api/menu
// @desc    Add a new menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    const newItem = new MenuItem({ name, description, price, stock, imageUrl });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: 'Error creating menu item', error: err.message });
  }
});

// @route   GET api/menu
// @desc    Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu items', error: err.message });
  }
});

// @route   PUT api/menu/:id
// @desc    Update a menu item (e.g., change price or stock)
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: 'Error updating menu item', error: err.message });
  }
});

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting menu item', error: err.message });
  }
});

module.exports = router;