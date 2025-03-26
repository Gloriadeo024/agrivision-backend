// loaders.js — Implements DataLoader to batch and cache GraphQL requests, optimizing AI model data fetching with AI-driven insights

const DataLoader = require('dataloader');
const db = require('../config/db');

// Batch function to load farms by IDs
const batchFarms = async (ids) => {
  try {
    const farms = await db('farms').whereIn('id', ids);
    const farmMap = farms.reduce((map, farm) => {
      map[farm.id] = farm;
      return map;
    }, {});

    // AI hook: Log if any critical farm conditions are detected
    farms.forEach((farm) => {
      if (farm.soilSalinity > 75 || farm.temperature > 45 || farm.waterUsage < 30) {
        console.warn(`🚨 AI Alert: Critical conditions detected for farm ${farm.id}`);
      }
    });

    return ids.map((id) => farmMap[id] || null);
  } catch (error) {
    console.error('Error loading farms:', error);
    return ids.map(() => null);
  }
};

// Batch function for AI model results
const batchModelResults = async (modelNames) => {
  try {
    const models = await db('ai_models').whereIn('modelName', modelNames);
    const modelMap = models.reduce((map, model) => {
      map[model.modelName] = model;
      return map;
    }, {});

    // AI hook: Monitor AI model confidence scores
    models.forEach((model) => {
      if (model.confidenceScore < 0.7) {
        console.warn(`⚠️ AI Model Warning: Low confidence score for model ${model.modelName}`);
      }
    });

    return modelNames.map((name) => modelMap[name] || null);
  } catch (error) {
    console.error('Error loading AI model results:', error);
    return modelNames.map(() => null);
  }
};

module.exports = {
  farmLoader: new DataLoader(batchFarms, { cache: true, maxBatchSize: 50, batchScheduleFn: (callback) => setTimeout(callback, 50) }),
  modelResultLoader: new DataLoader(batchModelResults, { cache: true, maxBatchSize: 50, batchScheduleFn: (callback) => setTimeout(callback, 50) }),
};
