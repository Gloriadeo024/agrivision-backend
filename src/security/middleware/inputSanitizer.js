// security/middleware/inputSanitizer.js - Input Sanitization for AgriVision

const sanitizeHtml = require('sanitize-html');

// Middleware to sanitize incoming inputs
const inputSanitizer = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
};

module.exports = inputSanitizer;
