const mongoose = require('mongoose');
const { Blockchain } = require('../utils/blockchain'); // Blockchain integration
const { AIAnalytics } = require('../utils/aiAnalytics'); // AI-powered insights

const MarketAccessSchema = new mongoose.Schema({
  product: { type: String, required: true },
  demandLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
  supplyLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
  marketLocation: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

const MarketSchema = new mongoose.Schema({
  product: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  demand: { type: Number, default: 0, min: 0 },
  supply: { type: Number, default: 0, min: 0 },
  priceTrends: [{ date: Date, price: Number }], // Historical price trends
  aiInsights: {
    type: Map,
    of: new mongoose.Schema({
      confidenceInterval: { type: [Number], default: [0, 0] },
      predictedPriceRange: { type: [Number], default: [0, 0] },
      demandForecast: { type: Number, default: 0 },
      supplyForecast: { type: Number, default: 0 },
      riskAssessment: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      volatilityIndex: { type: Number, default: 0 },
      predictionAccuracy: { type: Number, min: 0, max: 100, default: 0 },
      trendConfidenceScore: { type: Number, min: 0, max: 100, default: 50 },
      aiModelVersion: { type: String, default: 'v1.0' },
      explanation: { type: String, default: 'No explanation available' },
    }),
  }, // AI-driven market predictions
  blockchainHash: { type: String }, // Blockchain price verification
  marketAccess: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketAccess' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  maxPriceTrendHistory: { type: Number, default: 100 }, // Configurable trend history limit
});

// Indexing for faster queries
MarketSchema.index({ product: 1, location: 1 });

// Pre-save middleware to record price history, AI insights, and update blockchain
MarketSchema.pre('save', async function (next) {
  if (this.isModified('price') || this.isModified('demand') || this.isModified('supply')) {
    if (this.priceTrends.length >= this.maxPriceTrendHistory) {
      this.priceTrends.shift(); // Limit trend history dynamically
    }
    this.priceTrends.push({ date: new Date(), price: this.price });
    
    try {
      this.blockchainHash = await Blockchain.recordTransaction({
        product: this.product,
        price: this.price,
        location: this.location,
        timestamp: new Date(),
      });

      const insights = await AIAnalytics.generateMarketInsights({
        product: this.product,
        price: this.price,
        demand: this.demand,
        supply: this.supply,
        location: this.location
      });

      if (insights && typeof insights === 'object' && Object.keys(insights).length > 0) {
        this.aiInsights.set('confidenceInterval', insights.confidenceInterval || [0, 0]);
        this.aiInsights.set('predictedPriceRange', insights.predictedPriceRange || [0, 0]);
        this.aiInsights.set('demandForecast', insights.demandForecast || 0);
        this.aiInsights.set('supplyForecast', insights.supplyForecast || 0);
        this.aiInsights.set('riskAssessment', insights.riskAssessment || 'low');
        this.aiInsights.set('volatilityIndex', insights.volatilityIndex || 0);
        this.aiInsights.set('predictionAccuracy', insights.predictionAccuracy || 0);
        this.aiInsights.set('trendConfidenceScore', insights.trendConfidenceScore || 50);
        this.aiInsights.set('aiModelVersion', insights.aiModelVersion || 'v1.0');
        this.aiInsights.set('explanation', insights.explanation || 'No explanation available');
      } else {
        console.warn('AIAnalytics returned unexpected or empty results:', insights);
      }
    } catch (error) {
      console.error('AI or Blockchain process failed:', error);
    }
  }
  next();
});

const MarketAccess = mongoose.model('MarketAccess', MarketAccessSchema);
const Market = mongoose.model('Market', MarketSchema);

module.exports = { Market, MarketAccess };
