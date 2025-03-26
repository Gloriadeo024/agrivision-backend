// AuthMiddleware.js — Ensure AI model requests are secure and authenticated with rate limiting, logging, and detailed error responses
const requestCounts = {};
const rateLimitWindow = 60000; // 1 minute
const maxRequests = 100; // Max requests per window

setInterval(() => { Object.keys(requestCounts).forEach(ip => delete requestCounts[ip]); }, rateLimitWindow);

module.exports = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const ip = req.ip;
    
    if (!apiKey || apiKey !== process.env.AI_API_KEY) {
      console.warn('Unauthorized access attempt:', {
        ip,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']
      });
      return res.status(403).json({ error: 'Unauthorized access. Invalid API key.' });
    }

    requestCounts[ip] = (requestCounts[ip] || 0) + 1;
    if (requestCounts[ip] > maxRequests) {
      console.warn('Rate limit exceeded:', { ip, timestamp: new Date().toISOString() });
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    next();
  } catch (error) {
    console.error('Authentication Middleware Error:', error.message);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};
