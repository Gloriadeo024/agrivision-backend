// backend/src/services/aiCropPredictionService.js - AI-powered crop yield predictions

const tf = require('@tensorflow/tfjs');

const predictYield = (soilData, weatherData, marketData, climateRiskData) => {
  const soilTensor = tf.tensor(soilData);
  const weatherTensor = tf.tensor(weatherData);
  const marketTensor = tf.tensor(marketData);
  const climateRiskTensor = tf.tensor(climateRiskData);

  const combinedInput = tf.addN([
    soilTensor.mul(0.35), 
    weatherTensor.mul(0.35), 
    marketTensor.mul(0.15), 
    climateRiskTensor.mul(0.15)
  ]);

  const predictedYield = combinedInput.mean().mul(2.5);
  return predictedYield.arraySync();
};

const adjustPredictionWithRealTimeData = (currentYield, weatherChanges, climateRisks) => {
  const weatherFactor = tf.tensor(weatherChanges).mean().mul(1.2);
  const climateRiskFactor = tf.tensor(climateRisks).mean().mul(1.1);
  const adjustedYield = tf.tensor(currentYield).add(weatherFactor).sub(climateRiskFactor);
  return adjustedYield.arraySync();
};

const getPersonalizedRecommendations = (cropType, soilData, climateRiskData) => {
  if (climateRiskData.droughtRisk > 0.7) {
    return `Due to high drought risk, consider drought-resistant crops for ${cropType}.`;
  }
  if (soilData.moisture < 0.3) {
    return `Increase irrigation for optimal growth of ${cropType}.`;
  }
  return `Conditions are suitable for ${cropType}. No major adjustments needed.`;
};

module.exports = { predictYield, adjustPredictionWithRealTimeData, getPersonalizedRecommendations };
