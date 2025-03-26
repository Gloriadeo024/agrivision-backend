// backend/tests/chatbotService.test.js - Jest tests for chatbotService.js

const { 
    generateChatbotResponse,
    generateCropRecommendations,
    diagnosePestDisease,
    getRealTimeWeather,
    analyzeSoilData,
    generateDisasterResponsePlan,
    processVoiceCommand 
  } = require('../src/services/chatbotService');
  const axios = require('axios');
  
  jest.mock('axios');
  
  describe('Chatbot Service Tests', () => {
    test('generateChatbotResponse should return AI response', async () => {
      const userMessage = 'What crops should I plant?';
      const response = await generateChatbotResponse(userMessage);
      expect(typeof response).toBe('string');
    });
  
    test('generateCropRecommendations should suggest crops', async () => {
      const response = await generateCropRecommendations('loamy', 'tropical', 'Kenya');
      expect(typeof response).toBe('string');
    });
  
    test('diagnosePestDisease should return pest or disease info', async () => {
      const response = await diagnosePestDisease('yellow spots on leaves');
      expect(typeof response).toBe('string');
    });
  
    test('getRealTimeWeather should fetch weather data', async () => {
      axios.get.mockResolvedValue({ data: { location: 'Kenya', temp_c: 28 } });
      const data = await getRealTimeWeather('Kenya');
      expect(data).toHaveProperty('location');
    });
  
    test('analyzeSoilData should return crop yield insights', async () => {
      const soilData = { salinity: 3, fertility: 'high', moisture: 'adequate', irrigationStatus: 'active' };
      const response = await analyzeSoilData(soilData);
      expect(typeof response).toBe('string');
    });
  
    test('generateDisasterResponsePlan should provide a plan', async () => {
      const weatherData = { rainfall: 'heavy', windSpeed: 'high' };
      const soilData = { salinity: 3, fertility: 'high' };
      const response = await generateDisasterResponsePlan(weatherData, soilData);
      expect(typeof response).toBe('string');
    });
  });
  