const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    maxlength: [100, 'Crop name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['cereal', 'fruit', 'vegetable', 'legume', 'root', 'other'],
    required: [true, 'Crop type is required']
  },
  plantedDate: {
    type: Date,
    required: [true, 'Planted date is required'],
    default: Date.now
  },
  expectedYield: {
    type: Number,
    min: [0, 'Expected yield cannot be negative'],
    required: [true, 'Expected yield is required']
  },
  currentYield: {
    type: Number,
    min: [0, 'Current yield cannot be negative'],
    default: 0
  },
  growthStage: {
    type: String,
    enum: ['seedling', 'vegetative', 'flowering', 'mature'],
    default: 'seedling'
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'stressed', 'diseased'],
    default: 'healthy'
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    required: [true, 'Location coordinates are required']
  },
  linkedDashboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard'
  },
  feedback: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  }]
}, { timestamps: true });

cropSchema.index({ location: '2dsphere' });

// AI-powered yield adjustment (placeholder, can link to AI model)
cropSchema.methods.calculateProjectedYield = function (adjustmentFactor) {
  this.expectedYield = this.expectedYield * adjustmentFactor;
  return this.expectedYield;
};

// AI-powered feedback sentiment analysis (placeholder)
cropSchema.methods.analyzeFeedbackSentiment = function (feedbackData) {
  // Placeholder for AI model integration
  const sentimentScore = feedbackData.length * 0.75; // Example logic
  return sentimentScore > 5 ? 'Positive' : 'Neutral';
};

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
