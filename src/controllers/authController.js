// backend/src/controllers/authController.js
// Handles user authentication: login, signup, logout
const logger = require('./utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userUtils = require('./utils/userUtils');
const aiUtils = require('./utils/aiUtils');
const config = require('./config/config');
const otpUtils = require('./utils/otpUtils');
const rateLimiter = require('./utils/rateLimiter');
const auditTrail = require('./utils/auditTrail');
const { triggerWebhook } = require('./utils/webhookUtils');
const geoLocation = require('./utils/geoLocation');
const { validateSignup, validateLogin } = require('../validators/authValidator');

const authController = {
  register: rateLimiter(async (req, res) => {
    try {
      logger.request(req);
      const { username, email, password, role } = req.body;
      logger.info('User registration attempt', { username, email });

      const validationResult = validateSignup(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await userUtils.createUser({ username, email, password: hashedPassword, role });
      logger.info('User registered successfully', { userId: newUser.id });

      auditTrail.record('User Signup', newUser.id);
      triggerWebhook('user.signup', { userId: newUser.id, email: newUser.email });
      res.json(responseFormatter(201, newUser, 'User registered successfully'));
    } catch (err) {
      logger.errorWithStack(err);
      res.status(500).json({ error: 'User registration failed' });
    }
  }),

  login: rateLimiter(async (req, res) => {
    try {
      logger.request(req);
      const { email, password } = req.body;
      logger.info('User login attempt', { email });

      const validationResult = validateLogin(req.body);
      if (!validationResult.isValid) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const user = await userUtils.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        logger.warn('Invalid login credentials', { email });
        triggerWebhook('user.failedLogin', { email });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const userLocation = await geoLocation.getLocation(req.ip);
      logger.info('User login successful', { userId: user.id, email: user.email, location: userLocation });
      auditTrail.record('User Login', user.id);
      triggerWebhook('user.login', { userId: user.id, email: user.email, location: userLocation });

      const riskScore = await aiUtils.assessLoginRisk({ email, ip: req.ip, userAgent: req.headers['user-agent'] });
      logger.aiPrediction('LoginRiskModel', { email, ip: req.ip }, riskScore);

      if (riskScore > 7) {
        const otp = otpUtils.generateOTP();
        await otpUtils.sendOTP(email, otp);
        logger.warn('High-risk login detected, OTP sent', { email });
        return res.status(403).json({ message: 'OTP sent due to high-risk login', email });
      }

      const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '2h' });
      res.json(responseFormatter(200, { token, user }, 'Login successful'));
    } catch (err) {
      logger.errorWithStack(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }),

  verifyOTP: async (req, res) => {
    try {
      logger.request(req);
      const { email, otp } = req.body;
      logger.info('Verifying OTP', { email });

      const isValidOTP = await otpUtils.verifyOTP(email, otp);
      if (!isValidOTP) {
        logger.warn('Invalid OTP', { email });
        return res.status(401).json({ error: 'Invalid OTP' });
      }

      const user = await userUtils.findUserByEmail(email);
      const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '2h' });
      logger.info('User authenticated successfully via MFA', { userId: user.id });

      res.json(responseFormatter(200, { token, user }, 'Login successful with multi-factor authentication'));
    } catch (err) {
      logger.errorWithStack(err);
      res.status(500).json({ error: 'OTP verification failed' });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      logger.request(req);
      const userId = req.user.id;
      const user = await userUtils.findUserById(userId);

      if (!user) {
        logger.warn('User not found', { userId });
        return res.status(404).json({ error: 'User not found' });
      }

      logger.info('User profile retrieved', { userId });
      res.json(responseFormatter(200, user, 'User profile fetched successfully'));
    } catch (err) {
      logger.errorWithStack(err);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  },

  aiLoginRiskAssessment: async (req, res) => {
    try {
      logger.request(req);
      const { email, ip, userAgent } = req.body;
      logger.info('Running AI risk assessment for login', { email, ip, userAgent });

      const riskScore = await aiUtils.assessLoginRisk({ email, ip, userAgent });
      logger.aiPrediction('LoginRiskModel', { email, ip }, riskScore);

      res.json(responseFormatter(200, { riskScore }, 'Risk assessment completed'));
    } catch (err) {
      logger.errorWithStack(err);
      res.status(500).json({ error: 'AI risk assessment failed' });
    }
  }
};

module.exports = authController;
