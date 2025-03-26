// userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const { sendEmail } = require('./utils/emailUtils');
const passport = require('passport');
const speakeasy = require('speakeasy');
const { verifyBiometricData } = require('./utils/biometricUtils');
const { checkUserRole, assignRole } = require('./utils/rbacUtils');

const JWT_SECRET = process.env.JWT_SECRET;

// Register new user with optional role assignment
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || 'user' });

    logEvent('User Registered', { userId: user._id });
    auditTrail.record('User Registered', user._id);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// User login with biometric support
exports.login = async (req, res) => {
  try {
    const { email, password, biometricData } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (biometricData && !verifyBiometricData(user, biometricData)) {
      return res.status(401).json({ message: 'Biometric verification failed' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    logEvent('User Logged In', { userId: user._id });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Assign role to a user
exports.assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    await assignRole(userId, role);
    logEvent('Role Assigned', { userId, role });
    res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
    await sendEmail(email, 'Password Reset', `Your reset token: ${resetToken}`);

    logEvent('Password Reset Requested', { userId: user._id });
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Social login (Google)
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: 'Google login successful', token });
};

module.exports = exports;
