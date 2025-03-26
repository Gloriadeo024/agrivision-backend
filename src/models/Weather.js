const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['farmer', 'admin', 'researcher', 'supplier'],
    default: 'farmer',
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorCode: String,
  twoFactorCodeExpire: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  auditLogs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      ip: String,
      deviceInfo: String,
      browser: String,
    },
  ],
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  geolocation: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
});

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
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
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

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempts += 1;
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
};

// Check if profile is completed
UserSchema.methods.checkProfileCompletion = function () {
  if (this.name && this.email && this.role) {
    this.profileCompleted = true;
  } else {
    this.profileCompleted = false;
  }
};

module.exports = mongoose.model('User', UserSchema);
