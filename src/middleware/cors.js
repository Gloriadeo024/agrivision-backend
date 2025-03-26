// middleware/cors.js — Enterprise-grade CORS middleware with dynamic origins, logging, rate limiting, and wildcard support
const cors = require('cors');
const corsConfig = require('../config/corsConfig');

// Preflight request rate limiter
const preflightRequests = new Map();
const rateLimitWindow = 60000; // 1 minute
const maxPreflightRequests = 50; // Limit for preflight requests per minute

setInterval(() => preflightRequests.clear(), rateLimitWindow);

const dynamicCorsMiddleware = (req, callback) => {
  const allowedOrigins = corsConfig.allowedOrigins || [];
  const origin = req.header('Origin');
  const ip = req.ip;

  // Wildcard subdomain support (e.g., *.example.com)
  const isAllowed = allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin.includes('*')) {
      const regex = new RegExp('^' + allowedOrigin.replace('*', '.*') + '$');
      return regex.test(origin);
    }
    return origin === allowedOrigin;
  });

  // Rate limiting for preflight requests
  if (req.method === 'OPTIONS') {
    preflightRequests.set(ip, (preflightRequests.get(ip) || 0) + 1);
    if (preflightRequests.get(ip) > maxPreflightRequests) {
      console.warn('Preflight rate limit exceeded:', { ip, origin, timestamp: new Date().toISOString() });
      return callback(new Error('Too many preflight requests'), false);
    }
  }

  if (isAllowed || !origin) {
    callback(null, { ...corsConfig, origin: true });
  } else {
    console.warn('Blocked CORS request:', { origin, path: req.path, ip, timestamp: new Date().toISOString() });
    callback(new Error('Not allowed by CORS'));
  }
};

const corsMiddleware = cors(dynamicCorsMiddleware);

const handleCorsError = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Cross-origin request blocked.' });
  } else if (err.message === 'Too many preflight requests') {
    return res.status(429).json({ error: 'Too many preflight requests. Please try again later.' });
  }
  next(err);
};

module.exports = { corsMiddleware, handleCorsError };
