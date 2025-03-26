// models/PestManagement.js - Pest Management Model for AgriVision System
const mongoose = require('mongoose');

const PestManagementSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  pestType: { type: String, required: true },
  severity: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  treatmentMethods: [{ type: String }],
  detectionDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  notes: { type: String },
  geolocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  imageUrl: { type: String }, // For image uploads
  aiPrediction: { type: String }, // AI-based pest prediction
  sensorData: {
    pestActivity: { type: Boolean, default: false },
    temperature: { type: Number },
    humidity: { type: Number },
    soilMoisture: { type: Number },
    lightIntensity: { type: Number },
    windSpeed: { type: Number }, // Added wind speed for better pest analysis
    rainfall: { type: Number }, // Added rainfall data for environmental impact
    soilNutrients: { type: Number }, // Added soil nutrient levels for enhanced analysis
    uvIndex: { type: Number }, // UV index impact on pest activity
    airQuality: { type: Number } // Added air quality index for environmental assessment
  },
  automatedTreatment: { type: String }, // AI-suggested treatment
  notifications: {
    alertSent: { type: Boolean, default: false },
    alertDate: { type: Date }
  },
  historicalData: [{
    detectionDate: { type: Date },
    severity: { type: String },
    treatmentUsed: { type: String },
    effectiveness: { type: String } // Logs effectiveness of past treatments
  }],
  recommendedPrevention: { type: String }, // AI-based preventive suggestions
  pestResistantCrops: [{ type: String }], // Suggested pest-resistant crops
  integratedPestManagementPlan: { type: String }, // AI-driven pest management strategy
  cropRotationSuggestion: { type: String }, // AI-based crop rotation suggestion for pest control
  pesticideResidueAnalysis: { type: Boolean, default: false }, // Tracks pesticide residue levels
  realTimeAlerts: { type: Boolean, default: true }, // Triggers real-time alerts for severe outbreaks
  earlyWarningSystem: { type: Boolean, default: true }, // AI-based predictive warning system
  biologicalControlSuggestions: [{ type: String }], // Suggests natural predators for pest control
  ecoFriendlyPesticides: [{ type: String }], // Recommends sustainable pesticide options
  pestHotspotMapping: { type: Boolean, default: true }, // Identifies recurring outbreak zones
  AISeverityPrediction: { type: String }, // Predicts severity based on environmental and historical data
  automaticPestControl: { type: Boolean, default: false }, // Enables automated pest control actions
  dataIntegrationWithWeatherAPI: { type: Boolean, default: true }, // Integrates weather data for accurate pest prediction
  blockchainTraceability: { type: Boolean, default: true }, // Ensures transparency in pest control measures
  droneSurveillance: { type: Boolean, default: true }, // Uses drones for real-time pest monitoring
  smartTrapIntegration: { type: Boolean, default: true }, // Connects IoT smart traps for automated detection
  communityPestReporting: { type: Boolean, default: true }, // Allows farmers to report pest outbreaks collaboratively
  AIpoweredRiskAssessment: { type: Boolean, default: true }, // AI evaluates risk levels dynamically
  adaptivePestManagement: { type: Boolean, default: true }, // Adapts strategies based on evolving data
  cloudBasedDataStorage: { type: Boolean, default: true }, // Ensures secure and accessible data storage
  automatedPesticideApplication: { type: Boolean, default: true }, // Enables AI-driven automated pesticide application
  pestDNAAnalysis: { type: Boolean, default: false }, // Advanced pest identification through genetic analysis
  realTimePestInfestationHeatmaps: { type: Boolean, default: true }, // Generates real-time maps of infestation severity
  AIOptimizedPesticideUsage: { type: Boolean, default: true }, // AI-driven optimal pesticide recommendations
  autonomousDroneSpraying: { type: Boolean, default: true }, // Automated drone spraying for pest control
  AIAnomalyDetection: { type: Boolean, default: true }, // AI-powered anomaly detection for pest patterns
  pestMigrationForecast: { type: Boolean, default: true }, // Predicts pest migration patterns
  AIEnhancedDataVisualization: { type: Boolean, default: true }, // AI-driven visualization for better insights
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PestManagement', PestManagementSchema);
