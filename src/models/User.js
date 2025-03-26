// models/User.js - User Model for AgriVision System
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['farmer', 'admin', 'researcher', 'supplier'], default: 'farmer' },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  isActive: { type: Boolean, default: true },
  profileCompleted: { type: Boolean, default: false },
  geolocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorCode: String,
  twoFactorCodeExpire: Date,
  lastPasswordChange: { type: Date, default: Date.now },
  trustedDevices: [
    {
      deviceId: String,
      deviceName: String,
      lastUsed: { type: Date, default: Date.now }
    }
  ],
  sessionExpiration: { type: Number, default: 3600 }, // Auto logout after 1 hour
  userActivityInsights: {
    recentActions: [
      {
        action: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  loginAttempts: { type: Number, default: 0 },
  lastLogin: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  auditLogs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      ip: String,
      deviceInfo: String,
      browser: String,
    }
  ],
  subscriptionPlan: { type: String, enum: ['free', 'premium'], default: 'free' },
  referralCode: { type: String },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  securityQuestions: [
    {
      question: String,
      answerHash: String
    }
  ],
  activeSessions: [
    {
      sessionId: String,
      deviceInfo: String,
      ip: String,
      lastActive: { type: Date, default: Date.now }
    }
  ],
  apiAccessTokens: [
    {
      token: String,
      createdAt: { type: Date, default: Date.now },
      expiresAt: { type: Date }
    }
  ],
  biometricEnabled: { type: Boolean, default: false },
  emergencyContacts: [
    {
      name: String,
      phone: String,
      relation: String
    }
  ],
  contentFlags: [
    {
      reason: String,
      flaggedAt: { type: Date, default: Date.now }
    }
  ],
  engagementMetrics: {
    logins: { type: Number, default: 0 },
    interactions: { type: Number, default: 0 }
  },
  offlineMode: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexing for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ tenantId: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, tenantId: this.tenantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Log user activity
UserSchema.methods.logAction = function (action, ip, deviceInfo, browser) {
  this.auditLogs.push({ action, ip, deviceInfo, browser });
};

// Soft delete user (deactivate instead of removing from DB)
UserSchema.methods.softDelete = function () {
  this.isActive = false;
};

module.exports = mongoose.model('User', UserSchema);
