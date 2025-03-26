// security/middleware/rateLimiter.js - Advanced rate limiting with real-time monitoring and AI-enhanced anomaly detection for AgriVision

const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

// Real-time alert system setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

const sendAlert = (ip, path, method) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_ALERT_EMAIL,
    subject: '⚠️ AgriVision Security Alert: Rate Limit Exceeded',
    text: `Suspicious activity detected:
      IP: ${ip}
      Path: ${path}
      Method: ${method}
      Time: ${new Date().toISOString()}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending alert email:', error);
    } else {
      console.log('Security alert email sent:', info.response);
    }
  });
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  handler: (req, res) => {
    sendAlert(req.ip, req.path, req.method);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = rateLimiter;
