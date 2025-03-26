// analyticsController.js
const Analytics = require('./models/Analytics');
const { logEvent } = require('./utils/logger');
const { reportError } = require('./context/ErrorContext');
const aiAnalyticsEngine = require('./utils/aiAnalyticsEngine');

// Collect analytics data
exports.collectData = async (req, res) => {
  try {
    const { eventType, eventData } = req.body;
    const newEvent = await Analytics.create({ eventType, eventData, timestamp: new Date() });
    logEvent('Analytics Data Collected', { eventType, eventData });
    res.status(201).json({ message: 'Analytics data collected successfully', newEvent });
  } catch (error) {
    reportError(error, 'Collect Analytics Data');
    res.status(500).json({ error: error.message });
  }
};

// Get summarized analytics using AI
exports.getSummary = async (req, res) => {
  try {
    const summary = await aiAnalyticsEngine.generateSummary();
    logEvent('AI Analytics Summary Generated');
    res.status(200).json({ message: 'Analytics summary generated successfully', summary });
  } catch (error) {
    reportError(error, 'Get Analytics Summary');
    res.status(500).json({ error: error.message });
  }
};

// Track user behavior trends
exports.trackUserTrends = async (req, res) => {
  try {
    const trends = await aiAnalyticsEngine.trackTrends();
    logEvent('User Behavior Trends Analyzed');
    res.status(200).json({ message: 'User trends analyzed successfully', trends });
  } catch (error) {
    reportError(error, 'Track User Trends');
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
