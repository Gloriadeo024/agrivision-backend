// backend/src/services/chatbotService.js - AI-powered Chatbot for AgriVision

const OpenAI = require('openai');
const axios = require('axios');
const recordVoiceInput = require('../utils/voiceRecognition');
const detectLanguage = require('../utils/languageDetection');
const analyzeSentiment = require('../utils/sentimentAnalysis');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// AI-powered chatbot to assist farmers with crop advice, weather, and soil health
const generateChatbotResponse = async (userMessage, language = 'en') => {
  try {
    const sentiment = analyzeSentiment(userMessage);
    const prompt = `User sentiment: ${sentiment}. Message: ${userMessage}. Respond in ${language}.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating chatbot response:', error.message);
    throw new Error('Failed to generate AI response. Please try again later.');
  }
};

// Personalized crop recommendations based on user data
const generateCropRecommendations = async (soilType, climate, location, language = 'en') => {
  const prompt = `Based on the following data: soil type - ${soilType}, climate - ${climate}, location - ${location}, suggest the best crops for this season. Respond in ${language}.`;
  return await generateChatbotResponse(prompt, language);
};

// AI-powered pest and disease diagnostics
const diagnosePestDisease = async (symptoms, language = 'en') => {
  const prompt = `The following symptoms were observed in the crops: ${symptoms}. What are the possible pests or diseases and how should they be treated? Respond in ${language}.`;
  return await generateChatbotResponse(prompt, language);
};

// Fetch real-time weather data for given location
const getRealTimeWeather = async (location) => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${location}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time weather data:', error.message);
    throw new Error('Failed to fetch weather data.');
  }
};

// Advanced AI model for analyzing soil data and predicting crop yield
const analyzeSoilData = async ({ salinity, fertility, moisture, irrigationStatus }, language = 'en') => {
  const prompt = `Given the following soil data: salinity - ${salinity}, fertility - ${fertility}, moisture - ${moisture}, irrigation status - ${irrigationStatus}, provide insights on crop yield predictions and suggest improvements. Respond in ${language}.`;
  return await generateChatbotResponse(prompt, language);
};

// Generate proactive disaster response based on weather and soil data
const generateDisasterResponsePlan = async (weatherData, soilData, language = 'en') => {
  const prompt = `Considering the following weather data: ${JSON.stringify(weatherData)} and soil data: ${JSON.stringify(soilData)}, outline a disaster response plan for the affected farm. Respond in ${language}.`;
  return await generateChatbotResponse(prompt, language);
};

// AI-powered voice command recognition with language detection
const processVoiceCommand = async (voiceInput) => {
  try {
    const userMessage = await recordVoiceInput(voiceInput);
    const detectedLanguage = detectLanguage(userMessage);
    return await generateChatbotResponse(userMessage, detectedLanguage);
  } catch (error) {
    console.error('Error processing voice command:', error.message);
    throw new Error('Failed to process voice input.');
  }
};

module.exports = {
  generateChatbotResponse,
  generateCropRecommendations,
  diagnosePestDisease,
  getRealTimeWeather,
  analyzeSoilData,
  generateDisasterResponsePlan,
  processVoiceCommand,
};
