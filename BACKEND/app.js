const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const errorMiddleware = require('./middlewares/error');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1', require('./routes/product'));
app.use('/api/v1', require('./routes/auth'));
app.use('/api/v1', require('./routes/order'));
app.use('/api/v1', require('./routes/payment'));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');

  // Serve static files
  app.use(express.static(frontendBuildPath));

  // Serve React routing (index.html) for all other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
