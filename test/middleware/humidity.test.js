const request = require('supertest');
const express = require('express');
const { humidityMiddleware } = require('../middleware/humidity');

const app = express();
app.use(express.json());
app.use(humidityMiddleware);

app.post('/test', (req, res) => {
  if (!req.body.humidity) {
    return res.status(400).json({ error: 'Humidity data is required' });
  }
  if (typeof req.body.humidity !== 'string' || !req.body.humidity.endsWith('%')) {
    return res.status(400).json({ error: 'Invalid humidity format. Must be a percentage string, e.g., "60%".' });
  }
  res.json({ humidity: req.body.humidity });
});

describe('Humidity Middleware', () => {
  it('should process valid humidity data', async () => {
    const res = await request(app).post('/test').send({ humidity: '60%' });
    expect(res.status).toBe(200);
    expect(res.body.humidity).toBe('60%');
  });

  it('should handle missing humidity data with a proper error message', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Humidity data is required');
  });

  it('should handle invalid humidity format', async () => {
    const res = await request(app).post('/test').send({ humidity: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid humidity format. Must be a percentage string, e.g., "60%".');
  });

  it('should handle unexpected server errors', async () => {
    app.use((req, res) => { throw new Error('Unexpected error'); });
    const res = await request(app).post('/test').send({ humidity: '70%' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal Server Error');
  });

  it('should handle async data processing', async () => {
    app.post('/async-test', async (req, res) => {
      try {
        const data = await new Promise((resolve) => setTimeout(() => resolve(req.body.humidity), 100));
        res.json({ processedHumidity: data });
      } catch (error) {
        res.status(500).json({ error: 'Async processing failed' });
      }
    });

    const res = await request(app).post('/async-test').send({ humidity: '80%' });
    expect(res.status).toBe(200);
    expect(res.body.processedHumidity).toBe('80%');
  });
});
