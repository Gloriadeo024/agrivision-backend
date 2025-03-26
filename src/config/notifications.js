// backend/src/config/notifications.js - Handles all alert systems (Slack, Email, SMS, Push, SNS)
const axios = require('axios');
const { SNS } = require('aws-sdk');

const sns = new SNS({ region: process.env.AWS_REGION || 'us-east-1' });

const sendSlackAlert = async (level, message) => {
  try {
    const payload = {
      text: `*🚨 AgriVision Alert:* ${level.toUpperCase()} - ${message}`
    };
    await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
    console.log('✅ Slack alert sent');
  } catch (err) {
    console.error('❌ Slack alert error:', err);
  }
};

const sendSNSAlert = async (subject, message) => {
  try {
    await sns.publish({
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Message: message,
      Subject: subject
    }).promise();
    console.log('✅ SNS alert sent');
  } catch (err) {
    console.error('❌ SNS alert error:', err);
  }
};

module.exports = { sendSlackAlert, sendSNSAlert };
