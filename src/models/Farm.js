// models/Farm.js - Farm Model for AgriVision System
const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, // Indexed for faster searches
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  location: {
    country: { type: String, required: true, index: true },
    region: { type: String, required: true },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true, index: '2dsphere' } // Geospatial index
    },
    geospatialAnalysis: { type: Boolean, default: true } // Advanced GIS support
  },
  sizeInHectares: { type: Number, required: true },
  soilType: { type: String, required: true },
  climateZone: { type: String, required: true },
  irrigationType: { type: String, enum: ['drip', 'sprinkler', 'flood', 'manual'], required: true },
  cropHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop', index: true }],
  currentCrops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop', index: true }],
  pestManagement: { type: mongoose.Schema.Types.ObjectId, ref: 'PestManagement' },
  equipmentUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  trainingParticipation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],
  certificationStatus: { type: Boolean, default: false }, // Organic, Fair Trade, etc.
  sustainabilityMetrics: {
    waterUsage: { type: Number, default: 0 }, // Liters per hectare
    carbonFootprint: { type: Number, default: 0 }, // kg CO2 per hectare
    biodiversityScore: { type: Number, default: 0 }, // Measures ecological health
    sustainabilityScore: { type: Number, default: 0 }, // Overall environmental impact rating
    soilHealthIndex: { type: Number, default: 0 }, // Evaluates long-term soil quality
    regenerativePracticesIndex: { type: Number, default: 0 }, // Measures impact of sustainable farming
    wasteManagementScore: { type: Number, default: 0 } // Tracks recycling and waste disposal efficiency
  },
  smartFarmingTech: {
    iotSensors: { type: Boolean, default: true },
    droneMonitoring: { type: Boolean, default: true },
    aiPredictiveAnalytics: { type: Boolean, default: true },
    resourceOptimization: { type: Boolean, default: true },
    automatedIrrigation: { type: Boolean, default: true },
    weatherForecastIntegration: { type: Boolean, default: true },
    remoteFarmControl: { type: Boolean, default: true },
    pestDetectionAI: { type: Boolean, default: true },
    automatedFertilization: { type: Boolean, default: true },
    diseaseOutbreakDetection: { type: Boolean, default: true },
    cropRotationAI: { type: Boolean, default: true },
    automatedYieldTracking: { type: Boolean, default: true },
    predictiveSoilDegradationAlerts: { type: Boolean, default: true },
    automatedWeedDetection: { type: Boolean, default: true },
    AIIntegratedClimateResilience: { type: Boolean, default: true },
    smartGreenhouseControl: { type: Boolean, default: true }, // AI-driven greenhouse climate control
    AIEnhancedPestResistance: { type: Boolean, default: true }, // Tracks evolving pest resistance patterns
    machineLearningPestPrediction: { type: Boolean, default: true }, // Added advanced AI pest prediction
    AIYieldOptimization: { type: Boolean, default: true }, // Added advanced AI yield optimization
    AIWeedDetection: { type: Boolean, default: true } // Added AI-powered weed detection
  },
  riskAssessment: {
    floodRisk: { type: Number, default: 0 },
    droughtRisk: { type: Number, default: 0 },
    pestOutbreakRisk: { type: Number, default: 0 },
    soilErosionRisk: { type: Number, default: 0 },
    wildfireRisk: { type: Number, default: 0 } // New risk metric
  },
  blockchainTraceability: { type: Boolean, default: true },
  landOwnershipVerification: { type: Boolean, default: true },
  marketLinkage: { type: Boolean, default: true },
  complianceMonitoring: { type: Boolean, default: true },
  financialAssistanceEligibility: { type: Boolean, default: true },
  smartWeatherAlerts: { type: Boolean, default: true },
  automatedRecordKeeping: { type: Boolean, default: true },
  farmHealthIndex: { type: Number, default: 0 },
  regenerativeAgricultureSupport: { type: Boolean, default: true },
  AIpoweredMarketAnalysis: { type: Boolean, default: true },
  realTimeCollaboration: { type: Boolean, default: true },
  livestockManagement: { type: Boolean, default: true },
  sustainabilityCertificationTracking: { type: Boolean, default: true },
  profitabilityIndex: { type: Number, default: 0 },
  AIEnhancedYieldPrediction: { type: Boolean, default: true },
  multiFarmManagement: { type: Boolean, default: true },
  dynamicPricingAI: { type: Boolean, default: true },
  soilMicrobiomeTracking: { type: Boolean, default: true },
  regenerativeSoilManagement: { type: Boolean, default: true },
  AIEnhancedSupplyChainOptimization: { type: Boolean, default: true },
  databaseOptimization: {
    indexedFields: ['name', 'owner', 'location.country', 'cropHistory', 'currentCrops'],
    queryPerformanceEnhancement: true,
    relationshipRefinements: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

FarmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farm', FarmSchema);
