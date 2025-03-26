const axios = require('axios');

const sendSlackAlert = async (level, message) => {
  try {
    const payload = {
      text: `*🚨 AgriVision System Alert*`,
      attachments: [
        {
          color: level === 'critical' ? '#FF0000' : level === 'error' ? '#FFA500' : '#36A64F',
          fields: [
            { title: 'Level', value: level.toUpperCase(), short: true },
            { title: 'Environment', value: process.env.NODE_ENV || 'development', short: true },
            { title: 'Timestamp', value: new Date().toISOString(), short: false },
            { title: 'Message', value: message, short: false }
          ]
        }
      ]
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
    console.log('✅ Slack alert sent:', level);
  } catch (err) {
    console.error('❌ Slack alert error:', err.message);
  }
};

module.exports = sendSlackAlert;
