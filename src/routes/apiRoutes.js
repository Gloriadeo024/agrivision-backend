// routes/apiRoutes.js - Advanced AI-powered AgriVision API Routes with Meta-Learning & Evolutionary Algorithms

const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const templateController = require('../controllers/templateController');
const categoryController = require('../controllers/categoryController');
const tagController = require('../controllers/tagController');
const sensorController = require('../controllers/sensorController');
const soilController = require('../controllers/soilController');
const adminController = require('../controllers/adminController');
const aiController = require('../controllers/aiController');
const realTimeController = require('../controllers/realTimeController');
const droneController = require('../controllers/droneController');

// Versioning prefix
const apiVersion = '/api/v1';

// Authentication & User Routes
router.post(`${apiVersion}/auth/register`, authController.register);
router.post(`${apiVersion}/auth/login`, authController.login);
router.get(`${apiVersion}/auth/logout`, authController.logout);
router.get(`${apiVersion}/auth/profile`, authController.getProfile);
router.put(`${apiVersion}/auth/profile`, authController.updateProfile);

// Template Routes
router.post(`${apiVersion}/templates`, templateController.createTemplate);
router.get(`${apiVersion}/templates`, templateController.getTemplatesPaginated);
router.get(`${apiVersion}/templates/search`, templateController.searchTemplates);
router.get(`${apiVersion}/templates/recommendations`, aiController.recommendTemplates);
router.get(`${apiVersion}/templates/:id`, templateController.getTemplateById);
router.put(`${apiVersion}/templates/:id`, templateController.updateTemplate);
router.patch(`${apiVersion}/templates/:id/softdelete`, templateController.softDeleteTemplate);
router.delete(`${apiVersion}/templates/:id`, templateController.deleteTemplate);

// Category Routes
router.post(`${apiVersion}/categories`, categoryController.createCategory);
router.get(`${apiVersion}/categories`, categoryController.getCategoriesPaginated);
router.get(`${apiVersion}/categories/search`, categoryController.searchCategories);
router.get(`${apiVersion}/categories/ai-insights`, aiController.analyzeCategoryTrends);
router.get(`${apiVersion}/categories/:id`, categoryController.getCategoryById);
router.put(`${apiVersion}/categories/:id`, categoryController.updateCategory);
router.patch(`${apiVersion}/categories/:id/softdelete`, categoryController.softDeleteCategory);

// Tag Routes
router.post(`${apiVersion}/tags`, tagController.createTag);
router.get(`${apiVersion}/tags`, tagController.getTagsPaginated);
router.get(`${apiVersion}/tags/search`, tagController.searchTags);
router.get(`${apiVersion}/tags/ai-optimization`, aiController.optimizeTags);
router.get(`${apiVersion}/tags/:id`, tagController.getTagById);
router.put(`${apiVersion}/tags/:id`, tagController.updateTag);
router.patch(`${apiVersion}/tags/:id/softdelete`, tagController.softDeleteTag);

// Sensor Routes
router.post(`${apiVersion}/sensors`, sensorController.createSensor);
router.get(`${apiVersion}/sensors`, sensorController.getSensors);
router.get(`${apiVersion}/sensors/:id`, sensorController.getSensorById);
router.put(`${apiVersion}/sensors/:id`, sensorController.updateSensor);
router.delete(`${apiVersion}/sensors/:id`, sensorController.deleteSensor);
router.get(`${apiVersion}/sensors/monitor`, realTimeController.monitorSensors);
router.get(`${apiVersion}/sensors/ai-insights`, aiController.analyzeSensorData);
router.get(`${apiVersion}/sensors/ai-diagnostics`, aiController.diagnoseSensorIssues);
router.get(`${apiVersion}/sensors/ai-multi-factor-risk`, aiController.multiFactorRiskAnalysis);
router.get(`${apiVersion}/sensors/ai-predictive-maintenance`, aiController.predictSensorMaintenance);
router.get(`${apiVersion}/sensors/ai-explainability`, aiController.explainSensorModels);
router.get(`${apiVersion}/sensors/ai-adaptive-learning`, aiController.adaptiveLearningModels);
router.get(`${apiVersion}/sensors/ai-reinforcement-learning`, aiController.reinforcementLearningModels);
router.get(`${apiVersion}/sensors/ai-meta-learning`, aiController.metaLearningModels);
router.get(`${apiVersion}/sensors/ai-evolutionary-algorithms`, aiController.evolutionaryAlgorithms);

// Soil Data Routes
router.post(`${apiVersion}/soil`, soilController.createSoilData);
router.get(`${apiVersion}/soil`, soilController.getSoilData);
router.get(`${apiVersion}/soil/:id`, soilController.getSoilDataById);
router.put(`${apiVersion}/soil/:id`, soilController.updateSoilData);
router.delete(`${apiVersion}/soil/:id`, soilController.deleteSoilData);
router.get(`${apiVersion}/soil/:id/ai-analysis`, aiController.analyzeSoilData);
router.get(`${apiVersion}/real-time/soil`, realTimeController.streamSoilData);
router.get(`${apiVersion}/soil/ai-predictions`, aiController.predictSoilOutcomes);
router.get(`${apiVersion}/soil/ai-risk-assessment`, aiController.multiFactorRiskAssessment);
router.get(`${apiVersion}/soil/ai-anomaly-detection`, aiController.detectSoilAnomalies);
router.get(`${apiVersion}/soil/ai-geo-insights`, aiController.analyzeGeospatialData);
router.get(`${apiVersion}/soil/ai-model-explainability`, aiController.explainSoilModels);

// AI-Specific Routes
router.post(`${apiVersion}/ai/predict-crop-yield`, aiController.predictCropYield);
router.get(`${apiVersion}/ai/visualize-salinity`, aiController.visualizeSalinityTrends);
router.get(`${apiVersion}/ai/climate-impact`, aiController.analyzeClimateImpact);
router.get(`${apiVersion}/ai/smart-task-prioritization`, aiController.smartTaskPrioritization);
router.get(`${apiVersion}/ai/predictive-alerts`, aiController.getPredictiveAlerts);
router.get(`${apiVersion}/ai/custom-insights`, aiController.generateCustomAIInsights);
router.get(`${apiVersion}/ai/hyperparameter-optimization`, aiController.optimizeHyperparameters);
router.get(`${apiVersion}/ai/meta-learning`, aiController.metaLearningModels);
router.get(`${apiVersion}/ai/evolutionary-algorithms`, aiController.evolutionaryAlgorithms);

// Drone Routes
router.post(`${apiVersion}/drones/deploy`, droneController.deployDrone);
router.get(`${apiVersion}/drones/status`, droneController.getDroneStatus);
router.get(`${apiVersion}/drones/ai-insights`, aiController.analyzeDroneData);
router.get(`${apiVersion}/drones/geo-mapping`, aiController.droneGeoMapping);
router.get(`${apiVersion}/drones/swarm-intelligence`, aiController.droneSwarmIntelligence);

// Admin Routes
router.get(`${apiVersion}/admin/users`, adminController.getAllUsers);
router.get(`${apiVersion}/admin/stats`, adminController.getSystemStats);
router.post(`${apiVersion}/admin/refresh-ai-models`, adminController.refreshAIModels);
router.get(`${apiVersion}/admin/ai-logs`, adminController.getAIModelLogs);
router.post(`${apiVersion}/admin/train-ai-model`, adminController.trainAIModel);
router.post(`${apiVersion}/admin/custom-ai-training`, adminController.customAITraining);

module.exports = router;
