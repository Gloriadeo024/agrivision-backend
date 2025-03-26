// routes/auth.js - AI-Enhanced Authentication Routes for AgriVision

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import rateLimit from 'express-rate-limit';
import { sendSlackAlert, sendSNSAlert, sendEmailAlert } from '../utils/alerts.js';
import { sendSMS } from '../utils/sms.js';
import { sendPushNotification } from '../utils/pushNotifications.js';
import { broadcastEvent } from '../utils/websocket.js';
import { verifyBiometric, verifyVoice } from '../utils/biometricAuth.js';
import { calculateRiskScore, trackAnomalies } from '../utils/riskDetection.js';
import { register, login, logout, getProfile } from '../controllers/authController.js';

const router = express.Router();
const apiVersion = '/api/v1/auth';

// Rate Limiting Middleware
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,
  message: 'Too many login attempts. Please try again later.',
  headers: true
});

// MFA Function
const sendMFACode = async (email, phoneNumber) => {
  const mfaCode = Math.floor(100000 + Math.random() * 900000);
  console.log(`MFA Code for ${email}: ${mfaCode}`);
  try {
    const message = `🚨 AgriVision MFA Code\nYour code: ${mfaCode}`;
    await Promise.all([
      sendEmailAlert('Your MFA Code', message),
      sendSMS(phoneNumber, message),
      sendPushNotification(email, { title: 'MFA Code', body: `Your code: ${mfaCode}` })
    ]);
    broadcastEvent('mfa_triggered', { email, mfaCode });
  } catch (err) {
    console.error('❌ MFA error:', err);
    await sendEmailAlert('MFA Fallback', `Use this email code: ${mfaCode}`);
    broadcastEvent('mfa_failed', { email });
  }
};

// Login Route
router.post(`${apiVersion}/login`, loginLimiter, async (req, res) => {
  const { email, password, phoneNumber, biometricData, voiceSample, ipAddress, userAgent } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const riskScore = await calculateRiskScore(ipAddress, userAgent, email);
    await trackAnomalies(email, ipAddress, riskScore);
    if (riskScore > 80) return res.status(403).json({ message: 'High-risk login detected.' });

    const [biometricVerified, voiceVerified] = await Promise.all([
      verifyBiometric(user.biometricData, biometricData),
      verifyVoice(user.voiceSample, voiceSample)
    ]);
    if (!biometricVerified && !voiceVerified) return res.status(401).json({ message: 'Biometric or voice authentication failed.' });

    await sendMFACode(email, phoneNumber);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Login successful. Check your email for MFA code.' });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
