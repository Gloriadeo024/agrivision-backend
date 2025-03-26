// routes/farm.js - Advanced AI-Powered Farm Routes for AgriVision with Real-Time Monitoring, Proactive Suggestions, and Seasonal Insights

const express = require('express');
const router = express.Router();
const { 
  createFarm, 
  getFarms, 
  getFarmById, 
  updateFarm, 
  softDeleteFarm, 
  getFarmInsights, 
  getWeatherData, 
  getSeasonalSuggestions 
} = require('../controllers/farmController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new farm
router.post('/', authenticate, createFarm);

// Get all farms
router.get('/', authenticate, getFarms);

// Get a farm by ID
router.get('/:id', authenticate, getFarmById);

// Update a farm
router.put('/:id', authenticate, updateFarm);

// Soft delete a farm
router.patch('/:id/softdelete', authenticate, softDeleteFarm);

// Get AI-powered insights for a specific farm
router.get('/:id/insights', authenticate, getFarmInsights);

// Fetch real-time weather data for a farm's location
router.get('/:id/weather', authenticate, getWeatherData);

// Get proactive seasonal suggestions for a farm
router.get('/:id/seasonal-suggestions', authenticate, getSeasonalSuggestions);

module.exports = router;
