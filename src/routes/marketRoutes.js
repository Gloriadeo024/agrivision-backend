// routes/market.js - AI-Powered Market Routes for AgriVision with Predictive Analytics, Cross-Region Comparisons, Trend Visualizations, Competitor Insights, Smart Alerts, Customizable Alert Preferences, and AI-Driven Future Market Predictions

const express = require('express');
const router = express.Router();
const { 
  createMarketListing, 
  getMarketListings, 
  getMarketListingById, 
  updateMarketListing, 
  softDeleteMarketListing, 
  getRealTimePriceTrends, 
  getDemandForecasts, 
  getCrossRegionComparisons, 
  recommendOptimalPricing, 
  suggestMarketOpportunities, 
  visualizeMarketTrends, 
  analyzeCompetitorInsights, 
  getSmartAlerts, 
  setAlertPreferences, 
  configureAlertThresholds, 
  getUserAlertPreferences,
  getAIDrivenMarketPredictions
} = require('../controllers/marketController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new market listing
router.post('/', authenticate, createMarketListing);

// Get all market listings
router.get('/', authenticate, getMarketListings);

// Get a market listing by ID
router.get('/:id', authenticate, getMarketListingById);

// Update a market listing
router.put('/:id', authenticate, updateMarketListing);

// Soft delete a market listing
router.patch('/:id/softdelete', authenticate, softDeleteMarketListing);

// Get real-time price trends using AI analysis
router.get('/:id/real-time-price-trends', authenticate, getRealTimePriceTrends);

// AI-powered demand forecasts based on historical and current data
router.get('/:id/demand-forecasts', authenticate, getDemandForecasts);

// Cross-region price and demand comparisons for strategic decisions
router.get('/:id/cross-region-comparisons', authenticate, getCrossRegionComparisons);

// AI-driven optimal pricing recommendations
router.get('/:id/optimal-pricing', authenticate, recommendOptimalPricing);

// Smart market opportunity suggestions based on AI pattern recognition
router.get('/:id/market-opportunities', authenticate, suggestMarketOpportunities);

// AI-powered trend visualizations for better decision-making
router.get('/:id/market-trend-visualizations', authenticate, visualizeMarketTrends);

// Competitor insights analysis to stay ahead in the market
router.get('/:id/competitor-insights', authenticate, analyzeCompetitorInsights);

// AI-powered Smart Alert System for real-time notifications on price surges, market shifts, and competitor moves
router.get('/:id/smart-alerts', authenticate, getSmartAlerts);

// Set customizable alert preferences (thresholds for price changes, etc.)
router.post('/:id/alert-preferences', authenticate, setAlertPreferences);

// Configure advanced alert thresholds for price and demand changes
router.post('/:id/alert-thresholds', authenticate, configureAlertThresholds);

// Get user-specific alert preferences
router.get('/:id/user-alert-preferences', authenticate, getUserAlertPreferences);

// AI-Driven Future Market Predictions based on historical data, weather patterns, and economic indicators
router.get('/:id/ai-market-predictions', authenticate, getAIDrivenMarketPredictions);

module.exports = router;
