const app = require('./app');
const connectDatabase = require('./config/database');
const Product = require('./models/productModel');
const products = require('./data/products.json');

connectDatabase();

const PORT = process.env.PORT || 8000;

const seedProducts = async () => {
    await Product.deleteMany();
    await Product.insertMany(require(products));
    console.log('Products seeded!');
};

seedProducts()
  .then(() => {
      app.listen(PORT, '0.0.0.0', () => {
          console.log(`Server running on port ${PORT}`);
      });
  })
  .catch(err => {
      console.error('Seeding failed:', err);
      process.exit(1); // exit if seeding fails
  });
