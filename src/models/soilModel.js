const mongoose = require('mongoose');

const SoilSchema = new mongoose.Schema({
  location: { 
    type: String, 
    required: true 
  },
  moistureLevel: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  }, // Percentage
  salinity: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 500 
  }, // mg/L
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  soilType: { 
    type: String, 
    enum: ['sandy', 'loamy', 'clay', 'peat', 'saline'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['valid', 'faulty', 'pending'], 
    default: 'valid' 
  }
}, { timestamps: true });

// Indexing for improved performance
SoilSchema.index({ location: 1 });
SoilSchema.index({ timestamp: 1 });

// Optionally, if geospatial support is needed
// SoilSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Soil', SoilSchema);
