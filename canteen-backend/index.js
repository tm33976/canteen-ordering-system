const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron'); 
require('dotenv').config(); 
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const Order = require('./models/Order'); 
const MenuItem = require('./models/MenuItem');

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 5001; 

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON data

//Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Call the connectDB function to establish connection
connectDB();

//Background Job for Auto-Cancelling Orders
// Schedule a job to run every minute
cron.schedule('*/1 * * * *', async () => {
  console.log('🕒 Running cron job to cancel stale orders...');
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    // Find orders that are 'Awaiting Pickup' and older than 15 minutes
    const staleOrders = await Order.find({
      status: 'Awaiting Pickup',
      createdAt: { $lt: fifteenMinutesAgo },
    });

    if (staleOrders.length > 0) {
      console.log(`Found ${staleOrders.length} stale order(s).`);
      // Process each stale order
      for (const order of staleOrders) {
        order.status = 'Cancelled';
        await order.save();

        // Restore the stock for each item in the cancelled order
        const stockUpdates = order.items.map(item => ({
          updateOne: {
            filter: { _id: item.menuItemId },
            update: { $inc: { stock: item.quantity } },
          },
        }));
        
        if (stockUpdates.length > 0) {
          await MenuItem.bulkWrite(stockUpdates);
        }
        console.log(`Order ${order._id} cancelled and stock restored.`);
      }
    } else {
      console.log('No stale orders found.');
    }
  } catch (err) {
    console.error('Error during cron job:', err);
  }
});

//API Routes
// This line connects your menu routes to the main application
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

//A simple test route
app.get('/', (req, res) => {
  res.send('Canteen Ordering System API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});