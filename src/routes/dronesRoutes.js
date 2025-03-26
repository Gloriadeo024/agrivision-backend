// routes/drones.js - AI-Powered Drone Routes for AgriVision with Cloud Integration, Smart Mapping, Predictive Analysis, and Futuristic Capabilities

const express = require('express');
const router = express.Router();
const { 
  deployDrone, 
  getDroneData, 
  getDroneById, 
  updateDrone, 
  deleteDrone, 
  syncWithCloud, 
  generateAerialReports, 
  optimizeFlightPaths, 
  detectAnomalies, 
  recommendCropActions, 
  realTimeSurveillance, 
  autonomousFlightControl,
  AIWeatherAdaptation, 
  crossDroneCoordination, 
  predictiveYieldAnalysis,
  aiDrivenFlightOptimization,
  smartAlertSystem,
  dynamicResourceAllocation
} = require('../controllers/droneController');
const { authenticate } = require('../middleware/authMiddleware');

// Deploy a new drone mission
router.post('/deploy', authenticate, deployDrone);

// Get all drone data
router.get('/', authenticate, getDroneData);

// Get a drone's data by ID
router.get('/:id', authenticate, getDroneById);

// Update drone info
router.put('/:id', authenticate, updateDrone);

// Delete a drone record
router.delete('/:id', authenticate, deleteDrone);

// Cloud synchronization for real-time data processing
router.post('/cloud-sync', authenticate, syncWithCloud);

// Generate AI-driven aerial analysis reports
router.get('/:id/aerial-reports', authenticate, generateAerialReports);

// Optimize drone flight paths using AI algorithms
router.post('/:id/optimize-flight', authenticate, optimizeFlightPaths);

// Detect anomalies in crop health through AI vision
router.get('/:id/detect-anomalies', authenticate, detectAnomalies);

// AI recommendations for crop treatment based on drone data
router.post('/:id/recommend-crop-actions', authenticate, recommendCropActions);

// Real-time drone surveillance for farm security and monitoring
router.get('/:id/real-time-surveillance', authenticate, realTimeSurveillance);

// Autonomous flight control using AI decision-making
router.post('/:id/autonomous-flight', authenticate, autonomousFlightControl);

// AI adaptation to real-time weather changes for drone missions
router.get('/:id/weather-adaptation', authenticate, AIWeatherAdaptation);

// Cross-drone coordination for collaborative field analysis
router.post('/:id/cross-drone-coordination', authenticate, crossDroneCoordination);

// Predictive yield analysis using AI models and drone data
router.get('/:id/predictive-yield-analysis', authenticate, predictiveYieldAnalysis);

// AI-driven flight optimization using real-time and historical data
router.post('/:id/ai-flight-optimization', authenticate, aiDrivenFlightOptimization);

// Smart alert system for dynamic risk and event notifications
router.post('/:id/smart-alerts', authenticate, smartAlertSystem);

// Dynamic resource allocation based on AI-predicted needs
router.post('/:id/dynamic-resource-allocation', authenticate, dynamicResourceAllocation);

module.exports = router;