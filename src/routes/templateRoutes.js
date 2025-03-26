// routes/template.js - AI-Powered Template Routes for AgriVision with Predictive Analytics, Smart Optimization, Real-Time Adaptive Design Suggestions, and Regional Trend Analysis

const express = require('express');
const router = express.Router();
const { 
  createTemplate, 
  getTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate, 
  softDeleteTemplate, 
  aiSuggestTemplates, 
  optimizeTemplateUsage, 
  predictiveTemplateAnalytics, 
  templateUsageTrends, 
  smartTemplateAlerts, 
  personalizeTemplates, 
  designTrendForecasting, 
  realTimeAdaptiveDesign, 
  regionalTrendAnalysis, 
  adaptiveABTesting, 
  dynamicHeatmaps
} = require('../controllers/templateController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new template
router.post('/', authenticate, createTemplate);

// Get all templates
router.get('/', authenticate, getTemplates);

// Get a template by ID
router.get('/:id', authenticate, getTemplateById);

// Update template by ID
router.put('/:id', authenticate, updateTemplate);

// Soft delete a template by ID
router.patch('/:id/softdelete', authenticate, softDeleteTemplate);

// Hard delete a template (if needed)
router.delete('/:id', authenticate, deleteTemplate);

// AI-powered template suggestions based on user behavior and data trends
router.post('/ai-suggest', authenticate, aiSuggestTemplates);

// Optimize template usage dynamically for better discovery and performance
router.post('/optimize-usage', authenticate, optimizeTemplateUsage);

// Predictive analytics for template performance and trends
router.get('/predictive-analytics', authenticate, predictiveTemplateAnalytics);

// View template usage trends over time
router.get('/usage-trends', authenticate, templateUsageTrends);

// Smart template alert system for real-time notifications about popular or underperforming templates
router.post('/smart-alerts', authenticate, smartTemplateAlerts);

// Personalize template recommendations for users based on preferences and past activity
router.post('/personalize', authenticate, personalizeTemplates);

// AI-driven design trend forecasting to predict future design preferences
router.get('/design-trend-forecasting', authenticate, designTrendForecasting);

// Real-time adaptive design suggestions based on live data insights
router.get('/real-time-adaptive-design', authenticate, realTimeAdaptiveDesign);

// Regional trend analysis for tailoring templates to local design preferences
router.get('/regional-trend-analysis', authenticate, regionalTrendAnalysis);

// AI-powered adaptive A/B testing for template performance optimization
router.post('/adaptive-ab-testing', authenticate, adaptiveABTesting);

// Dynamic heatmaps to visualize user interaction with templates
router.get('/dynamic-heatmaps', authenticate, dynamicHeatmaps);

module.exports = router;
