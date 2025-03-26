// languageMiddleware.js — AI-powered Language Detection and Real-time Translation
const acceptLanguage = require('accept-language');
const { translateText } = require('../config/translator');
const supportedLanguages = ['en', 'es', 'fr', 'sw', 'mj']; // Added Kiswahili (sw) & Mijikenda (mj)

// Configure accepted languages
acceptLanguage.languages(supportedLanguages);

const languageDetector = async (req, res, next) => {
  try {
    // Check user's stored preference first
    if (req.user?.preferredLanguage && supportedLanguages.includes(req.user.preferredLanguage)) {
      req.language = req.user.preferredLanguage;
      return next();
    }

    // Check query parameter
    if (req.query.lang && supportedLanguages.includes(req.query.lang)) {
      req.language = req.query.lang;
      return next();
    }

    // Check Accept-Language header
    const browserLang = req.headers['accept-language'];
    if (browserLang) {
      req.language = acceptLanguage.get(browserLang) || 'en';
      return next();
    }

    // Default to English
    req.language = 'en';
    next();
  } catch (error) {
    console.error('Language detection error:', error);
    req.language = 'en';
    next();
  }
};

const realTimeTranslator = async (req, res, next) => {
  try {
    if (req.body.text && req.language !== 'en') { // Assume English as the default source language
      req.translatedText = await translateText(req.body.text, req.language);
    } else {
      req.translatedText = req.body.text;
    }
    next();
  } catch (error) {
    console.error('Translation error:', error);
    req.translatedText = req.body.text; // Fallback to the original text
    next();
  }
};

module.exports = {
  languageDetector,
  realTimeTranslator,
  supportedLanguages
};
