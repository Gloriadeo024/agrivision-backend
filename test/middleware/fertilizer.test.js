const request = require('supertest');
const express = require('express');
const { fertilizerMiddleware } = require('../middleware/fertilizer');

const app = express();
app.use(express.json());
app.use(fertilizerMiddleware);

app.post('/test', (req, res) => {
  if (req.body.error) {
    return res.status(400).json({ message: req.body.error });
  }
  res.status(200).send('Fertilizer data processed');
});

describe('Fertilizer Middleware', () => {
  it('should process valid fertilizer data', async () => {
    const res = await request(app).post('/test').send({ fertilizer: 'Nitrogen' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('Fertilizer data processed');
  });

  it('should return 400 for missing fertilizer field', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Fertilizer data is required');
  });

  it('should return 400 for invalid fertilizer type', async () => {
    const res = await request(app).post('/test').send({ fertilizer: 'Unknown' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid fertilizer type');
  });

  it('should handle null fertilizer data gracefully', async () => {
    const res = await request(app).post('/test').send({ fertilizer: null });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Fertilizer data cannot be null');
  });

  it('should handle unexpected errors gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).post('/test').send({ fertilizer: {} });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    console.error.mockRestore();
  });

  it('should trim whitespace from fertilizer data', async () => {
    const res = await request(app).post('/test').send({ fertilizer: '  Nitrogen  ' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('Fertilizer data processed');
  });

  it('should validate fertilizer type is a string', async () => {
    const res = await request(app).post('/test').send({ fertilizer: 12345 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Fertilizer type must be a string');
  });
});
