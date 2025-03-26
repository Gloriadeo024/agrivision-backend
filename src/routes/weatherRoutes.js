// routes/weather.js - AI-Powered Weather Routes for AgriVision with Satellite Data Integration, Hyperlocal Forecasting, Crop Impact Analysis, AI-Driven Crop Yield Predictions, and Disaster Response Strategies

const express = require('express');
const router = express.Router();
const { 
  fetchRealTimeWeather, 
  getWeatherByLocation, 
  aiClimateTrendAnalysis, 
  cropImpactForecast, 
  satelliteDataIntegration, 
  hyperlocalWeatherForecast, 
  seasonalWeatherPrediction, 
  realTimeWeatherAlerts, 
  adaptiveWeatherRiskMonitoring, 
  predictiveExtremeWeatherAlerts, 
  weatherDataVisualization, 
  aiPoweredWeatherAnomalyDetection, 
  voiceActivatedWeatherReports,
  aiCropYieldPrediction, 
  aiDisasterResponseStrategy,
  crossReferencedPredictiveAlerts,
  automatedEmergencyTriggers,
  communityAlertSystems
} = require('../controllers/weatherController');
const { authenticate } = require('../middleware/authMiddleware');

// Fetch real-time weather data
router.get('/real-time', authenticate, fetchRealTimeWeather);

// Get weather by location
router.get('/location/:location', authenticate, getWeatherByLocation);

// AI-powered climate trend analysis
router.get('/ai-climate-trends', authenticate, aiClimateTrendAnalysis);

// Forecast crop impact based on weather patterns
router.post('/crop-impact-forecast', authenticate, cropImpactForecast);

// AI-driven crop yield predictions based on weather data and satellite insights
router.post('/crop-yield-prediction', authenticate, aiCropYieldPrediction);

// Integrate satellite data for accurate weather tracking
router.get('/satellite-data', authenticate, satelliteDataIntegration);

// Hyperlocal weather forecasting for precision farming
router.get('/hyperlocal-forecast', authenticate, hyperlocalWeatherForecast);

// Seasonal weather predictions to support planting decisions
router.get('/seasonal-predictions', authenticate, seasonalWeatherPrediction);

// Real-time weather alerts for farmers
router.post('/real-time-alerts', authenticate, realTimeWeatherAlerts);

// AI-powered adaptive risk monitoring for weather-related risks
router.post('/adaptive-risk-monitoring', authenticate, adaptiveWeatherRiskMonitoring);

// Predictive extreme weather alerts (storms, droughts, etc.)
router.get('/predictive-extreme-alerts', authenticate, predictiveExtremeWeatherAlerts);

// Cross-referenced predictive alerts with AI-driven disaster response strategies
router.get('/cross-referenced-alerts', authenticate, crossReferencedPredictiveAlerts);

// Visualize weather data trends for user insights
router.get('/data-visualization', authenticate, weatherDataVisualization);

// AI-powered anomaly detection for unexpected weather events
router.post('/ai-anomaly-detection', authenticate, aiPoweredWeatherAnomalyDetection);

// Voice-activated weather reports for hands-free insights
router.post('/voice-activated-reports', authenticate, voiceActivatedWeatherReports);

// AI-based disaster response strategies for severe weather conditions
router.post('/disaster-response', authenticate, aiDisasterResponseStrategy);

// Automated emergency response triggers for critical weather events
router.post('/automated-emergency-triggers', authenticate, automatedEmergencyTriggers);

// Community alert systems to notify local farmers of imminent weather threats
router.post('/community-alert-systems', authenticate, communityAlertSystems);

module.exports = router;
