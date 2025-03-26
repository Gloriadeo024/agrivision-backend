// backend/src/services/weatherService.js - Weather data integration

const axios = require('axios');

const getWeatherData = async (location) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
  return response.data;
};

const getHistoricalWeatherData = async (location, date) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const response = await axios.get(`https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${date}`);
  return response.data;
};

const getForecastData = async (location, days) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}`);
  return response.data;
};

const getWeatherImpactOnCrops = async (location) => {
  const weatherData = await getWeatherData(location);
  return weatherData.current.condition.text.includes('rain') ? 'High Moisture' : 'Normal';
};

const getClimateRiskData = async (location) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const response = await axios.get(`https://api.weatherapi.com/v1/climate.json?key=${apiKey}&q=${location}`);
  return response.data;
};

module.exports = { getWeatherData, getHistoricalWeatherData, getForecastData, getWeatherImpactOnCrops, getClimateRiskData };
