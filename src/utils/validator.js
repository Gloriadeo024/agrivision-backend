// backend/src/utils/validator.js
const Joi = require('joi');
const logger = require('./logger');

const validator = (schema) => (req, res, next) => {
  const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    const errorDetails = error.details.map((detail) => detail.message).join(', ');
    logger.warn(`Validation error: ${errorDetails}`);
    return res.status(400).json({ error: errorDetails });
  }

  req.body = value; // Cleaned and validated data
  next();
};

module.exports = validator;
