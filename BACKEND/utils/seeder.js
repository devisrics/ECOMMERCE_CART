const products = require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const ConnectDatabase = require('../config/database');

// Load environment variables (correct relative path)
dotenv.config({ path: '../config/config.env' });

// Connect to MongoDB
ConnectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('Existing products deleted');

    await Product.insertMany(products);
    console.log('All products added successfully');
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
  process.exit();
};

seedProducts();
