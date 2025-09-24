const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testDbConnection } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Test database connection on server start
testDbConnection();

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const trainingRoutes = require('./routes/training');
const quizRoutes = require('./routes/quiz');
const shopRoutes = require('./routes/shop');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/shop', shopRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('GreenDrop Backend API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});