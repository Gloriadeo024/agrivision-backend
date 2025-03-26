// src/utils/cloudwatch.js - CloudWatch Integration
const { CloudWatchLogs, CloudWatch } = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const cloudWatchLogs = new CloudWatchLogs({ region: process.env.AWS_REGION || 'us-east-1' });
const cloudWatch = new CloudWatch({ region: process.env.AWS_REGION || 'us-east-1' });

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
    MetricData: [{
      MetricName: metricName,
      Unit: 'Count',
      Value: value,
      Dimensions: dimensions
    }],
    Namespace: 'AgriVision/MongoDB'
  }).promise().catch(err => console.error('CloudWatch metric error:', err));
};

module.exports = { logEvent, putMetricData };
