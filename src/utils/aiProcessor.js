// backend/src/utils/aiprocessor.js
const aiUtils = require('./aiUtils');
const logger = require('./logger');

const aiProcessor = {
  processRiskAssessment: async (modelPath, input) => {
    try {
      const model = await aiUtils.loadModel(modelPath);
      const prediction = aiUtils.predict(model, input);
      logger.info('AI risk assessment completed', { input, prediction });
      return prediction;
    } catch (err) {
      logger.error('AI processing failed: ' + err.message);
      throw new Error('AI processing error');
    }
  },

  refineModel: (model, trainingData, epochs = 10) => {
    try {
      const tensorData = trainingData.map((data) => tf.tensor(data.input));
      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
      model.fit(tensorData, tf.tensor(trainingData.map((data) => data.output)), { epochs });
      logger.info('Model refined successfully');
    } catch (err) {
      logger.error('Model refinement failed: ' + err.message);
      throw new Error('Model refinement error');
    }
  },
};

module.exports = aiProcessor;
