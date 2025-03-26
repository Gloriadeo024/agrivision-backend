// backend/src/context/AnalyticsContext.js - Real-time analytics with user session tracking, custom metric dashboards, dynamic data points, bold animations, and interactive flair
const { createContext, useState, useEffect } = require('react');
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AnalyticsContext = createContext();

const AnalyticsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [customMetrics, setCustomMetrics] = useState({});
  const [realTimeData, setRealTimeData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    startUserSession();
    trackPageLoad();
    const interval = setInterval(() => {
      fetchRealTimeData();
      updateChartData();
    }, 5000);
    return () => {
      endUserSession();
      clearInterval(interval);
    };
  }, []);

  const startUserSession = () => {
    const sessionId = generateSessionId();
    const startTime = new Date().toISOString();
    setUserSession({ sessionId, startTime });
    logEvent('🚀 User session started 🎉');
  };

  const endUserSession = () => {
    if (userSession) {
      logEvent('❌ User session ended 😢');
      setUserSession(null);
    }
  };

  const generateSessionId = () => 'session-' + Math.random().toString(36).substr(2, 9);

  const trackEvent = (eventName, data = {}) => {
    const event = { eventName, timestamp: new Date().toISOString(), ...data };
    setEvents((prevEvents) => [...prevEvents, event]);
    syncWithServer(event);
    showEventAnimation(eventName);
  };

  const trackPageLoad = () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    trackEvent('⚡ Page loaded', { loadTime });
  };

  const logEvent = (message) => console.log(`🔥 [Analytics]: ${message}`);

  const updateCustomMetrics = (metricName, value) => {
    setCustomMetrics((prevMetrics) => ({ ...prevMetrics, [metricName]: value }));
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const data = await response.json();
      setRealTimeData(data);
    } catch (error) {
      console.error('❗ Failed to fetch real-time data:', error);
    }
  };

  const updateChartData = () => {
    const labels = realTimeData.map((dataPoint) => new Date(dataPoint.timestamp).toLocaleTimeString());
    const values = realTimeData.map((dataPoint) => dataPoint.value);

    setChartData({
      labels,
      datasets: [
        {
          label: '📊 Real-time Metrics',
          data: values,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'linear-gradient(90deg, rgba(75,192,192,0.2) 0%, rgba(255,99,132,0.2) 100%)',
          tension: 0.4,
          pointBackgroundColor: '#ff6384',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff6384',
          borderDash: [5, 5],
          hoverBorderWidth: 3,
          hoverBorderColor: 'rgba(255, 165, 0, 1)',
          animations: {
            tension: {
              duration: 1000,
              easing: 'easeInOutBounce',
              from: 1,
              to: 0,
              loop: true
            },
            backgroundColor: {
              type: 'color',
              duration: 2000,
              easing: 'linear',
              from: 'rgba(75,192,192,0.2)',
              to: 'rgba(255,99,132,0.4)',
              loop: true
            }
          }
        }
      ]
    });
  };

  const showEventAnimation = (eventName) => {
    const eventElement = document.createElement('div');
    eventElement.textContent = `✨ ${eventName}`;
    eventElement.style.position = 'fixed';
    eventElement.style.top = '10px';
    eventElement.style.right = '10px';
    eventElement.style.background = 'rgba(0,0,0,0.7)';
    eventElement.style.color = 'white';
    eventElement.style.padding = '10px';
    eventElement.style.borderRadius = '5px';
    eventElement.style.zIndex = '1000';
    eventElement.style.boxShadow = '0px 0px 20px rgba(255,99,132,0.9)';
    eventElement.style.transform = 'scale(1)';
    eventElement.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.5)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ], {
      duration: 1000,
      iterations: Infinity
    });
    document.body.appendChild(eventElement);
    setTimeout(() => document.body.removeChild(eventElement), 3000);
  };

  const syncWithServer = async (eventData) => {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
    } catch (error) {
      console.error('❗ Failed to sync event:', error);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ events, userSession, customMetrics, realTimeData, chartData, trackEvent, updateCustomMetrics }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

module.exports = { AnalyticsContext, AnalyticsProvider };
