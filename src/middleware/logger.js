// logger.js — AI-powered Logging Middleware with Cloud Monitoring and Real-time Dashboards for AgriVision
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const Sentry = require('@sentry/node');
const datadog = require('datadog-metrics');

// Initialize Sentry and DataDog
Sentry.init({ dsn: process.env.SENTRY_DSN });
datadog.init({ apiKey: process.env.DATADOG_API_KEY, appKey: process.env.DATADOG_APP_KEY });

const logFile = path.join(__dirname, '../logs/agriVision.log');
const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

// Custom metrics for AI recalibrations, cache hits, and translations
datadog.increment('agrivision.ai_recalibrations', 0);
datadog.increment('agrivision.cache_hits', 0);
datadog.increment('agrivision.failed_translations', 0);

// Rate-limited logging to prevent log spamming during high traffic
const logCooldown = new Map();
const cooldownTime = 3000; // 3 seconds

const log = (level, message, meta = {}) => {
  if (!logLevels.includes(level)) return;
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logEntry = `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}\n`;

  // Check rate limit
  const lastLogged = logCooldown.get(message);
  if (lastLogged && Date.now() - lastLogged < cooldownTime) return;
  logCooldown.set(message, Date.now());

  // Write to file
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });

  // Real-time console output for observability
  console.log(logEntry.trim());

  // Cloud monitoring integration
  if (level === 'ERROR') Sentry.captureException(new Error(message));
  datadog.increment('agrivision.logs', 1, [`level:${level}`]);
};

const loggerMiddleware = (req, res, next) => {
  log('INFO', 'Incoming Request', { method: req.method, path: req.path, ip: req.ip });

  res.on('finish', () => {
    log('INFO', 'Request Completed', { statusCode: res.statusCode, responseTime: `${Date.now() - req.startTime}ms` });
  });

  req.startTime = Date.now();
  next();
};

// languageMiddleware.js — AI-powered Language Detection, Real-time Translation, and Error Analytics
const acceptLanguage = require('accept-language');
const { translateText } = require('../config/translator');
const supportedLanguages = ['en', 'es', 'fr', 'sw', 'mj']; // Added Kiswahili (sw) & Mijikenda (mj)

// Configure accepted languages
acceptLanguage.languages(supportedLanguages);

const languageDetector = async (req, res, next) => {
  try {
    if (req.user?.preferredLanguage && supportedLanguages.includes(req.user.preferredLanguage)) {
      req.language = req.user.preferredLanguage;
    } else if (req.query.lang && supportedLanguages.includes(req.query.lang)) {
      req.language = req.query.lang;
    } else {
      const browserLang = req.headers['accept-language'];
      req.language = acceptLanguage.get(browserLang) || 'en';
    }
    log('INFO', 'Language Detected', { language: req.language });
    next();
  } catch (error) {
    console.error('Language detection error:', error);
    req.language = 'en';
    datadog.increment('agrivision.failed_translations');
    next();
  }
};

const realTimeTranslator = async (req, res, next) => {
  try {
    if (req.body.text && req.language !== 'en') { 
      req.translatedText = await translateText(req.body.text, req.language);
      log('INFO', 'Real-time Translation Success', { original: req.body.text, translated: req.translatedText });
    } else {
      req.translatedText = req.body.text;
    }
    next();
  } catch (error) {
    console.error('Translation error:', error);
    datadog.increment('agrivision.failed_translations');
    req.translatedText = req.body.text; 
    next();
  }
};

// Health check endpoint for cloud monitoring
const healthCheck = (req, res) => {
  log('INFO', 'Health Check Triggered');
  res.status(200).json({ status: 'Healthy', timestamp: new Date().toISOString() });
};

module.exports = {
  log,
  loggerMiddleware,
  languageDetector,
  realTimeTranslator,
  supportedLanguages,
  healthCheck
};
