const request = require('supertest');
const express = require('express');
const { languageDetector, realTimeTranslator } = require('../middleware/languageMiddleware');
const translator = require('../config/translator');

const app = express();
app.use(express.json());
app.use(languageDetector);
app.use(realTimeTranslator);

app.post('/test', (req, res) => {
  res.json({ translatedText: req.translatedText, language: req.language });
});

jest.mock('../config/translator', () => ({
  translateText: jest.fn((text, lang) => {
    if (!text || !lang) throw new Error('Translation Error');
    return Promise.resolve(`${text} [translated to ${lang}]`);
  })
}));

describe('Language Middleware', () => {
  describe('Language Detection', () => {
    it('should detect language from query params', async () => {
      const res = await request(app).post('/test?lang=sw').send({ text: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.language).toBe('sw');
    });

    it('should default to English if no language is provided', async () => {
      const res = await request(app).post('/test').send({ text: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.language).toBe('en');
    });
  });

  describe('Real-time Translation', () => {
    it('should translate text if language is not English', async () => {
      const res = await request(app).post('/test?lang=sw').send({ text: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.translatedText).toBe('Hello [translated to sw]');
    });

    it('should not translate text if language is English', async () => {
      const res = await request(app).post('/test?lang=en').send({ text: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.body.translatedText).toBe('Hello');
    });

    it('should handle missing text input with an error', async () => {
      const res = await request(app).post('/test?lang=sw').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Text is required for translation');
    });

    it('should handle translation errors gracefully', async () => {
      translator.translateText.mockImplementationOnce(() => Promise.reject(new Error('Translation service failure')));
      const res = await request(app).post('/test?lang=sw').send({ text: 'Hello' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Translation failed');
    });
  });

  describe('Error Analytics', () => {
    it('should log translation errors for analytics', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      translator.translateText.mockImplementationOnce(() => Promise.reject(new Error('Translation Error')));
      await request(app).post('/test?lang=sw').send({ text: 'Hello' });
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Translation Error'));
      consoleSpy.mockRestore();
    });
  });
});
