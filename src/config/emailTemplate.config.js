module.exports = {
    brand: {
      name: 'AgriVision',
      logo: 'https://yourdomain.com/logo.png', // Update with your logo URL
      primaryColor: '#007bff',
      secondaryColor: '#28a745',
      fontFamily: 'Arial, sans-serif',
    },
    footer: {
      address: '123 AgriTech Street, FarmCity, FC 12345',
      socialLinks: {
        facebook: 'https://facebook.com/agrivision',
        twitter: 'https://twitter.com/agrivision',
        linkedin: 'https://linkedin.com/company/agrivision',
      },
      contactEmail: 'support@agrivision.com',
    }
  }; 
  // backend/config/emailtemplate.config.js
const path = require('path');

module.exports = {
  welcomeTemplate: path.join(__dirname, '../emails/templates/welcome.ejs'),
  passwordResetTemplate: path.join(__dirname, '../emails/templates/password-reset.ejs'),
  verificationTemplate: path.join(__dirname, '../emails/templates/verification.ejs'),
};
