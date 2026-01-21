const mongoose = require('mongoose');

const connectDatabase = () => {
  console.log('Connecting to MongoDB with URI:', process.env.DB_LOCAL_URI); // add this line
  mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected successfully');
  }).catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
};

module.exports = connectDatabase;
