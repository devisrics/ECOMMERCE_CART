const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, "config/config.env") });

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1', require('./routes/product'));
app.use('/api/v1', require('./routes/auth'));
app.use('/api/v1', require('./routes/order'));
app.use('/api/v1', require('./routes/payment'));

// Serve React in production
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');

  app.use(express.static(frontendBuildPath));

  // Must be last route
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Error middleware
app.use(errorMiddleware);

module.exports = app;
