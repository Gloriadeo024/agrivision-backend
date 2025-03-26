// backend/src/utils/db.js
const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('../config/config');

const db = {
  connect: async () => {
    try {
      await mongoose.connect(config.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      logger.info('Database connected successfully');
    } catch (err) {
      logger.error('Database connection failed: ' + err.message);
      process.exit(1);
    }
  },

  disconnect: async () => {
    try {
      await mongoose.disconnect();
      logger.info('Database disconnected successfully');
    } catch (err) {
      logger.error('Database disconnection failed: ' + err.message);
    }
  },

  isConnected: () => mongoose.connection.readyState === 1,
};

module.exports = db;
