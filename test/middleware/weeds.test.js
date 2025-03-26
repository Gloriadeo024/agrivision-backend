const request = require('supertest');
const express = require('express');
const { weedsMiddleware } = require('../middleware/weeds');

const app = express();
app.use(express.json());
app.use(weedsMiddleware);

app.post('/test', (req, res) => {
  res.status(200).send('Weeds data processed');
});

describe('Weeds Middleware', () => {
  it('should process weeds data', async () => {
    const res = await request(app).post('/test').send({ weeds: 'High' });
    expect(res.status).toBe(200);
    expect(res.text).toBe('Weeds data processed');
  });

  it('should handle missing weeds data gracefully', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.text).toBe('Weeds data is required');
  });
});
