const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true 
  },
  value: { 
    type: Number, 
    required: true, 
    validate: {
      validator: function(v) {
        if (this.type === 'temperature') {
          return v >= -50 && v <= 50; // Example: temperature range validation
        }
        if (this.type === 'moisture') {
          return v >= 0 && v <= 100; // Example: moisture range validation
        }
        return true;
      },
      message: props => `Invalid value for ${props.value}`
    }
  },
  unit: { 
    type: String, 
    required: true 
  },
  farm: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farm', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'error'], 
    default: 'active' 
  },
  manufacturer: { 
    type: String 
  },
  model: { 
    type: String 
  },
  calibrationData: { 
    type: String 
  }
}, { timestamps: true });

// Indexing for performance
SensorSchema.index({ farm: 1 });
SensorSchema.index({ createdAt: 1 });
SensorSchema.index({ type: 1 });

// Pre-save hook to perform data checks before saving
SensorSchema.pre('save', function(next) {
  if (this.type === 'temperature' && this.value < 0) {
    this.value = 0; // Fix negative temperature values if desired
  }
  next();
});

module.exports = mongoose.model('Sensor', SensorSchema);
