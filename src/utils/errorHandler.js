// backend/src/utils/errorHandler.js
const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';
  const stackTrace = err.stack || 'No stack trace available';

  logger.error(`Error: ${errorMessage} - Status: ${statusCode} - Method: ${req.method} - URL: ${req.originalUrl}`);
  logger.error(`Stack Trace: ${stackTrace}`);

  const response = {
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: stackTrace })
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
