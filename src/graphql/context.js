// graphql/context.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const aiModels = require('../ai/models');
const cache = require('../utils/cache');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');

const context = ({ req }) => {
  const token = req.headers.authorization || '';
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  const checkRole = (roles) => {
    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
  };

  const getCachedData = async (key, fetchFunction) => {
    const cachedData = await cache.get(key);
    if (cachedData) return JSON.parse(cachedData);
    const freshData = await fetchFunction();
    await cache.set(key, JSON.stringify(freshData), 3600); // Cache for 1 hour
    return freshData;
  };

  const updateAIModel = async (sensorData) => {
    try {
      const aiResponse = await aiModels.updatePredictions(sensorData);
      console.log('AI model recalibrated:', aiResponse);
      return aiResponse;
    } catch (err) {
      console.error('Error updating AI model:', err);
    }
  };

  return {
    db,
    user,
    checkRole,
    getCachedData,
    updateAIModel,
  };
};

module.exports = context;
