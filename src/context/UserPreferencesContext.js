// backend/src/context/UserPreferencesContext.js - Advanced user settings with real-time sync, adaptive themes, animations, dynamic colors, sound effects, and interactive flair
const { createContext, useState, useEffect } = require('react');
const { motion } = require('framer-motion');

const UserPreferencesContext = createContext();

const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      language: 'en',
      notificationsEnabled: true,
      priorityLevel: 'normal',
    };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    const darkModeListener = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      animateThemeChange(e.matches ? 'dark' : 'light');
    };
    darkModeListener.addEventListener('change', handleThemeChange);
    return () => darkModeListener.removeEventListener('change', handleThemeChange);
  }, []);

  const animateThemeChange = (theme) => {
    document.body.classList.add('theme-transition');
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#f4f4f4';
    document.body.style.color = theme === 'dark' ? '#f4f4f4' : '#1a1a1a';
    updatePreferences({ theme });
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 500);
  };

  const updatePreferences = (newPreferences) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
    if (newPreferences.notificationsEnabled) {
      playNotificationSound();
    }
  };

  const resetPreferences = () => {
    setPreferences({
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      language: 'en',
      notificationsEnabled: true,
      priorityLevel: 'normal',
    });
    localStorage.removeItem('userPreferences');
  };

  const syncWithServer = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to sync preferences:', error);
    }
  };

  const logPreferences = () => {
    console.table(preferences);
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.7;
    audio.play();
  };

  const gradientAnimation = {
    background: [
      'linear-gradient(45deg, #ff0000, #ff7300)',
      'linear-gradient(45deg, #ff7300, #ffeb00)',
      'linear-gradient(45deg, #ffeb00, #00ff00)',
      'linear-gradient(45deg, #00ff00, #00ffff)',
      'linear-gradient(45deg, #00ffff, #0000ff)',
      'linear-gradient(45deg, #0000ff, #800080)',
    ],
    transition: { duration: 5, repeat: Infinity, ease: 'linear' }
  };

  const soundEffects = {
    success: new Audio('/sounds/success.mp3'),
    error: new Audio('/sounds/error.mp3'),
    notification: new Audio('/sounds/notification.mp3'),
    click: new Audio('/sounds/click.mp3'),
    alert: new Audio('/sounds/alert.mp3')
  };

  const playSoundEffect = (type) => {
    if (soundEffects[type]) {
      soundEffects[type].volume = 0.7;
      soundEffects[type].play();
    }
  };

  const animateIcon = (element) => {
    if (element) {
      element.classList.add('icon-bounce');
      setTimeout(() => element.classList.remove('icon-bounce'), 1000);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences, syncWithServer, logPreferences, playNotificationSound, playSoundEffect, animateIcon }}>
      <motion.div style={{ minHeight: '100vh' }} animate={gradientAnimation}>
        {children}
      </motion.div>
    </UserPreferencesContext.Provider>
  );
};

module.exports = { UserPreferencesContext, UserPreferencesProvider };
