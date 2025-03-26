const request = require('supertest');
const express = require('express');
const { soilSalinityMiddleware, predictSalinityImpact } = require('../middleware/soilSalinity');

const app = express();
app.use(express.json());
app.use(soilSalinityMiddleware);

app.post('/test', (req, res) => {
  if (req.body.error) {
    return res.status(400).json({ message: req.body.error });
  }
  res.status(200).json({ message: 'Soil salinity data processed', prediction: req.body.prediction });
});

describe('Soil Salinity Middleware', () => {
  it('should analyze and process valid soil salinity data', async () => {
    const res = await request(app).post('/test').send({ salinity: 'High' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Soil salinity data processed');
  });

  it('should return AI predictions for salinity impact', async () => {
    const mockPrediction = 'Crop yield reduction expected';
    predictSalinityImpact.mockReturnValueOnce(mockPrediction);
    const res = await request(app).post('/test').send({ salinity: 'Medium' });
    expect(res.status).toBe(200);
    expect(res.body.prediction).toBe(mockPrediction);
  });

  it('should return 400 for missing salinity data', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Salinity data is required');
  });

  it('should handle invalid salinity levels', async () => {
    const res = await request(app).post('/test').send({ salinity: 'Unknown' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid salinity level');
  });

  it('should gracefully handle unexpected errors', async () => {
    const res = await request(app).post('/test').send({ salinity: null });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});
