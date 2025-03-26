// weatherController.js
const axios = require('axios');
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const { checkRole } = require('./middlewares/roleMiddleware');

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.WEATHER_API_KEY;

// Fetch weather data by location
exports.getWeatherByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const response = await axios.get(`${WEATHER_API_URL}?q=${location}&appid=${API_KEY}`);
    const weatherData = response.data;

    logEvent('Weather Data Fetched', { location, temperature: weatherData.main.temp });
    auditTrail.record('Weather Data Retrieved', null, req.user?.role || 'guest');

    res.status(200).json({ message: 'Weather data retrieved successfully', weatherData });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch weather data by coordinates
exports.getWeatherByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await axios.get(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const weatherData = response.data;

    logEvent('Weather Data Fetched', { lat, lon, temperature: weatherData.main.temp });
    auditTrail.record('Weather Data Retrieved', null, req.user?.role || 'guest');

    res.status(200).json({ message: 'Weather data retrieved successfully', weatherData });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};
