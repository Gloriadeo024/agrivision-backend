// graphql/subscriptions.js
const { PubSub } = require('apollo-server-express');
const pubsub = new PubSub();

const SUBSCRIPTION_EVENTS = {
  SALINITY_ALERT: 'SALINITY_ALERT',
  NUTRIENT_RECOMMENDATION: 'NUTRIENT_RECOMMENDATION',
  MOISTURE_ALERT: 'MOISTURE_ALERT',
  CROP_RECOMMENDATION: 'CROP_RECOMMENDATION',
  SENSOR_DATA_UPDATED: 'SENSOR_DATA_UPDATED',
  MARKET_PRICE_UPDATED: 'MARKET_PRICE_UPDATED',
  WEATHER_ALERT: 'WEATHER_ALERT'
};

const SENSOR_TYPES = [
  'Soil Moisture Sensor',
  'Salinity Sensor',
  'Nutrient Sensor',
  'Temperature Sensor',
  'Humidity Sensor',
  'Rain Gauge',
  'pH Sensor',
  'Wind Speed Sensor'
];

const subscriptions = {
  Subscription: {
    salinityAlert: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.SALINITY_ALERT)
    },
    nutrientRecommendation: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.NUTRIENT_RECOMMENDATION)
    },
    moistureAlert: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.MOISTURE_ALERT)
    },
    cropRecommendation: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.CROP_RECOMMENDATION)
    },
    sensorDataUpdated: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.SENSOR_DATA_UPDATED)
    },
    marketPriceUpdated: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.MARKET_PRICE_UPDATED)
    },
    weatherAlert: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.WEATHER_ALERT)
    }
  }
};

const triggerSalinityAlert = (alertData) => pubsub.publish(SUBSCRIPTION_EVENTS.SALINITY_ALERT, { salinityAlert: alertData });
const triggerNutrientRecommendation = (recommendation) => pubsub.publish(SUBSCRIPTION_EVENTS.NUTRIENT_RECOMMENDATION, { nutrientRecommendation: recommendation });
const triggerMoistureAlert = (alertData) => pubsub.publish(SUBSCRIPTION_EVENTS.MOISTURE_ALERT, { moistureAlert: alertData });
const triggerCropRecommendation = (recommendation) => pubsub.publish(SUBSCRIPTION_EVENTS.CROP_RECOMMENDATION, { cropRecommendation: recommendation });
const triggerSensorDataUpdate = (sensorData) => pubsub.publish(SUBSCRIPTION_EVENTS.SENSOR_DATA_UPDATED, { sensorDataUpdated: sensorData });
const triggerMarketPriceUpdate = (marketData) => pubsub.publish(SUBSCRIPTION_EVENTS.MARKET_PRICE_UPDATED, { marketPriceUpdated: marketData });
const triggerWeatherAlert = (weatherData) => pubsub.publish(SUBSCRIPTION_EVENTS.WEATHER_ALERT, { weatherAlert: weatherData });

module.exports = {
  subscriptions,
  triggerSalinityAlert,
  triggerNutrientRecommendation,
  triggerMoistureAlert,
  triggerCropRecommendation,
  triggerSensorDataUpdate,
  triggerMarketPriceUpdate,
  triggerWeatherAlert,
  SENSOR_TYPES
};
