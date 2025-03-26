const request = require('supertest');
const express = require('express');
const { loggerMiddleware } = require('../middleware/logger');

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

app.post('/test', (req, res) => {
  res.status(200).json({ message: 'Logger middleware tested', data: req.body });
});

describe('Logger Middleware', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log incoming requests with method and URL', async () => {
    await request(app).post('/test').send({ data: 'Test data' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Incoming Request: POST /test'));
  });

  it('should log request body if present', async () => {
    await request(app).post('/test').send({ key: 'value' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Request Body: {"key":"value"}'));
  });

  it('should handle empty request bodies gracefully', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logger middleware tested');
  });

  it('should not break if request body is missing', async () => {
    const res = await request(app).post('/test');
    expect(res.status).toBe(200);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Request Body: {}'));
  });
});
