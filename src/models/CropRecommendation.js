// models/CropRecommendation.js - AI-powered Crop Recommendation Model for AgriVision System
const mongoose = require('mongoose');
const axios = require('axios');

const CropRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  soilType: { type: String, required: true },
  soilPH: { type: Number, min: 0, max: 14, required: true },
  nutrientLevels: {
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    organicMatter: { type: Number, default: 0 },
    salinity: { type: Number, default: 0 }
  },
  soilHealthScore: { type: Number, min: 0, max: 100, default: 50 },
  weatherConditions: { type: String, required: true },
  temperature: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, default: 0 },
  pastCropHistory: { type: [String], default: [] },
  pestHistory: { type: [String], default: [] },
  diseaseHistory: { type: [String], default: [] },
  recommendedCrops: { type: [String], default: [] },
  aiConfidenceScore: { type: Number, min: 0, max: 100, required: true },
  irrigationSuitability: { type: String, enum: ['Drip', 'Sprinkler', 'Flood', 'None'], default: 'None' },
  fertilizerRecommendations: {
    type: { type: String, default: 'General' },
    quantity: { type: Number, default: 0 },
    applicationMethod: { type: String, default: 'Broadcast' }
  },
  adaptiveFertilization: { type: Boolean, default: false },
  seasonalSuitability: { type: Boolean, default: true },
  aiModelVersion: { type: String, default: '1.0' },
  historicalYieldData: { type: [Number], default: [] },
  additionalNotes: { type: String },
  cropRotationSuggestions: { type: [String], default: [] },
  soilMoistureLevel: { type: Number, default: 0 },
  satelliteImageryAnalysis: { type: String, default: 'Pending' },
  blockchainVerification: { type: Boolean, default: false },
  yieldForecasting: { type: Number, default: 0 },
  pestOutbreakRisk: { type: Number, min: 0, max: 100, default: 0 },
  climateResilienceScore: { type: Number, min: 0, max: 100, default: 50 },
  realTimeSensorData: {
    temperature: { type: Number, default: null },
    humidity: { type: Number, default: null },
    soilMoisture: { type: Number, default: null },
    nutrientLevels: {
      nitrogen: { type: Number, default: null },
      phosphorus: { type: Number, default: null },
      potassium: { type: Number, default: null }
    }
  },
  pestResistanceScore: { type: Number, min: 0, max: 100, default: 50 },
  waterUsageEfficiency: { type: Number, min: 0, max: 100, default: 50 },
  sustainabilityIndex: { type: Number, min: 0, max: 100, default: 50 },
  machineLearningVersion: { type: String, default: '2.0' },
  weatherAPIData: { type: Object, default: {} },
  droneImageryAnalysis: { type: String, default: 'Pending' },
  automatedFertilizerAdjustment: { type: Boolean, default: false },
  smartIrrigationControl: { type: Boolean, default: false },
  carbonFootprintScore: { type: Number, min: 0, max: 100, default: 50 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CropRecommendationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Fetch real-time weather data from external API
CropRecommendationSchema.methods.fetchWeatherData = async function () {
  try {
    const response = await axios.get(`https://api.weather.com/v3/wx/conditions/current?geocode=${this.latitude},${this.longitude}&format=json&apiKey=YOUR_API_KEY`);
    this.weatherAPIData = response.data;
    return this.save();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Method to update recommendations
CropRecommendationSchema.methods.updateRecommendations = function (newCrops, confidenceScore) {
  this.recommendedCrops = newCrops;
  this.aiConfidenceScore = confidenceScore;
  return this.save();
};

// Method to analyze soil health
CropRecommendationSchema.methods.calculateSoilHealth = function () {
  const { nitrogen, phosphorus, potassium, organicMatter, salinity } = this.nutrientLevels;
  this.soilHealthScore = ((nitrogen + phosphorus + potassium + organicMatter) / 4) - salinity;
  return this.save();
};

module.exports = mongoose.model('CropRecommendation', CropRecommendationSchema);
