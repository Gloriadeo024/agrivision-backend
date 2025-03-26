// security/middleware/monitoring.js - Real-time Monitoring and Alerts for AgriVision

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { helmetConfig, threatDetectionMiddleware } = require('./helmetConfig');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store real-time security events
let securityEvents = [];

// Broadcast events to connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Middleware to log security events
const realTimeMonitoringMiddleware = (req, res, next) => {
  const event = {
    ip: req.ip,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  };
  securityEvents.push(event);

  // Broadcast event to all monitoring dashboards
  broadcast(event);
  next();
};

// Route to get current security events
app.get('/api/security-events', (req, res) => {
  res.json(securityEvents);
});

// Clear events periodically to prevent overflow (adjust as needed)
setInterval(() => {
  securityEvents = [];
}, 3600000); // Clears every hour

// Use helmet and security middlewares
app.use(helmetConfig);
app.use(threatDetectionMiddleware);
app.use(realTimeMonitoringMiddleware);

server.listen(5001, () => {
  console.log('Real-time monitoring server running on http://localhost:5001');
});

module.exports = { realTimeMonitoringMiddleware };
