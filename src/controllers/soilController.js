// backend/src/controllers/soilController.js
// AI-driven soil analysis, real-time monitoring, predictive health tracking,
// automated irrigation triggers, optimized fertilizer application, and weed control impact modeling

const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const aiSoilAnalyzer = require('./utils/aiSoilAnalyzer');
const irrigationController = require('./utils/irrigationController');
const nutrientRecommender = require('./utils/nutrientRecommender');
const realTimeSoilMonitor = require('./utils/realTimeSoilMonitor');
const aiIrrigationOptimizer = require('./utils/aiIrrigationOptimizer');
const climateImpactModel = require('./utils/climateImpactModel');
const fertilizerOptimizer = require('./utils/fertilizerOptimizer');
const weedControlModel = require('./utils/weedControlModel');

exports.analyzeSoil = async (req, res) => {
  try {
    const { farmId, soilSampleId } = req.body;
    const analysis = await aiSoilAnalyzer.analyze(farmId, soilSampleId);
    const climateImpact = await climateImpactModel.assess(analysis);
    logEvent('Soil Analysis Completed', { farmId, soilSampleId, analysis, climateImpact });
    auditTrail.record('Soil Analysis', farmId);
    res.status(200).json({ message: 'Soil analysis successful', analysis, climateImpact });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSoilHealth = async (req, res) => {
  try {
    const { farmId } = req.params;
    const soilHealth = await realTimeSoilMonitor.track(farmId);
    res.status(200).json({ message: 'Real-time soil health data', soilHealth });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.triggerIrrigation = async (req, res) => {
  try {
    const { farmId, soilMoistureLevel } = req.body;
    const optimizedSchedule = await aiIrrigationOptimizer.optimize(farmId, soilMoistureLevel);
    const irrigationStatus = await irrigationController.trigger(farmId, optimizedSchedule);
    logEvent('Irrigation Triggered', { farmId, soilMoistureLevel, optimizedSchedule, irrigationStatus });
    res.status(200).json({ message: 'Irrigation triggered successfully with AI optimization', irrigationStatus });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.recommendNutrients = async (req, res) => {
  try {
    const { farmId, soilData } = req.body;
    const recommendations = await nutrientRecommender.recommend(farmId, soilData);
    const fertilizerPlan = await fertilizerOptimizer.optimize(farmId, soilData);
    logEvent('Nutrient and Fertilizer Recommendations Provided', { farmId, recommendations, fertilizerPlan });
    res.status(200).json({ message: 'Nutrient and fertilizer recommendations successful', recommendations, fertilizerPlan });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.controlWeeds = async (req, res) => {
  try {
    const { farmId, weedData } = req.body;
    const weedControlPlan = await weedControlModel.control(farmId, weedData);
    logEvent('Weed Control Plan Generated', { farmId, weedControlPlan });
    res.status(200).json({ message: 'Weed control plan generated successfully', weedControlPlan });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};
