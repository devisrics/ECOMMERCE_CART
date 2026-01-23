const Product = require('../models/productModel');
const products = require('../data/products.json');
const connectDatabase = require('../config/database');
const dotenv = require('dotenv');

dotenv.config({ path: 'BACKEND/config/config.env' }); 

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('Products deleted!');
    await Product.insertMany(products);
    console.log('All products added!');
    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedProducts();
