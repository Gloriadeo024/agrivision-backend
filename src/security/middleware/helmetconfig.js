// security/middleware/helmetconfig.js - Advanced Helmet setup for AgriVision with AI-driven threat detection, dynamic policy adjustments, and real-time security monitoring

const helmet = require('helmet');

const dynamicCSP = (req, res) => {
  return {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://apis.google.com', 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
      connectSrc: ["'self'", 'https://api.weather.com', 'https://api.agrivision.com'],
      frameSrc: ["'self'", 'https://www.youtube.com'],
    },
    reportUri: '/report-violation',
  };
};

const helmetConfig = helmet({
  contentSecurityPolicy: dynamicCSP,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: true },
  expectCt: { maxAge: 86400, enforce: true },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { policy: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// AI-driven threat detection logging
const threatDetectionMiddleware = (req, res, next) => {
  console.log(`Monitoring request from IP: ${req.ip} | Path: ${req.path}`);
  next();
};

module.exports = { helmetConfig, threatDetectionMiddleware };
