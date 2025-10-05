const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  // We will store a simplified list of the items in the order
  items: [
    {
      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    // The status will change based on user actions and our background job
    enum: ['Awaiting Pickup', 'Completed', 'Cancelled'],
    default: 'Awaiting Pickup',
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;