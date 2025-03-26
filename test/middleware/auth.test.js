const request = require('supertest');
const express = require('express');
const { log, loggerMiddleware, languageDetector, realTimeTranslator, healthCheck } = require('../middleware/logger');
const translator = require('../config/translator');
const { fertilizerMiddleware } = require('../middleware/fertilizer');
const { soilSalinityMiddleware } = require('../middleware/soilSalinity');
const { humidityMiddleware } = require('../middleware/humidity');
const { waterLevelMiddleware } = require('../middleware/waterLevel');

const app = express();
app.use(express.json());
app.use(loggerMiddleware);
app.use(languageDetector);
app.use(realTimeTranslator);
app.use(fertilizerMiddleware);
app.use(soilSalinityMiddleware);
app.use(humidityMiddleware);
app.use(waterLevelMiddleware);
app.get('/health', healthCheck);
app.post('/test', (req, res) => {
  res.json({ translatedText: req.translatedText, language: req.language });
});

jest.mock('../config/translator', () => ({
  translateText: jest.fn((text, lang) => Promise.resolve(`${text} [translated to ${lang}]`))
}));

// Logger Middleware Tests
describe('Logger Middleware', () => {
  it('should log incoming requests', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await request(app).get('/health');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Incoming Request'));
    consoleSpy.mockRestore();
  });
});

// Language Detection Middleware Tests
describe('Language Detection Middleware', () => {
  it('should detect language from query params', async () => {
    const res = await request(app).post('/test?lang=sw').send({ text: 'Hello' });
    expect(res.body.language).toBe('sw');
  });

  it('should default to English if no language is provided', async () => {
    const res = await request(app).post('/test').send({ text: 'Hello' });
    expect(res.body.language).toBe('en');
  });
});

// Real-time Translation Middleware Tests
describe('Real-time Translation Middleware', () => {
  it('should translate text if language is not English', async () => {
    const res = await request(app).post('/test?lang=sw').send({ text: 'Hello' });
    expect(res.body.translatedText).toBe('Hello [translated to sw]');
  });

  it('should not translate text if language is English', async () => {
    const res = await request(app).post('/test?lang=en').send({ text: 'Hello' });
    expect(res.body.translatedText).toBe('Hello');
  });
});

// Health Check Tests
describe('Health Check Endpoint', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Healthy');
  });
});

// Fertilizer Middleware Tests
describe('Fertilizer Middleware', () => {
  it('should process fertilizer data', async () => {
    const res = await request(app).post('/test').send({ fertilizer: 'Nitrogen' });
    expect(res.status).toBe(200);
  });
});

// Soil Salinity Middleware Tests
describe('Soil Salinity Middleware', () => {
  it('should analyze soil salinity levels', async () => {
    const res = await request(app).post('/test').send({ salinity: 'High' });
    expect(res.status).toBe(200);
  });
});

// Humidity Middleware Tests
describe('Humidity Middleware', () => {
  it('should process humidity data', async () => {
    const res = await request(app).post('/test').send({ humidity: '60%' });
    expect(res.status).toBe(200);
  });
});

// Water Level Middleware Tests
describe('Water Level Middleware', () => {
  it('should process water level data', async () => {
    const res = await request(app).post('/test').send({ waterLevel: 'Moderate' });
    expect(res.status).toBe(200);
  });
});
