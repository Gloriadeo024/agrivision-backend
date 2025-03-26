// backend/src/utils/tokenUtils.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('./logger');
const aiUtils = require('./aiUtils');

const tokenUtils = {
  generateToken: (user, expiresIn = '2h') => {
    try {
      const payload = { id: user.id, role: user.role };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn });
      logger.info('Token generated successfully', { userId: user.id, role: user.role });
      aiUtils.analyzeTokenUsage(user, 'generate');
      return token;
    } catch (err) {
      logger.error('Error generating token', { error: err.message });
      throw new Error('Token generation failed');
    }
  },

  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      logger.info('Token verified successfully', { userId: decoded.id, role: decoded.role });
      aiUtils.analyzeTokenUsage(decoded, 'verify');
      return decoded;
    } catch (err) {
      logger.warn('Invalid or expired token', { error: err.message });
      throw new Error('Invalid or expired token');
    }
  },

  decodeToken: (token) => {
    try {
      const decoded = jwt.decode(token);
      logger.info('Token decoded', { payload: decoded });
      return decoded;
    } catch (err) {
      logger.error('Error decoding token', { error: err.message });
      throw new Error('Token decoding failed');
    }
  },

  isTokenExpired: (token) => {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return true;
      const isExpired = Date.now() >= decoded.exp * 1000;
      logger.info('Token expiration check', { expired: isExpired });
      return isExpired;
    } catch (err) {
      logger.error('Error checking token expiration', { error: err.message });
      return true;
    }
  }
};

module.exports = tokenUtils;
