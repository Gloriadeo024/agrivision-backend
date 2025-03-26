// backend/src/config/websocket.js - WebSocket configuration for real-time events
const WebSocket = require('ws');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('📡 New WebSocket connection');
    ws.on('message', (message) => {
      console.log('Received:', message);
      ws.send('Message received');
    });
  });

  return wss;
};

module.exports = setupWebSocket;
