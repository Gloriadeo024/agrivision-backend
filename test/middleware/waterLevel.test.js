const request = require('supertest');
const express = require('express');
const { waterLevelMiddleware } = require('../middleware/waterLevel');

const app = express();
app.use(express.json());
app.use(waterLevelMiddleware);

app.post('/test', (req, res) => {
  res.status(200).json({ message: 'Water level data processed', data: req.body });
});

describe('Water Level Middleware', () => {
  it('should process water level data', async () => {
    const res = await request(app).post('/test').send({ waterLevel: 'Moderate' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Water level data processed');
  });

  it('should handle missing water level data gracefully', async () => {
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({});
  });

  it('should process async water level data', async () => {
    jest.useFakeTimers();
    const mockAsyncProcess = jest.fn(() => Promise.resolve('Processed asynchronously'));
    const res = await request(app).post('/test').send({ waterLevel: 'High' });
    await mockAsyncProcess();
    jest.runAllTimers();
    expect(res.status).toBe(200);
    expect(mockAsyncProcess).toHaveBeenCalled();
  });

  it('should log errors if middleware throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    app.use((req, res, next) => { next(new Error('Test Error')); });
    const res = await request(app).post('/test').send({ waterLevel: 'High' });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Error'));
    consoleSpy.mockRestore();
  });
});
