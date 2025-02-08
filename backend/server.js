const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const pricelineRoutes = require('./routes/priceline');
const chatRoutes = require('./routes/chat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flights', pricelineRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`Request from IP: ${req.ip} at ${new Date().toISOString()}`);
  console.log('Request Body:', req.body);
  console.log('Request Query:', req.query);
  next();
});
