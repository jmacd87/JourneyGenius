const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const pricelineRoutes = require('../routes/priceline');
const chatRoutes = require('../routes/chat');

const app = express();
// CORS configuration
const corsOptions = {
  origin: ['https://journey-genius.vercel.app', 'http://localhost:3000'], // Allow both production and local frontend
  methods: ['GET', 'POST'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers if needed
};
// Apply CORS middleware
app.use(cors(corsOptions));
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
