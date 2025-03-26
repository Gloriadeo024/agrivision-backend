// models/Equipment.js - Equipment Management Model for AgriVision System
const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['available', 'in use', 'under maintenance', 'retired'], default: 'available' },
  purchaseDate: { type: Date },
  lastMaintenance: { type: Date },
  nextMaintenance: { type: Date },
  condition: { type: String, enum: ['new', 'good', 'fair', 'poor', 'non-functional'], required: true },
  usageHours: { type: Number, default: 0 },
  fuelConsumption: { type: Number },
  carbonFootprint: { type: Number }, // Sustainability tracking
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  imageUrl: { type: String },
  AImaintenancePrediction: { type: Boolean, default: true }, // Predictive maintenance
  IoTIntegration: {
    realTimeUsage: { type: Boolean, default: true },
    performanceMetrics: { type: Boolean, default: true },
    fuelMonitoring: { type: Boolean, default: true },
    operationalHealth: { type: Boolean, default: true }, // Tracks real-time equipment health
    automatedAlerts: { type: Boolean, default: true }, // Sends alerts on potential failures
    usageOptimization: { type: Boolean, default: true } // AI-based efficiency improvements
  },
  rentalManagement: {
    availableForRent: { type: Boolean, default: false },
    rentalPrice: { type: Number },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rentalHistory: [{
      renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startDate: { type: Date },
      endDate: { type: Date },
      pricePaid: { type: Number }
    }],
    maintenanceCoverage: { type: Boolean, default: false } // Ensures renters have maintenance services
  },
  marketplaceListing: { type: Boolean, default: false }, // Equipment sharing feature
  remoteDiagnostics: { type: Boolean, default: true }, // AI-based troubleshooting
  energyEfficiency: { type: Number }, // Measures energy consumption efficiency
  warrantyExpiration: { type: Date }, // Tracks warranty details
  insuranceStatus: { type: String, enum: ['covered', 'expired', 'not covered'], default: 'not covered' },
  securityTracking: {
    gpsEnabled: { type: Boolean, default: true }, // GPS tracking for security
    antiTheftLock: { type: Boolean, default: false }, // Remote locking in case of unauthorized use
    geofencingAlerts: { type: Boolean, default: true } // Alerts when equipment moves beyond designated area
  },
  complianceMonitoring: { type: Boolean, default: true }, // Ensures regulatory compliance for heavy machinery
  automatedFleetManagement: { type: Boolean, default: true }, // AI-driven fleet scheduling and optimization
  predictiveFailureAnalysis: { type: Boolean, default: true }, // AI models predicting failures before they occur
  anomalyDetection: { type: Boolean, default: true }, // AI-driven anomaly detection for unexpected behavior
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
