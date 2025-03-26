// backend/src/utils/responseFormatter.js
const responseFormatter = (status, data, message = 'Success') => {
    return { status, data, message };
  };
  
  module.exports = responseFormatter;
  