// backend/src/controllers/cropController.js
// Manages crop data, growth monitoring, AI-based yield predictions, and automated alerts
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const aiYieldPredictor = require('./utils/aiYieldPredictor');
const growthMonitor = require('./utils/growthMonitor');
const automatedAlerts = require('./utils/automatedAlerts');
const historicalCropData = require('./utils/historicalCropData');
const climateAdaptiveAI = require('./utils/climateAdaptiveAI');
const pestDetectionAI = require('./utils/pestDetectionAI');

exports.addCrop = async (req, res) => {
  try {
    const { farmId, cropName, plantingDate, estimatedHarvestDate, cropType } = req.body;
    const crop = await Crop.create({ farmId, cropName, plantingDate, estimatedHarvestDate, cropType });
    
    logEvent('Crop Added', { farmId, cropName, estimatedHarvestDate });
    auditTrail.record('Crop Added', farmId);
    res.status(201).json({ message: 'Crop added successfully', crop });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCrops = async (req, res) => {
  try {
    const { farmId } = req.params;
    const crops = await Crop.find({ farmId });
    res.status(200).json({ message: 'Crops retrieved successfully', crops });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.predictYield = async (req, res) => {
  try {
    const { farmId, cropId } = req.body;
    const prediction = await aiYieldPredictor.predict(farmId, cropId);
    logEvent('Yield Predicted', { farmId, cropId, prediction });
    res.status(200).json({ message: 'Yield prediction successful', prediction });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.monitorGrowth = async (req, res) => {
  try {
    const { farmId, cropId } = req.params;
    const growthData = await growthMonitor.track(farmId, cropId);
    res.status(200).json({ message: 'Crop growth monitored', growthData });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getHistoricalData = async (req, res) => {
  try {
    const { farmId, cropId } = req.params;
    const history = await historicalCropData.get(farmId, cropId);
    res.status(200).json({ message: 'Crop history retrieved', history });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.setAutomatedAlerts = async (req, res) => {
  try {
    const { farmId, cropId, alertType, threshold } = req.body;
    await automatedAlerts.configure(farmId, cropId, alertType, threshold);
    logEvent('Automated Alert Set', { farmId, cropId, alertType, threshold });
    res.status(200).json({ message: 'Automated alerts configured successfully' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.climateAdaptivePrediction = async (req, res) => {
  try {
    const { farmId, cropId } = req.body;
    const adaptationData = await climateAdaptiveAI.analyze(farmId, cropId);
    logEvent('Climate Adaptation Predicted', { farmId, cropId, adaptationData });
    res.status(200).json({ message: 'Climate adaptation analysis successful', adaptationData });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.detectPests = async (req, res) => {
  try {
    const { farmId, cropId } = req.body;
    const pestRisk = await pestDetectionAI.detect(farmId, cropId);
    logEvent('Pest Risk Detected', { farmId, cropId, pestRisk });
    res.status(200).json({ message: 'Pest detection successful', pestRisk });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};
