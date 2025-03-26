// graphql/dataloaders.js
const DataLoader = require('dataloader');
const { cache } = require('../utils/cache'); // A simple in-memory cache with TTL support
const db = require('../config/db');

const CACHE_TTL = 600; // 10 min TTL for all caches

// Batch function for Users
const batchUsers = async (keys) => {
  const cachedUsers = keys.map(key => cache.get(`user_${key}`));
  const missingKeys = keys.filter((_, i) => !cachedUsers[i]);

  if (missingKeys.length > 0) {
    const users = await db('users').whereIn('id', missingKeys);
    users.forEach(user => cache.set(`user_${user.id}`, user, CACHE_TTL));
    const userMap = new Map(users.map(user => [user.id, user]));
    return keys.map(key => userMap.get(key) || cache.get(`user_${key}`));
  }

  return cachedUsers;
};

// Batch function for Farms
const batchFarms = async (keys) => {
  const cachedFarms = keys.map(key => cache.get(`farm_${key}`));
  const missingKeys = keys.filter((_, i) => !cachedFarms[i]);

  if (missingKeys.length > 0) {
    const farms = await db('farms').whereIn('id', missingKeys);
    farms.forEach(farm => cache.set(`farm_${farm.id}`, farm, CACHE_TTL));
    const farmMap = new Map(farms.map(farm => [farm.id, farm]));
    return keys.map(key => farmMap.get(key) || cache.get(`farm_${key}`));
  }

  return cachedFarms;
};

// Batch function for Sensors
const batchSensors = async (keys) => {
  const cachedSensors = keys.map(key => cache.get(`sensor_${key}`));
  const missingKeys = keys.filter((_, i) => !cachedSensors[i]);

  if (missingKeys.length > 0) {
    const sensors = await db('sensors').whereIn('id', missingKeys);
    sensors.forEach(sensor => cache.set(`sensor_${sensor.id}`, sensor, CACHE_TTL));
    const sensorMap = new Map(sensors.map(sensor => [sensor.id, sensor]));
    return keys.map(key => sensorMap.get(key) || cache.get(`sensor_${key}`));
  }

  return cachedSensors;
};

// Batch function for AI Insights
const batchAIInsights = async (keys) => {
  const cachedInsights = keys.map(key => cache.get(`aiInsight_${key}`));
  const missingKeys = keys.filter((_, i) => !cachedInsights[i]);

  if (missingKeys.length > 0) {
    const insights = await db('ai_insights').whereIn('id', missingKeys);
    insights.forEach(insight => cache.set(`aiInsight_${insight.id}`, insight, CACHE_TTL));
    const insightsMap = new Map(insights.map(insight => [insight.id, insight]));
    return keys.map(key => insightsMap.get(key) || cache.get(`aiInsight_${key}`));
  }

  return cachedInsights;
};

// Batch function for Market Data
const batchMarketData = async (keys) => {
  const cachedMarkets = keys.map(key => cache.get(`market_${key}`));
  const missingKeys = keys.filter((_, i) => !cachedMarkets[i]);

  if (missingKeys.length > 0) {
    const markets = await db('markets').whereIn('id', missingKeys);
    markets.forEach(market => cache.set(`market_${market.id}`, market, CACHE_TTL));
    const marketMap = new Map(markets.map(market => [market.id, market]));
    return keys.map(key => marketMap.get(key) || cache.get(`market_${key}`));
  }

  return cachedMarkets;
};

// Batch function for Weather Data
const batchWeatherData = async (keys) => {
  const cachedWeather = keys.map(key => cache.get(`weather_${key}`));
  const missingKeys = keys.filter((_, i) => !cachedWeather[i]);

  if (missingKeys.length > 0) {
    const weatherData = await db('weather').whereIn('id', missingKeys);
    weatherData.forEach(weather => cache.set(`weather_${weather.id}`, weather, CACHE_TTL));
    const weatherMap = new Map(weatherData.map(weather => [weather.id, weather]));
    return keys.map(key => weatherMap.get(key) || cache.get(`weather_${key}`));
  }

  return cachedWeather;
};

// Data loaders with caching
const loaders = {
  userLoader: new DataLoader(batchUsers),
  farmLoader: new DataLoader(batchFarms),
  sensorLoader: new DataLoader(batchSensors),
  aiInsightLoader: new DataLoader(batchAIInsights),
  marketLoader: new DataLoader(batchMarketData),
  weatherLoader: new DataLoader(batchWeatherData)
};

module.exports = loaders;
