// backend/src/config/cloudwatch.js - CloudWatch Alarms & Metrics configuration
const { CloudWatch, CloudWatchLogs } = require('aws-sdk');

const cloudWatch = new CloudWatch({ region: process.env.AWS_REGION || 'us-east-1' });
const cloudWatchLogs = new CloudWatchLogs({ region: process.env.AWS_REGION || 'us-east-1' });

const putMetricData = (metricName, value, dimensions = []) => {
  return cloudWatch.putMetricData({
    MetricData: [{ MetricName: metricName, Unit: 'Count', Value: value, Dimensions: dimensions }],
    Namespace: 'AgriVision'
  }).promise();
};

const logEvent = (logGroupName, logStreamName, message) => {
  return cloudWatchLogs.putLogEvents({
    logGroupName,
    logStreamName,
    logEvents: [{ message: JSON.stringify(message), timestamp: new Date().getTime() }]
  }).promise();
};

module.exports = { putMetricData, logEvent };
