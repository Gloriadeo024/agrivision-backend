// backend/src/services/loggingService.js - Advanced Centralized logging for system health with AI Supercharging, Log Rotation, Remote Logging & Alert Thresholds

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const axios = require('axios');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// AI Supercharging: Track AI decision paths and confidence levels
const logAIDecision = (modelName, decisionPath, confidenceScore) => {
  const message = `[AI Model: ${modelName}] Decision Path: ${decisionPath}, Confidence: ${confidenceScore}`;
  logger.info(message);
  sendRemoteLog('info', message);
};

// Track error counts for alert thresholds
let errorCount = 0;
const ERROR_THRESHOLD = 10; // Adjust threshold as needed
const ALERT_RESET_INTERVAL = 3600000; // 1 hour

const logEvent = (level, message) => {
  logger.log({ level, message });
  sendRemoteLog(level, message);
  checkAlertThreshold(level);
};

const logError = (error, context = 'General') => {
  const errorMessage = `[Context: ${context}] ${error.stack || error}`;
  logger.error(errorMessage);
  sendRemoteLog('error', errorMessage);
  errorCount++;
  checkAlertThreshold('error');
};

const logAIAdjustments = (modelName, data) => {
  const message = `[AI Model: ${modelName}] Adjustment Data: ${JSON.stringify(data)}`;
  logger.info(message);
  sendRemoteLog('info', message);
};

// Stream for external logging (like Morgan)
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Send logs to a remote server for centralized monitoring
const sendRemoteLog = async (level, message) => {
  try {
    await axios.post(process.env.REMOTE_LOGGING_URL, { level, message });
  } catch (error) {
    console.error('Failed to send remote log:', error);
  }
};

// Alert when error count exceeds threshold
const checkAlertThreshold = (level) => {
  if (level === 'error' && errorCount >= ERROR_THRESHOLD) {
    sendCriticalAlert(`High error rate detected: ${errorCount} errors`);
    errorCount = 0; // Reset counter after alert
  }
};

const sendCriticalAlert = async (message) => {
  try {
    await axios.post(process.env.ALERT_SYSTEM_URL, { message });
    console.log('Critical alert sent:', message);
  } catch (error) {
    console.error('Failed to send critical alert:', error);
  }
};

// Reset error count periodically
setInterval(() => {
  errorCount = 0;
}, ALERT_RESET_INTERVAL);

module.exports = { logEvent, logError, logAIAdjustments, logAIDecision, stream, logger };
