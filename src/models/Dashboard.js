const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  metrics: {
    cropYield: {
      type: Number,
      min: [0, 'Crop yield cannot be negative'],
      required: [true, 'Crop yield is required']
    },
    soilHealth: {
      type: Number,
      min: [0, 'Soil health cannot be negative'],
      max: [100, 'Soil health cannot exceed 100'],
      required: [true, 'Soil health is required']
    },
    waterUsage: {
      type: Number,
      min: [0, 'Water usage cannot be negative'],
      required: [true, 'Water usage is required']
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// AI-Driven Hook for auto-updating timestamps and performing risk analysis
dashboardSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  // Placeholder for AI risk assessment (expand with AI logic)
  console.log('AI Risk Analysis: Running pre-save checks...');
  next();
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
