// config.js - Centralized Configuration
require('dotenv').config();

module.exports = {
  database: {
    uri: process.env.MONGO_URI,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  security: {
    rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5001'],
  },
};
