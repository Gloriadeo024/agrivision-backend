// routes/user.js - AI-Powered User Routes for AgriVision with Fraud Detection, Dynamic Clustering, Real-Time User Journey Mapping, and AI Voice Integration

const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  softDeleteUser, 
  aiDetectFraud, 
  dynamicUserClustering, 
  realTimeUserJourney, 
  personalizedUserRecommendations, 
  behavioralAnalytics, 
  adaptiveSecurityMonitoring, 
  userEngagementForecasting, 
  aiDashboardVisualization, 
  aiAnomalyDetection, 
  voiceActivatedUserInsights, 
  predictiveUserBehavior, 
  userSentimentAnalysis, 
  realTimeAlertSystem, 
  customUserJourneyReports 
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new user
router.post('/', authenticate, createUser);

// Get all users
router.get('/', authenticate, getUsers);

// Get a user by ID
router.get('/:id', authenticate, getUserById);

// Update user by ID
router.put('/:id', authenticate, updateUser);

// Soft delete a user by ID
router.patch('/:id/softdelete', authenticate, softDeleteUser);

// Hard delete a user (if needed)
router.delete('/:id', authenticate, deleteUser);

// AI-powered fraud detection for user activities
router.post('/ai-detect-fraud', authenticate, aiDetectFraud);

// Dynamic user clustering for personalized experiences
router.get('/dynamic-clustering', authenticate, dynamicUserClustering);

// Real-time user journey mapping for enhanced UX
router.get('/real-time-user-journey', authenticate, realTimeUserJourney);

// Personalized user recommendations using AI
router.post('/personalized-recommendations', authenticate, personalizedUserRecommendations);

// Behavioral analytics for user pattern insights
router.get('/behavioral-analytics', authenticate, behavioralAnalytics);

// Adaptive security monitoring with AI
router.post('/adaptive-security-monitoring', authenticate, adaptiveSecurityMonitoring);

// Forecast user engagement trends
router.get('/user-engagement-forecasting', authenticate, userEngagementForecasting);

// AI-powered user insights dashboard visualization
router.get('/ai-dashboard', authenticate, aiDashboardVisualization);

// AI-powered anomaly detection to flag unexpected user activities
router.post('/ai-anomaly-detection', authenticate, aiAnomalyDetection);

// Voice-activated user insights for real-time data queries
router.post('/voice-activated-insights', authenticate, voiceActivatedUserInsights);

// Predictive user behavior analysis
router.get('/predictive-user-behavior', authenticate, predictiveUserBehavior);

// Real-time user sentiment analysis
router.post('/user-sentiment-analysis', authenticate, userSentimentAnalysis);

// Real-time AI-powered alert system for critical user events
router.post('/real-time-alert-system', authenticate, realTimeAlertSystem);

// Generate custom AI-driven user journey reports
router.get('/custom-user-journey-reports', authenticate, customUserJourneyReports);

module.exports = router;
