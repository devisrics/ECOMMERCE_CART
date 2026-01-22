const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, 'config/config.env') });

const app = require('./app');
const connectDatabase = require('./config/database');

connectDatabase();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.error(err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.error(err.message);
  process.exit(1);
});
