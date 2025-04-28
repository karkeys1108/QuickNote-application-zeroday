const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let dbConnected = false;

try {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      dbConnected = true;
    })
    .catch(err => {
      console.error('Could not connect to MongoDB', err);
      console.log('Server will continue running without database connection');
    });
} catch (error) {
  console.error('MongoDB connection error:', error);
  console.log('Server will continue running without database connection');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('QuickNotes API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
