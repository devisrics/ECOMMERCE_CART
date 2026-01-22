const dotenv = require('dotenv');
const path = require('path');

// ✅ 1. LOAD ENV FIRST (MOST IMPORTANT)
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// ✅ 2. THEN require everything else
const app = require('./app');
const connectdatabase = require('./config/database');

// ✅ 3. Connect DB
connectdatabase();

// ✅ 4. Start server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to unhandled rejection');
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to uncaught exception');
  process.exit(1);
});
