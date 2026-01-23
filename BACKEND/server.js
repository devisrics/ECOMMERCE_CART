const app = require('./app'); // Express app
const connectDatabase = require('./config/database');
const Product = require('./models/product');

connectDatabase();

const PORT = process.env.PORT || 8000;

// Seed function
const seedProducts = async () => {
    await Product.deleteMany();
    await Product.insertMany(require('./data/products'));
    console.log('Products seeded!');
};

// Run seeding and then start server
seedProducts().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Seeding failed:', err);
});
