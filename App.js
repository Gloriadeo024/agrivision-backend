// backend/src/App.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const aiUtils = require('./utils/aiUtils');
const rateLimiter = require('./utils/rateLimiter');
const logger = require('./utils/logger');
const { verifyToken, checkRole } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(rateLimiter);

// AI-powered request monitoring
app.use(async (req, res, next) => {
  try {
    const riskScore = await aiUtils.assessRequestRisk({ ip: req.ip, userAgent: req.headers['user-agent'] });
    logger.aiPrediction('RequestRiskModel', { ip: req.ip }, riskScore);
    if (riskScore > 8) {
      return res.status(403).json({ error: 'High-risk activity detected' });
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/logs', checkRole('admin'), logRoutes);

// Real-time logging with WebSockets
io.on('connection', (socket) => {
  logger.info('Client connected to WebSocket');
  socket.on('logEvent', (logData) => {
    io.emit('newLog', logData); // Broadcast logs to all connected clients
  });
  socket.on('disconnect', () => {
    logger.info('Client disconnected from WebSocket');
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = { app, server };
