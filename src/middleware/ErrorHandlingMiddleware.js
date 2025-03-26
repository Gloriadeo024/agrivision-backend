// ErrorHandlingMiddleware.js — Advanced AI Error Handling Middleware with Categorization, Error Codes, and Asynchronous Logging
const rateLimit = new Map();
const ERROR_RATE_LIMIT_WINDOW = 60000; // 60 seconds
const MAX_ERRORS_PER_WINDOW = 5;

const logErrorAsync = async (errorDetails) => {
  // Simulate async logging to monitoring services like Sentry, DataDog, etc.
  console.log('Logging error asynchronously:', errorDetails);
};

const categorizeError = (err) => {
  if (err.message.includes('model drift')) return 'MODEL_DRIFT';
  if (err.message.includes('miscalibration')) return 'MISCALIBRATION';
  return 'SYSTEM_ERROR';
};

module.exports = async (err, req, res, next) => {
  const currentTime = Date.now();
  const ip = req.ip || 'unknown';

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, timestamp: currentTime });
  } else {
    const entry = rateLimit.get(ip);
    if (currentTime - entry.timestamp < ERROR_RATE_LIMIT_WINDOW) {
      entry.count++;
      if (entry.count > MAX_ERRORS_PER_WINDOW) {
        return res.status(429).json({ error: 'Too many AI errors, please try again later.' });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: currentTime });
    }
  }

  const errorCategory = categorizeError(err);
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    category: errorCategory,
    path: req.path,
    timestamp: new Date().toISOString()
  };

  await logErrorAsync(errorDetails);

  res.status(500).json({
    error: 'AI model failure',
    code: errorCategory,
    details: err.message
  });
};
