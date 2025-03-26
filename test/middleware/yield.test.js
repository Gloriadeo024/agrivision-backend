const request = require('supertest');
const express = require('express');
const { yieldMiddleware } = require('../middleware/yield');

const app = express();
app.use(express.json());
app.use(yieldMiddleware);

app.post('/test', (req, res) => {
  res.status(200).json({ message: 'Yield data processed', yield: req.body.yield });
});

describe('Yield Middleware', () => {
  it('should process yield data', async () => {
    const res = await request(app).post('/test').send({ yield: 120 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Yield data processed');
    expect(res.body.yield).toBe(120);
  });

  it('should handle missing yield data', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Yield data is required');
  });

  it('should validate yield data type', async () => {
    const res = await request(app).post('/test').send({ yield: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Yield data must be a number');
  });
});
