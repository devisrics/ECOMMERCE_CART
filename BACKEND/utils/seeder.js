const path = require('path');
const dotenv = require('dotenv');

// Load .env first!
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });
console.log('Mongo URI:', process.env.DB_LOCAL_URI); // should print your URI

const products = require('../data/products.json');
const Product = require('../models/productModel');
const ConnectDatabase = require('../config/database');

// Now connect to DB
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
