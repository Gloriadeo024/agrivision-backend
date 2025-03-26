// backend/config/dotenv.js
require('dotenv').config(); // Load environment variables from .env file

// Optional: Validate required environment variables for early error detection
const requiredEnvVariables = ['DB_URI', 'PORT', 'SECRET_KEY'];
requiredEnvVariables.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

module.exports = process.env;
