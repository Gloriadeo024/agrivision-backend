// validations.js — Input validation for AgriVision's GraphQL queries and mutations

const Joi = require('joi');

// Refined Crop categories
const saltTolerantCrops = ['barley', 'sorghum', 'beetroot', 'quinoa', 'spinach', 'kale'];
const droughtResistantCrops = ['millet', 'cassava', 'pigeon pea', 'chickpea', 'sweet potato', 'cowpea'];
const highYieldCrops = ['corn', 'rice', 'wheat', 'potato', 'soybean', 'sugarcane'];
const organicCrops = [
  'carrots', 'spinach', 'lettuce', 'broccoli', 
  'cabbage', 'kale', 'tomatoes', 'cucumbers',
  'strawberries', 'blueberries', 'apples', 'pears',
  'potatoes', 'onions', 'garlic', 'peas',
  'bell peppers', 'zucchini', 'beets', 'radishes',
  'avocados', 'grapes', 'lemons', 'oranges'
];

// Validation schemas
const farmSchema = Joi.object({
  name: Joi.string().min(3).required(),
  location: Joi.string().required(),
  size: Joi.number().positive().required(),
  cropType: Joi.string().valid('salt-tolerant', 'drought-resistant', 'high-yield', 'organic').required(),
  specificCrop: Joi.string().when('cropType', {
    switch: [
      { is: 'salt-tolerant', then: Joi.string().valid(...saltTolerantCrops) },
      { is: 'drought-resistant', then: Joi.string().valid(...droughtResistantCrops) },
      { is: 'high-yield', then: Joi.string().valid(...highYieldCrops) },
      { is: 'organic', then: Joi.string().valid(...organicCrops) }
    ],
    otherwise: Joi.forbidden()
  }).required(),
  ownerId: Joi.string().required()
});

const aiModelInputSchema = Joi.object({
  modelName: Joi.string().valid('salinityPredictor', 'yieldForecaster', 'climateAnalyzer', 'pestDetector', 'waterOptimizer').required(),
  soilData: Joi.array().items(Joi.number().min(0).max(100)).min(1).required(), // Salinity levels between 0-100
  climateData: Joi.array().items(Joi.number().min(-50).max(60)).min(1).required(), // Temperature range: -50 to 60°C
  cropType: Joi.string().required(),
  pestData: Joi.array().items(Joi.number().min(0).max(100)).optional(), // Pest severity levels 0-100
  waterUsageData: Joi.array().items(Joi.number().min(0).max(1000)).optional(), // Water usage in liters (0-1000 L)
  hyperparameters: Joi.object({
    learningRate: Joi.number().min(0).max(1).required(),
    epochs: Joi.number().integer().positive().required(),
    batchSize: Joi.number().integer().positive().required(),
    dropoutRate: Joi.number().min(0).max(1).optional(), // For regularization
    momentum: Joi.number().min(0).max(1).optional() // For optimization algorithms
  }).required()
});

// Conditional validation for AI model configurations
const validateAIModelConfig = Joi.object({
  modelName: Joi.string().required(),
  hyperparameters: Joi.object().when('modelName', {
    switch: [
      { is: 'salinityPredictor', then: Joi.object({ learningRate: Joi.number().max(0.01), dropoutRate: Joi.number().max(0.3) }) },
      { is: 'yieldForecaster', then: Joi.object({ learningRate: Joi.number().max(0.05), momentum: Joi.number().max(0.9) }) },
      { is: 'climateAnalyzer', then: Joi.object({ learningRate: Joi.number().max(0.1), epochs: Joi.number().max(500) }) },
      { is: 'pestDetector', then: Joi.object({ learningRate: Joi.number().max(0.02), batchSize: Joi.number().max(256) }) },
      { is: 'waterOptimizer', then: Joi.object({ learningRate: Joi.number().max(0.03), epochs: Joi.number().max(300) }) }
    ],
    otherwise: Joi.forbidden()
  })
});

// Correlation checks for AI model inputs
function validateSoilClimateCorrelation(soilData, climateData) {
  const maxSoilSalinity = Math.max(...soilData);
  const minClimateTemp = Math.min(...climateData);

  if (maxSoilSalinity > 80 && minClimateTemp > 40) {
    throw new Error('🚨 High soil salinity combined with extreme heat detected — Critical agricultural stress!');
  }

  if (maxSoilSalinity > 50 && minClimateTemp < 10) {
    throw new Error('⚠️ Elevated soil salinity with low temperatures — Potential crop stunting risk!');
  }

  return true;
}

// Advanced AI-based input correlation
function validateCropClimateCorrelation(cropType, climateData) {
  const avgTemp = climateData.reduce((sum, temp) => sum + temp, 0) / climateData.length;
  
  if (cropType === 'salt-tolerant' && avgTemp < 5) {
    throw new Error('⚠️ Salt-tolerant crops may struggle in extremely cold climates.');
  }

  if (cropType === 'drought-resistant' && avgTemp > 45) {
    throw new Error('🔥 Drought-resistant crops may wilt under extreme heat.');
  }

  return true;
}

// Real-time AI Hooks for predictive adjustments
function realTimeAIAdjustments(modelName, inputData) {
  console.log(`🔍 Running real-time AI adjustments for ${modelName}...`);

  if (modelName === 'salinityPredictor' && inputData.soilData.some(val => val > 85)) {
    console.warn('⚡ Immediate action: AI suggests emergency soil treatment!');
  }

  if (modelName === 'climateAnalyzer' && inputData.climateData.some(temp => temp > 50)) {
    console.warn('🌡️ AI alert: Extreme heat forecast — Consider heat-resistant crops.');
  }

  return true;
}

module.exports = { farmSchema, aiModelInputSchema, validateAIModelConfig, validateSoilClimateCorrelation, validateCropClimateCorrelation, validateInput, realTimeAIAdjustments, saltTolerantCrops, droughtResistantCrops, highYieldCrops, organicCrops };
