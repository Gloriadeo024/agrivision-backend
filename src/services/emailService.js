// backend/src/emailService.js - AI-Integrated Email Service for AgriVision

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { generateDisasterResponsePlan, generateCropRecommendations, analyzeSoilData } = require('./services/chatbotService');
const { getRealTimeWeather } = require('./services/weatherService');
const { getMarketTrends, getPredictivePricing, getSupplyDemandForecast } = require('./services/marketService');

dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text, html });
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

// AI-powered disaster alert email
const sendDisasterAlert = async (userEmail, weatherData, soilData) => {
  try {
    const aiResponse = await generateDisasterResponsePlan(weatherData, soilData);
    await sendEmail(
      userEmail,
      '🚨 Urgent: AI-Driven Disaster Response Plan',
      `Dear farmer,\n\nOur AI system has analyzed current weather and soil conditions and recommends the following actions:\n\n${aiResponse}\n\nStay safe,\nAgriVision Team`,
      `<p>Dear farmer,</p><p>Our AI system has analyzed current weather and soil conditions and recommends the following actions:</p><p>${aiResponse}</p><p>Stay safe,<br/>AgriVision Team</p>`
    );
  } catch (error) {
    console.error('Error sending disaster alert:', error.message);
  }
};

// AI-powered crop recommendation email
const sendCropRecommendations = async (userEmail, soilType, climate, location) => {
  try {
    const recommendations = await generateCropRecommendations(soilType, climate, location);
    await sendEmail(
      userEmail,
      '🌿 AI-Powered Crop Recommendations',
      `Hello! Based on your soil and climate data, we recommend planting the following crops this season:\n\n${recommendations}\n\nHappy farming,\nAgriVision Team`,
      `<p>Hello!</p><p>Based on your soil and climate data, we recommend planting the following crops this season:</p><p>${recommendations}</p><p>Happy farming,<br/>AgriVision Team</p>`
    );
  } catch (error) {
    console.error('Error sending crop recommendations:', error.message);
  }
};

// AI-powered soil health insights email
const sendSoilHealthInsights = async (userEmail, soilData) => {
  try {
    const aiResponse = await analyzeSoilData(soilData);
    await sendEmail(
      userEmail,
      '🌾 AI-Driven Soil Health Insights',
      `Hello! Based on your soil data, our AI system has provided the following insights:\n\n${aiResponse}\n\nStay informed,\nAgriVision Team`,
      `<p>Hello!</p><p>Based on your soil data, our AI system has provided the following insights:</p><p>${aiResponse}</p><p>Stay informed,<br/>AgriVision Team</p>`
    );
  } catch (error) {
    console.error('Error sending soil health insights:', error.message);
  }
};

// AI-powered market trend insights email with predictive pricing and supply-demand forecasts
const sendMarketTrendsEmail = async (userEmail, location, cropType) => {
  try {
    const marketTrends = await getMarketTrends(location, cropType);
    const predictivePricing = await getPredictivePricing(location, cropType);
    const supplyDemandForecast = await getSupplyDemandForecast(location, cropType);

    await sendEmail(
      userEmail,
      '📈 AI-Driven Market Insights',
      `Hello! Here are the latest AI-analyzed market trends for ${cropType} in ${location}:\n\nMarket Trends: ${marketTrends}\nPredictive Pricing: ${predictivePricing}\nSupply-Demand Forecast: ${supplyDemandForecast}\n\nStay ahead in the market,\nAgriVision Team`,
      `<p>Hello!</p><p>Here are the latest AI-analyzed market insights for <strong>${cropType}</strong> in <strong>${location}</strong>:</p><p>Market Trends: ${marketTrends}</p><p>Predictive Pricing: ${predictivePricing}</p><p>Supply-Demand Forecast: ${supplyDemandForecast}</p><p>Stay ahead in the market,<br/>AgriVision Team</p>`
    );
  } catch (error) {
    console.error('Error sending market trends email:', error.message);
  }
};

// Welcome email for new users
const sendWelcomeEmail = async (userEmail, userName) => {
  await sendEmail(
    userEmail,
    '🌿 Welcome to AgriVision!',
    `Hello ${userName},\n\nWelcome to AgriVision! We're thrilled to have you on board. Explore AI-powered insights for better farming.\n\nBest regards,\nThe AgriVision Team`,
    `<p>Hello ${userName},</p><p>Welcome to <strong>AgriVision</strong>! We're thrilled to have you on board. Explore AI-powered insights for better farming.</p><p>Best regards,<br/>The AgriVision Team</p>`
  );
};

module.exports = { sendEmail, sendDisasterAlert, sendCropRecommendations, sendSoilHealthInsights, sendMarketTrendsEmail, sendWelcomeEmail };
