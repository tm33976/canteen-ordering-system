const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  imageUrl: {
    type: String,
    required: false,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = MenuItem;