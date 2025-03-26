// routes/category.js - AI-Enhanced Category Routes for AgriVision with Risk Detection, Real-Time Event Broadcasting, and Scalability

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  softDeleteCategory 
} = require('../controllers/categoryController');
const { calculateRiskScore, trackAnomalies } = require('../utils/riskDetection');
const { broadcastEvent } = require('../utils/websocket');

// Rate limiting to prevent abuse
const categoryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: 'Too many requests, please try again later.',
  headers: true
});

// Create a new category with risk detection and real-time event
router.post('/', categoryLimiter, async (req, res) => {
  const { name, description, ipAddress, userAgent } = req.body;
  try {
    const riskScore = await calculateRiskScore(ipAddress, userAgent, name);
    await trackAnomalies(name, ipAddress, riskScore);

    if (riskScore > 80) { // Risk threshold
      broadcastEvent('high_risk_category_creation', { name, riskScore });
      return res.status(403).json({ message: 'Category creation flagged as high-risk.' });
    }

    const category = await createCategory(req.body);
    broadcastEvent('category_created', { name: category.name });
    res.status(201).json(category);
  } catch (err) {
    console.error('Category creation error:', err.message);
    broadcastEvent('category_creation_error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
router.get('/', categoryLimiter, async (req, res) => {
  try {
    const categories = await getCategories();
    broadcastEvent('categories_fetched');
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    broadcastEvent('category_fetch_error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a category by ID
router.get('/:id', categoryLimiter, async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    broadcastEvent('category_fetched', { id: req.params.id });
    res.status(200).json(category);
  } catch (err) {
    console.error('Error fetching category by ID:', err.message);
    broadcastEvent('category_fetch_error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a category
router.put('/:id', categoryLimiter, async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    broadcastEvent('category_updated', { id: req.params.id });
    res.status(200).json(category);
  } catch (err) {
    console.error('Error updating category:', err.message);
    broadcastEvent('category_update_error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

// Soft delete a category
router.patch('/:id/softdelete', categoryLimiter, async (req, res) => {
  try {
    const category = await softDeleteCategory(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    broadcastEvent('category_soft_deleted', { id: req.params.id });
    res.status(200).json({ message: 'Category soft deleted' });
  } catch (err) {
    console.error('Error soft deleting category:', err.message);
    broadcastEvent('category_delete_error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
