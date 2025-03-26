const request = require('supertest');
const express = require('express');
const { pestsMiddleware } = require('../middleware/pests');

const app = express();
app.use(express.json());
app.use(pestsMiddleware);

app.post('/test', (req, res) => {
  const pestsData = req.body.pests;
  if (!pestsData) {
    return res.status(400).send('Pests data is required');
  }
  res.status(200).json({ message: 'Pests data processed', pestsData });
});

describe('Pests Middleware', () => {
  it('should process pests data', async () => {
    const res = await request(app).post('/test').send({ pests: 'Severe' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Pests data processed');
    expect(res.body.pestsData).toBe('Severe');
  });

  it('should handle missing pests data gracefully', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.text).toBe('Pests data is required');
  });

  it('should handle unexpected data formats', async () => {
    const res = await request(app).post('/test').send({ pests: 12345 });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid pests data format');
  });
});
