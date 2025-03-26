// models/AIInsight.js - AI Insight Model for AgriVision System
const mongoose = require('mongoose');

const AIInsightSchema = new mongoose.Schema({
  analysisType: { type: String, required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, required: true },
  dataSource: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Track user who triggered the analysis
  modelVersion: { type: String, default: '1.0' }, // AI model version
  datasetSize: { type: Number, default: 0 }, // Number of data points analyzed
  processingTime: { type: Number, default: 0 }, // Time taken for AI analysis (ms)
  validated: { type: Boolean, default: false }, // Whether the prediction has been validated
  validationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Enhanced validation tracking
  feedback: { type: String, default: '' }, // User feedback on AI prediction
  historicalTrends: [{ timestamp: Date, price: Number }], // Historical price trends
  regionSupplyDemand: [{ region: String, supply: Number, demand: Number }], // Region-based supply-demand analytics
  blockchainVerification: { type: Boolean, default: false }, // Blockchain price verification
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AIInsight', AIInsightSchema);
