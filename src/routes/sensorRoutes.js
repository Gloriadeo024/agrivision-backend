// routes/sensor.js - AI-Powered Sensor Routes for AgriVision with Smart Monitoring, Predictive Analytics, and Futuristic Capabilities

const express = require('express');
const router = express.Router();
const { 
  createSensor, 
  getSensors, 
  getSensorById, 
  updateSensor, 
  deleteSensor, 
  syncSensorDataToCloud, 
  analyzeSoilMoisture, 
  predictCropStressLevels, 
  detectSensorAnomalies, 
  AIBackedIrrigationControl, 
  recommendFertilizerUsage, 
  realTimeClimateMonitoring,
  multiSensorDataFusion, 
  generateSensorHealthReports, 
  forecastEnvironmentalRisks,
  aiDrivenSoilOptimization,
  adaptiveSensorConfigurations,
  smartClimateAlerts
} = require('../controllers/sensorController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new sensor
router.post('/', authenticate, createSensor);

// Get all sensors
router.get('/', authenticate, getSensors);

// Get a sensor by ID
router.get('/:id', authenticate, getSensorById);

// Update sensor by ID
router.put('/:id', authenticate, updateSensor);

// Delete a sensor by ID
router.delete('/:id', authenticate, deleteSensor);

// Sync sensor data to the cloud for real-time processing
router.post('/cloud-sync', authenticate, syncSensorDataToCloud);

// AI-powered soil moisture analysis
router.get('/:id/soil-moisture', authenticate, analyzeSoilMoisture);

// Predict crop stress levels using AI insights
router.get('/:id/crop-stress-prediction', authenticate, predictCropStressLevels);

// Detect sensor anomalies and irregularities
router.get('/:id/detect-anomalies', authenticate, detectSensorAnomalies);

// AI-backed irrigation control systems
router.post('/:id/ai-irrigation', authenticate, AIBackedIrrigationControl);

// Recommend fertilizer usage based on AI models
router.post('/:id/fertilizer-recommendations', authenticate, recommendFertilizerUsage);

// Real-time climate condition monitoring
router.get('/:id/real-time-climate', authenticate, realTimeClimateMonitoring);

// AI multi-sensor data fusion for comprehensive insights
router.post('/:id/multi-sensor-fusion', authenticate, multiSensorDataFusion);

// Generate sensor health and performance reports
router.get('/:id/health-reports', authenticate, generateSensorHealthReports);

// Forecast environmental risks using AI predictions
router.get('/:id/environmental-risk-forecast', authenticate, forecastEnvironmentalRisks);

// AI-driven soil optimization for maximum yield
router.post('/:id/ai-soil-optimization', authenticate, aiDrivenSoilOptimization);

// Adaptive sensor configurations based on AI feedback
router.post('/:id/adaptive-sensor-configurations', authenticate, adaptiveSensorConfigurations);

// Smart climate alert system for real-time extreme weather notifications
router.post('/:id/smart-climate-alerts', authenticate, smartClimateAlerts);

module.exports = router;
