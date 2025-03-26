// routes/irrigation.js - AI-Powered Irrigation Routes for AgriVision with Real-Time Monitoring, Predictive Insights, and Smart Scheduling

const express = require('express');
const router = express.Router();
const { 
  createIrrigationPlan, 
  getIrrigationPlans, 
  getIrrigationPlanById, 
  updateIrrigationPlan, 
  softDeleteIrrigationPlan, 
  getRealTimeWaterUsage, 
  getPredictiveWaterNeeds, 
  optimizeIrrigationSchedule, 
  getWeatherBasedAdjustments, 
  getSoilMoistureData 
} = require('../controllers/irrigationController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new irrigation plan
router.post('/', authenticate, createIrrigationPlan);

// Get all irrigation plans
router.get('/', authenticate, getIrrigationPlans);

// Get an irrigation plan by ID
router.get('/:id', authenticate, getIrrigationPlanById);

// Update an irrigation plan
router.put('/:id', authenticate, updateIrrigationPlan);

// Soft delete an irrigation plan
router.patch('/:id/softdelete', authenticate, softDeleteIrrigationPlan);

// Get real-time water usage data
router.get('/:id/real-time-water-usage', authenticate, getRealTimeWaterUsage);

// Get AI-powered predictive water needs
router.get('/:id/predictive-water-needs', authenticate, getPredictiveWaterNeeds);

// Optimize irrigation schedule using AI
router.get('/:id/optimize-schedule', authenticate, optimizeIrrigationSchedule);

// Adjust irrigation based on real-time weather patterns
router.get('/:id/weather-adjustments', authenticate, getWeatherBasedAdjustments);

// Get soil moisture data for precise irrigation
router.get('/:id/soil-moisture', authenticate, getSoilMoistureData);

module.exports = router;
