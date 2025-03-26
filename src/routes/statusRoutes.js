// backend/src/routes/status.js - Health Check and Monitoring Endpoint for AgriVision System
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { SNS, SES } = require('aws-sdk');
const router = express.Router();

const sns = new SNS({ region: process.env.AWS_REGION || 'us-east-1' });
const ses = new SES({ region: process.env.AWS_REGION || 'us-east-1' });

const sendSlackAlert = async (message) => {
  try {
    const payload = {
      text: `🚨 *AgriVision System Alert*`,
      attachments: [
        {
          color: '#FF0000',
          fields: [
            { title: 'Alert', value: message, short: false },
            { title: 'Environment', value: process.env.NODE_ENV || 'development', short: true },
            { title: 'Timestamp', value: new Date().toISOString(), short: true }
          ]
        }
      ]
    };
    await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
    console.log('✅ Enhanced Slack alert sent');
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

const sendEmailAlert = async (subject, message) => {
  try {
    const emailBody = `
      <h1>🚨 AgriVision System Alert</h1>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `;

    await ses.sendEmail({
      Source: process.env.SES_EMAIL_SOURCE,
      Destination: { ToAddresses: process.env.ALERT_EMAIL_RECIPIENTS.split(',') },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: emailBody } }
      }
    }).promise();
    console.log('✅ Enhanced Email alert sent');
  } catch (err) {
    console.error('❌ Email alert error:', err);
  }
};

router.get('/status', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  let dbStatus = 'disconnected';

  switch (dbState) {
    case 0: dbStatus = 'disconnected'; break;
    case 1: dbStatus = 'connected'; break;
    case 2: dbStatus = 'connecting'; break;
    case 3: dbStatus = 'disconnecting'; break;
    default: dbStatus = 'unknown';
  }

  if (dbStatus === 'disconnected') {
    const alertMessage = 'The MongoDB database is currently disconnected. Please check immediately.';
    sendSlackAlert(alertMessage);
    sendSNSAlert('Database Disconnected', alertMessage);
    sendEmailAlert('Database Disconnected', alertMessage);
  }

  res.status(200).json({
    service: 'AgriVision System',
    status: 'running',
    dbStatus: dbStatus,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
