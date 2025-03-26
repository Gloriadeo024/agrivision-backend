// backend/src/index.js - Integrating Logging Service into AgriVision

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { logEvent, logError, logAIAdjustments, stream } = require('./services/loggingService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Integrate Morgan for HTTP request logging using the custom logging stream
app.use(morgan('combined', { stream }));

// Sample route to test logging
app.get('/', (req, res) => {
  logEvent('info', 'Root endpoint accessed');
  res.send('Welcome to AgriVision! 🌿');
});

// Sample AI adjustment route (mocked)
app.post('/ai/adjustment', (req, res) => {
  const modelName = req.body.model || 'defaultModel';
  const data = req.body.data || {};
  logAIAdjustments(modelName, data);
  res.status(200).json({ message: 'AI adjustment logged successfully' });
});

// Error simulation route for testing alert thresholds
app.get('/error', (req, res) => {
  logError(new Error('Simulated error for testing'));
  res.status(500).json({ message: 'Error logged' });
});

app.listen(PORT, () => {
  logEvent('info', `Server running on http://localhost:${PORT}`);
});
