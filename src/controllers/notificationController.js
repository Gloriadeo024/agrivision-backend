// notificationController.js — Robust and Scalable
const Notification = require('./models/Notification');
const { logEvent } = require('./utils/logger');
const auditTrail = require('./utils/auditTrail');
const { categorizeError } = require('./utils/errorCategorizer');
const { sendPushNotification } = require('./utils/notificationUtils');
const rateLimiter = require('./utils/rateLimiter');
const { triggerWebhook } = require('./utils/webhookUtils');
const soundAlert = require('./utils/soundAlert');
const gradientAnimator = require('./utils/gradientAnimator');
const scheduleNotification = require('./utils/scheduleNotification');
const userReactions = require('./utils/userReactions');

// Send or schedule a notification with added flair
exports.sendNotification = rateLimiter(async (req, res) => {
  try {
    const { title, message, userId, priority, scheduleTime, reactions } = req.body;

    // Schedule notifications if a future time is provided
    if (scheduleTime) {
      await scheduleNotification(userId, title, message, priority, scheduleTime);
      logEvent('Notification Scheduled', { userId, title, priority, scheduleTime });
      return res.status(200).json({ message: 'Notification scheduled with flair!', scheduleTime });
    }

    await sendPushNotification(userId, title, message, priority);

    // Dynamic animations based on priority
    gradientAnimator.animate(priority);

    // Log event and audit trail
    logEvent('Notification Sent', { userId, title, priority });
    auditTrail.record('Notification Sent', userId, priority);

    // Trigger webhook for real-time tracking
    triggerWebhook('notification.sent', { userId, title, priority });

    // Sound alert for high-priority notifications
    if (priority === 'high') soundAlert.play('alert.mp3');

    // Add user reactions to the notification
    if (reactions && reactions.length > 0) {
      userReactions.recordReactions(userId, title, reactions);
      logEvent('User Reactions Recorded', { userId, title, reactions });
    }

    res.status(200).json({ message: 'Notification sent with extra flair!', priority });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
});

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId });

    res.status(200).json({ message: 'Notifications fetched successfully', notifications });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    logEvent('Notification Marked as Read', { id });
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    categorizeError(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
