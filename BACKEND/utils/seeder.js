const path = require('path');
const products = require('../data/products.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const ConnectDatabase = require('../config/database');

// Load environment variables (absolute path)
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Debug: check DB URI
console.log('Mongo URI:', process.env.DB_LOCAL_URI);

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
