// backend/src/config/db.js - Database Configuration for AgriVision System
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const winston = require('winston');
const { CloudWatchLogs, CloudWatch, SNS } = require('aws-sdk');
const axios = require('axios');
dotenv.config();

// CloudWatch Logs setup
const cloudWatchLogs = new CloudWatchLogs({
  region: process.env.AWS_REGION || 'us-east-1'
});

const cloudWatch = new CloudWatch({
  region: process.env.AWS_REGION || 'us-east-1'
});

const sns = new SNS({
  region: process.env.AWS_REGION || 'us-east-1'
});

const logEvent = (level, message) => {
  cloudWatchLogs.putLogEvents({
    logGroupName: process.env.AWS_LOG_GROUP || 'AgriVisionLogs',
    logStreamName: process.env.AWS_LOG_STREAM || `DBLogs-${new Date().toISOString().split('T')[0]}`,
    logEvents: [{
      message: JSON.stringify({ level, message, timestamp: new Date().toISOString() }),
      timestamp: new Date().getTime()
    }]
  }).promise().catch(err => console.error('CloudWatch logging error:', err));
};

const putMetricData = (metricName, value, dimensions = []) => {
  cloudWatch.putMetricData({
    MetricData: [
      {
        MetricName: metricName,
        Unit: 'Count',
        Value: value,
        Dimensions: dimensions
      }
    ],
    Namespace: 'AgriVision/MongoDB'
  }).promise().catch(err => console.error('CloudWatch metric error:', err));
};

const sendSNSAlert = (subject, message) => {
  sns.publish({
    TopicArn: process.env.AWS_SNS_TOPIC_ARN,
    Message: message,
    Subject: subject
  }).promise().then(() => {
    console.log('🚨 SNS Alert sent:', subject);
  }).catch(err => console.error('❌ SNS Alert error:', err));
};

const sendSlackAlert = async (level, message) => {
  try {
    const payload = {
      text: `*🚨 AgriVision System Alert*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*📢 Alert Level:* ${level.toUpperCase()}\n*🌿 Project:* AgriVision\n*🌍 Environment:* ${process.env.NODE_ENV || 'development'}\n*⏳ Timestamp:* ${new Date().toISOString()}\n*💬 Message:* ${message}`
          }
        }
      ]
    };
    await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
    console.log('✅ Enhanced Slack alert sent');
  } catch (err) {
    console.error('❌ Slack alert error:', err);
  }
};

const createCloudWatchAlarm = async () => {
  try {
    await cloudWatch.putMetricAlarm({
      AlarmName: 'FailedConnectionsAlarm',
      MetricName: 'FailedConnections',
      Namespace: 'AgriVision/MongoDB',
      Statistic: 'Sum',
      Period: 300,
      EvaluationPeriods: 1,
      Threshold: 5,
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      AlarmActions: [process.env.AWS_SNS_TOPIC_ARN],
      AlarmDescription: 'Triggered when there are 5 or more failed DB connections in 5 minutes',
      TreatMissingData: 'notBreaching',
      Tags: [
        { Key: 'Project', Value: 'AgriVision' },
        { Key: 'Environment', Value: process.env.NODE_ENV || 'development' }
      ]
    }).promise();
    console.log('✅ CloudWatch Alarm for Failed Connections set up');
  } catch (err) {
    console.error('❌ Error setting up CloudWatch Alarm:', err);
  }
};

const startTimer = () => process.hrtime();
const endTimer = (start) => {
  const [seconds, nanoseconds] = process.hrtime(start);
  return (seconds * 1000) + (nanoseconds / 1e6); // Convert to milliseconds
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/db.log' }),
    new winston.transports.Stream({
      stream: { write: (message) => logEvent('info', message) }
    })
  ]
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrivisionDB';
const MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES, 10) || 5;
const RETRY_INTERVAL_MS = parseInt(process.env.DB_RETRY_INTERVAL_MS, 10) || 1000;

const connectDB = async (attempts = 0) => {
  const start = startTimer();
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT_MS, 10) || 10000,
      serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT_MS, 10) || 5000,
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS, 10) || 45000,
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 10,
      retryWrites: true,
    });
    const connectionDuration = endTimer(start);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host} (Duration: ${connectionDuration}ms)`);
    logEvent('success', `Connected to MongoDB at ${conn.connection.host} in ${connectionDuration}ms`);
    putMetricData('SuccessfulConnections', 1, [{ Name: 'Environment', Value: process.env.NODE_ENV || 'development' }]);
    putMetricData('ConnectionDuration', connectionDuration, [{ Name: 'Environment', Value: process.env.NODE_ENV || 'development' }]);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    logEvent('error', error.message);
    putMetricData('ConnectionErrors', 1, [{ Name: 'Environment', Value: process.env.NODE_ENV || 'development' }]);
    sendSNSAlert('MongoDB Connection Error', error.message);
    sendSlackAlert('error', `MongoDB Connection Error: ${error.message}`);
    if (attempts < MAX_RETRIES) {
      const nextRetryInterval = RETRY_INTERVAL_MS * Math.pow(2, attempts);
      logger.warn(`🔄 Retrying connection... Attempt ${attempts + 1}/${MAX_RETRIES} in ${nextRetryInterval / 1000}s`);
      setTimeout(() => connectDB(attempts + 1), nextRetryInterval);
    } else {
      logger.error('❌ Max retry attempts reached. Exiting...');
      logEvent('critical', 'Max retry attempts reached');
      putMetricData('FailedConnections', 1, [{ Name: 'Environment', Value: process.env.NODE_ENV || 'development' }]);
      sendSNSAlert('Critical: Max DB Retry Attempts Reached', 'MongoDB connection retries exhausted.');
      sendSlackAlert('critical', 'Max DB Retry Attempts Reached');
      process.exit(1);
    }
  }
};

createCloudWatchAlarm();

module.exports = connectDB;
