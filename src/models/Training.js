// models/Training.js - Training Model for AgriVision System
const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['crop_management', 'soil_health', 'pest_control', 'market_access', 'other'], required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleDate: { type: Date, required: true },
  duration: { type: String },
  location: { type: String },
  resources: [{ type: String }],
  multimedia: [{ type: String }], // Supports video, audio, and documents
  progressTracking: { type: Boolean, default: true }, // Enhanced progress tracking
  certification: { type: Boolean, default: false },
  aiRecommendations: { type: Boolean, default: false },
  liveWebinar: { type: Boolean, default: false },
  participantLimit: { type: Number, default: 100 }, // Customizable participant limits
  feedbackEnabled: { type: Boolean, default: true }, // Enables feedback collection
  interactiveExercises: { type: Boolean, default: false }, // Interactive training materials
  quizAssessment: { type: Boolean, default: false }, // Quiz-based assessments
  offlineMode: { type: Boolean, default: false }, // Offline mode support
  trainingMode: { type: String, enum: ['instructor_led', 'self_paced'], default: 'self_paced' }, // Instructor-led & Self-paced modes
  languagesSupported: [{ type: String, default: ['English'] }], // Multi-language support
  accessibilityFeatures: { type: Boolean, default: true }, // Enhanced accessibility features
  dynamicContentUpdates: { type: Boolean, default: true }, // Automated content updates
  peerDiscussionForum: { type: Boolean, default: false }, // Community discussion support
  gamification: { type: Boolean, default: false }, // Gamification elements for engagement
  aiAdaptiveLearning: { type: Boolean, default: false }, // AI-driven personalized learning paths
  certificationValidation: { type: Boolean, default: false }, // Certification authentication and validation
  instructorChatSupport: { type: Boolean, default: false }, // Live chat support with trainers
  realTimeProgressSync: { type: Boolean, default: true }, // Syncs user progress across devices
  aiPerformanceAnalytics: { type: Boolean, default: false }, // AI-powered performance tracking
  smartContentRecommendations: { type: Boolean, default: false }, // AI-driven content suggestions
  voiceAssistanceSupport: { type: Boolean, default: false }, // Voice command accessibility
  blockchainCredentialing: { type: Boolean, default: false }, // Secure blockchain-based certification
  customizableLearningPaths: { type: Boolean, default: false }, // Tailored learning experiences
  realTimeCollaborationTools: { type: Boolean, default: false }, // Tools for collaborative learning
  augmentedRealityTraining: { type: Boolean, default: false }, // AR-based interactive training
  adaptiveQuizzing: { type: Boolean, default: false }, // AI-driven dynamic assessments
  aiMentorSupport: { type: Boolean, default: false }, // AI-powered virtual mentorship
  dataDrivenInsights: { type: Boolean, default: false }, // Analytics-based learning insights
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Training', TrainingSchema);
