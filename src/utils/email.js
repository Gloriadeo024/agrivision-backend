// backend/src/utils/email.js
const nodemailer = require('nodemailer');
const logger = require('./logger');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  secure: config.emailSecure,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

const emailUtils = {
  sendEmail: async (to, subject, html) => {
    try {
      const info = await transporter.sendMail({
        from: config.emailFrom,
        to,
        subject,
        html,
      });
      logger.info(`Email sent: ${info.messageId} to ${to}`);
      return info;
    } catch (err) {
      logger.error(`Email sending failed: ${err.message}`);
      throw new Error('Email sending error');
    }
  },

  sendOTP: async (to, otp) => {
    const subject = 'Your OTP Code';
    const html = `<p>Your OTP code is: <strong>${otp}</strong></p>`;
    return emailUtils.sendEmail(to, subject, html);
  },

  sendWelcomeEmail: async (to, username) => {
    const subject = 'Welcome to AgriVision!';
    const html = `<p>Hello ${username},</p><p>Welcome to AgriVision! We're excited to have you onboard.</p>`;
    return emailUtils.sendEmail(to, subject, html);
  },
};

module.exports = emailUtils;
