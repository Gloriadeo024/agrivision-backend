// security/middleware/corsconfig.js - Configures CORS for AgriVision with dynamic origin checks and stricter method rules

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5001', // Dev environment
  'https://agrivision.com', // Production
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Stricter allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 204, // Respond with 204 for preflight requests
};

module.exports = cors(corsOptions);
