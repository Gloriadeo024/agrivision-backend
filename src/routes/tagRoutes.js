// routes/tag.js - AI-Powered Tag Routes for AgriVision with Smart Tagging, Predictive Analytics, and Dynamic Optimization

const express = require('express');
const router = express.Router();
const { 
  createTag, 
  getTags, 
  getTagById, 
  updateTag, 
  deleteTag, 
  aiSuggestTags, 
  autoCategorizeTags, 
  dynamicTagOptimization, 
  predictiveTagAnalytics, 
  tagUsageTrends, 
  smartTagAlerts 
} = require('../controllers/tagController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new tag
router.post('/', authenticate, createTag);

// Get all tags
router.get('/', authenticate, getTags);

// Get tag by ID
router.get('/:id', authenticate, getTagById);

// Update tag by ID
router.put('/:id', authenticate, updateTag);

// Delete tag by ID
router.delete('/:id', authenticate, deleteTag);

// AI-powered tag suggestions based on user behavior and data trends
router.post('/ai-suggest', authenticate, aiSuggestTags);

// Automatically categorize tags using AI pattern recognition
router.post('/auto-categorize', authenticate, autoCategorizeTags);

// Optimize tag usage dynamically for better search and discovery
router.post('/dynamic-optimization', authenticate, dynamicTagOptimization);

// Predictive analytics for tag performance and trends
router.get('/predictive-analytics', authenticate, predictiveTagAnalytics);

// View tag usage trends over time
router.get('/usage-trends', authenticate, tagUsageTrends);

// Smart tag alert system for real-time notifications about trending tags or anomalies
router.post('/smart-alerts', authenticate, smartTagAlerts);

module.exports = router;
