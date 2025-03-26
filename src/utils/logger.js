const fs = require('fs');
const path = require('path');
const util = require('util');
const logFile = path.join(__dirname, '../../logs', 'app.log');

const appendFile = util.promisify(fs.appendFile);

const logger = {
  log: async (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
    const logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}${metaString}\n`;
    try {
      await appendFile(logFile, logMessage);
      console.log(logMessage);
    } catch (err) {
      console.error('Failed to write log:', err);
    }
  },
  info: (message, meta) => logger.log('info', message, meta),
  error: (message, meta) => logger.log('error', message, meta),
  warn: (message, meta) => logger.log('warn', message, meta),
  request: (req) => logger.log('info', `Request: ${req.method} ${req.url}`, { headers: req.headers, body: req.body }),
  errorWithStack: (err) => logger.error(err.message, { stack: err.stack }),
};

module.exports = logger;
