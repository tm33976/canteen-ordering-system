const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @route   POST api/orders
// @desc    Create a new order and decrement stock
router.post('/', async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item.' });
  }

  try {
    let totalAmount = 0;
    const orderedItems = [];
    const stockUpdates = [];

    //Validate items and check stock availability
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item with ID ${item.menuItemId} not found.` });
      }
      if (menuItem.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${menuItem.name}.` });
      }
      
      totalAmount += menuItem.price * item.quantity;
      orderedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      });

      // Prepare stock update operation
      stockUpdates.push({
        updateOne: {
          filter: { _id: menuItem._id },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    //  Perform all stock updates
    await MenuItem.bulkWrite(stockUpdates);

    //Create and save the new order
    const newOrder = new Order({
      items: orderedItems,
      totalAmount: totalAmount,
      status: 'Awaiting Pickup',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error('--- ORDER CREATION CRASH ---', err); // Added for better error logging
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// @route   GET api/orders
// @desc    Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
});

// @route   GET api/orders/:id
// @desc    Get a single order by its ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order', error: err.message });
    }
});

module.exports = router;