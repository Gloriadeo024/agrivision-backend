// routes/Admin.js - AI-Enhanced Admin Routes for AgriVision with Model Comparisons, Predictive Alerts, Explainability & Advanced AI Insights

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin-specific versioning
const apiVersion = '/api/v1/admin';

// User Management Routes
router.get(`${apiVersion}/users`, adminController.getAllUsers);
router.get(`${apiVersion}/users/:id`, adminController.getUserById);
router.put(`${apiVersion}/users/:id`, adminController.updateUser);
router.delete(`${apiVersion}/users/:id`, adminController.deleteUser);
router.post(`${apiVersion}/users/assign-role`, adminController.assignUserRole);

// System Stats & Monitoring
router.get(`${apiVersion}/stats`, adminController.getSystemStats);
router.get(`${apiVersion}/logs`, adminController.getSystemLogs);
router.get(`${apiVersion}/ai-logs`, adminController.getAIModelLogs);
router.get(`${apiVersion}/performance-metrics`, adminController.getPerformanceMetrics);

// AI Model Management
router.post(`${apiVersion}/refresh-ai-models`, adminController.refreshAIModels);
router.post(`${apiVersion}/train-ai-model`, adminController.trainAIModel);
router.post(`${apiVersion}/custom-ai-training`, adminController.customAITraining);
router.get(`${apiVersion}/ai-models`, adminController.listAIModels);
router.get(`${apiVersion}/ai-models/:id`, adminController.getAIModelById);
router.patch(`${apiVersion}/ai-models/:id/optimize`, adminController.optimizeAIModel);
router.delete(`${apiVersion}/ai-models/:id`, adminController.deleteAIModel);

// Advanced AI Configurations
router.post(`${apiVersion}/hyperparameter-optimization`, adminController.optimizeHyperparameters);
router.post(`${apiVersion}/meta-learning`, adminController.triggerMetaLearning);
router.post(`${apiVersion}/evolutionary-algorithms`, adminController.runEvolutionaryAlgorithms);
router.post(`${apiVersion}/adaptive-learning`, adminController.configureAdaptiveLearning);
router.post(`${apiVersion}/adversarial-training`, adminController.runAdversarialTraining);
router.post(`${apiVersion}/federated-learning`, adminController.configureFederatedLearning);
router.post(`${apiVersion}/reinforcement-learning`, adminController.runReinforcementLearning);
router.post(`${apiVersion}/neural-architecture-search`, adminController.runNeuralArchitectureSearch);
router.post(`${apiVersion}/meta-learning-optimization`, adminController.optimizeMetaLearning);
router.post(`${apiVersion}/ensemble-learning`, adminController.configureEnsembleLearning);

// Model Performance & Comparisons
router.get(`${apiVersion}/ai-models/:id/performance`, adminController.getModelPerformance);
router.get(`${apiVersion}/ai-models/compare`, adminController.compareModelPerformances);
router.post(`${apiVersion}/ai-models/:id/test`, adminController.testModelAccuracy);
router.get(`${apiVersion}/ai-models/:id/hyperparameter-tuning`, adminController.getHyperparameterTuning);
router.get(`${apiVersion}/ai-models/:id/feature-importance`, adminController.getFeatureImportance);
router.get(`${apiVersion}/ai-models/:id/architecture-analysis`, adminController.analyzeModelArchitecture);
router.get(`${apiVersion}/ai-models/:id/model-interpretability`, adminController.getModelInterpretability);
router.get(`${apiVersion}/ai-models/:id/model-comparisons`, adminController.compareRealTimeModelPerformance);

// Predictive Alerts, Explainability & Advanced Insights
router.get(`${apiVersion}/predictive-alerts`, adminController.getPredictiveAlerts);
router.get(`${apiVersion}/predictive-alerts/severity`, adminController.getAlertSeverityLevels);
router.get(`${apiVersion}/ai-models/:id/explainability`, adminController.getModelExplainability);
router.post(`${apiVersion}/ai-models/:id/alert-config`, adminController.configureAlertThresholds);
router.post(`${apiVersion}/ai-models/:id/insight-report`, adminController.generateAIInsightReport);
router.get(`${apiVersion}/ai-models/:id/real-time-insights`, adminController.getRealTimeModelInsights);
router.get(`${apiVersion}/ai-models/:id/shap-values`, adminController.getSHAPValues);
router.get(`${apiVersion}/ai-models/:id/lime-explanations`, adminController.getLIMEExplanations);
router.get(`${apiVersion}/ai-models/:id/custom-analytics`, adminController.getCustomAIAnalytics);
router.get(`${apiVersion}/ai-models/:id/real-time-data-integration`, adminController.getRealTimeFarmData);

// Security & Access Controls
router.post(`${apiVersion}/rate-limiting`, adminController.configureRateLimiting);
router.post(`${apiVersion}/access-controls`, adminController.setAccessControls);
router.get(`${apiVersion}/audit-logs`, adminController.getAuditLogs);

module.exports = router;
