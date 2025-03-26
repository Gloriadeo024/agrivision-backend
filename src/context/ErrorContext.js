// backend/src/context/ErrorContext.js - Enhanced error handling with animations, priority levels, retry logic, and sound alerts
const { createContext, useState, useCallback } = require('react');

const ErrorContext = createContext();

const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const reportError = useCallback((error, context = 'General', retryCallback = null) => {
    const errorReport = {
      message: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace available',
      context,
      timestamp: new Date().toISOString(),
      severity: error.severity || 'error',
      retryCallback
    };

    setErrors((prevErrors) => [...prevErrors, errorReport]);
    logError(errorReport);
    syncWithServer(errorReport);
    showErrorNotification(errorReport);
    playErrorSound(errorReport.severity);
  }, []);

  const logError = (errorReport) => {
    console.error(`❗ [Error]: ${errorReport.message} (${errorReport.context}) at ${errorReport.timestamp}`);
  };

  const syncWithServer = async (errorReport) => {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      });
    } catch (err) {
      console.error('❌ Failed to sync error:', err);
    }
  };

  const showErrorNotification = (errorReport) => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <strong>🚨 Error:</strong> ${errorReport.message} <br/>
      <em>Context:</em> ${errorReport.context} <br/>
      <em>Severity:</em> ${errorReport.severity}
    `;
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.background = getGradient(errorReport.severity);
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0px 0px 30px rgba(255,0,0,0.9)';
    notification.style.animation = 'pulse 1.5s infinite';

    if (errorReport.retryCallback) {
      const retryButton = document.createElement('button');
      retryButton.textContent = 'Retry';
      retryButton.style.marginLeft = '10px';
      retryButton.style.padding = '5px 10px';
      retryButton.style.background = 'white';
      retryButton.style.color = 'red';
      retryButton.style.border = 'none';
      retryButton.style.borderRadius = '5px';
      retryButton.style.cursor = 'pointer';
      retryButton.addEventListener('click', errorReport.retryCallback);
      notification.appendChild(retryButton);
    }

    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 7000);
  };

  const getGradient = (severity) => {
    switch (severity) {
      case 'critical': return 'linear-gradient(135deg, #FF0000, #8B0000)';
      case 'error': return 'linear-gradient(135deg, #FFA500, #FF4500)';
      case 'warning': return 'linear-gradient(135deg, #FFFF00, #FFD700)';
      default: return 'linear-gradient(135deg, #36A64F, #2E8B57)';
    }
  };

  const playErrorSound = (severity) => {
    const sound = new Audio();
    switch (severity) {
      case 'critical':
        sound.src = '/sounds/critical-alert.mp3';
        break;
      case 'error':
        sound.src = '/sounds/error-alert.mp3';
        break;
      case 'warning':
        sound.src = '/sounds/warning-alert.mp3';
        break;
      default:
        sound.src = '/sounds/info-alert.mp3';
    }
    sound.play();
  };

  return (
    <ErrorContext.Provider value={{ errors, reportError }}>
      {children}
    </ErrorContext.Provider>
  );
};

module.exports = { ErrorContext, ErrorProvider };

// CSS Animation for error notification
const style = document.createElement('style');
style.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
