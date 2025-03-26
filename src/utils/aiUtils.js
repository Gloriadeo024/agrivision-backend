// backend/src/utils/aiUtils.js
const tf = require('@tensorflow/tfjs');
const logger = require('./logger');

const aiUtils = {
  loadModel: async (modelPath) => {
    try {
      logger.info(`Loading AI model from: ${modelPath}`);
      const model = await tf.loadLayersModel(modelPath);
      logger.info('Model loaded successfully');
      return model;
    } catch (error) {
      logger.error(`Failed to load model: ${error.message}`);
      throw new Error('Model loading failed');
    }
  },

  predict: (model, input) => {
    try {
      logger.info('Running AI prediction');
      const tensor = tf.tensor(input);
      const prediction = model.predict(tensor).dataSync();
      logger.info('Prediction completed', { prediction });
      return prediction;
    } catch (error) {
      logger.error(`Prediction error: ${error.message}`);
      throw new Error('AI prediction failed');
    }
  },

  evaluateModel: (model, testData, testLabels) => {
    try {
      logger.info('Evaluating AI model');
      const evaluation = model.evaluate(tf.tensor(testData), tf.tensor(testLabels));
      logger.info('Model evaluation completed', { evaluation });
      return evaluation;
    } catch (error) {
      logger.error(`Model evaluation error: ${error.message}`);
      throw new Error('Model evaluation failed');
    }
  }
};

module.exports = aiUtils;
