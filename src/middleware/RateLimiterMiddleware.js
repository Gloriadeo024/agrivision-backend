// RateLimiterMiddleware.js — Control AI model request rates to prevent overload with adaptive limits
let requestCounts = {};
const rateLimitWindow = 60000; // 1 minute
const maxRequests = 100; // Max requests per window

setInterval(() => { requestCounts = {}; }, rateLimitWindow);

module.exports = (req, res, next) => {
  const ip = req.ip;
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > maxRequests) { 
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
};
