const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

const app = express();

// ----- CORS -----
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// ----- Body parser -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----- Static uploads -----
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----- Routes -----
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');

app.use('/api/v1', auth);
app.use('/api/v1', products);
app.use('/api/v1', order);
app.use('/api/v1', payment);

// ----- TEST route -----
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// ----- Production React build catch-all -----
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');

  // Serve static files
  app.use(express.static(buildPath));

  // Catch-all for React routes
  app.get('*', (req, res) => {
    res.set('Cache-Control', 'no-store'); // prevent caching
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// ----- Error middleware -----
app.use(errorMiddleware);

module.exports = app;
