// backend/src/controllers/irrigationController.js
// Handles irrigation system control, monitoring, AI-based predictions, and advanced automation
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const scheduleIrrigation = require('./utils/scheduleIrrigation');
const aiIrrigationPredictor = require('./utils/aiIrrigationPredictor');
const realTimeMonitor = require('./utils/realTimeMonitor');
const emergencyShutoff = require('./utils/emergencyShutoff');
const historicalAnalysis = require('./utils/historicalAnalysis');
const waterUsageEstimator = require('./utils/waterUsageEstimator');

exports.startIrrigation = async (req, res) => {
  try {
    const { farmId, duration, method, scheduleTime } = req.body;

    // AI-based predictions for smart irrigation adjustments
    const aiPrediction = await aiIrrigationPredictor.predict(farmId);
    const adjustedDuration = aiPrediction ? aiPrediction.adjustedDuration : duration;
    const waterUsage = await waterUsageEstimator.estimate(farmId, adjustedDuration);

    // Scheduling logic with AI optimization
    if (scheduleTime) {
      await scheduleIrrigation(farmId, adjustedDuration, method, scheduleTime);
      logEvent('Irrigation Scheduled', { farmId, adjustedDuration, method, scheduleTime, waterUsage });
      auditTrail.record('Irrigation Scheduled', farmId);
      return res.status(200).json({ message: 'Irrigation scheduled with AI optimization', adjustedDuration, scheduleTime, waterUsage });
    }

    // Real-time monitoring
    realTimeMonitor.start(farmId, adjustedDuration);

    logEvent('Irrigation Started', { farmId, adjustedDuration, method, waterUsage });
    auditTrail.record('Irrigation Started', farmId);
    res.status(200).json({ message: 'Irrigation started successfully', adjustedDuration, method, waterUsage });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.stopIrrigation = async (req, res) => {
  try {
    const { farmId } = req.body;
    // Logic to stop real-time monitoring and irrigation system
    realTimeMonitor.stop(farmId);
    emergencyShutoff.activate(farmId);
    logEvent('Irrigation Stopped', { farmId });
    auditTrail.record('Irrigation Stopped', farmId);
    res.status(200).json({ message: 'Irrigation stopped successfully' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getIrrigationHistory = async (req, res) => {
  try {
    const { farmId } = req.params;
    const history = await historicalAnalysis.getHistory(farmId);
    res.status(200).json({ message: 'Irrigation history retrieved successfully', history });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRealTimeStatus = async (req, res) => {
  try {
    const { farmId } = req.params;
    const status = await realTimeMonitor.getStatus(farmId);
    res.status(200).json({ message: 'Real-time irrigation status', status });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};
