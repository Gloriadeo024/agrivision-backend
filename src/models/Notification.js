// models/Notification.js - Enhanced Notification Model for AgriVision System
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Supports multiple users
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  link: { type: String, default: null }, // Optional link for action-based notifications
  expiresAt: { type: Date, default: null }, // Expiration date for temporary notifications
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' }, // Added 'critical' priority level
  urgency: { type: Number, min: 1, max: 5, default: 3 }, // Numeric urgency level
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Optional sender reference
  category: { type: String, enum: ['system', 'user', 'promotion', 'security'], default: 'system' }, // Added 'security' category
  deliveryMethod: { type: String, enum: ['email', 'sms', 'push', 'in-app'], default: 'push' }, // Added 'in-app' delivery method
  isScheduled: { type: Boolean, default: false }, // Flag for scheduled notifications
  scheduledTime: { type: Date, default: null }, // Time for scheduled notifications
  recurring: { type: Boolean, default: false }, // Flag for recurring notifications
  recurrenceInterval: { type: String, enum: ['daily', 'weekly', 'monthly', null], default: null }, // Interval for recurring notifications
  customRecurrenceDays: { type: Number, default: null }, // Allows custom intervals
  isDeleted: { type: Boolean, default: false }, // Soft delete flag
  acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track acknowledgments
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Store additional data dynamically
});

NotificationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

NotificationSchema.methods.markAsRead = function () {
  this.read = true;
  return this.save();
};

NotificationSchema.methods.markMultipleAsRead = async function (notificationIds) {
  return await this.model('Notification').updateMany(
    { _id: { $in: notificationIds } },
    { $set: { read: true } }
  );
};

NotificationSchema.methods.isExpired = function () {
  return this.expiresAt && this.expiresAt < new Date();
};

NotificationSchema.methods.autoCleanExpired = async function () {
  return await this.model('Notification').deleteMany({ expiresAt: { $lt: new Date() } });
};

NotificationSchema.methods.reschedule = function (newTime) {
  if (this.isScheduled) {
    this.scheduledTime = newTime;
    return this.save();
  }
  return Promise.reject(new Error('Notification is not scheduled.'));
};

NotificationSchema.methods.enableRecurrence = function (interval, customDays = null) {
  if (['daily', 'weekly', 'monthly'].includes(interval) || customDays) {
    this.recurring = true;
    this.recurrenceInterval = interval;
    this.customRecurrenceDays = customDays;
    return this.save();
  }
  return Promise.reject(new Error('Invalid recurrence interval.'));
};

NotificationSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

NotificationSchema.methods.acknowledge = function (userId) {
  if (!this.acknowledgedBy.includes(userId)) {
    this.acknowledgedBy.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

NotificationSchema.methods.addMetadata = function (key, value) {
  this.metadata[key] = value;
  return this.save();
};

module.exports = mongoose.model('Notification', NotificationSchema);
