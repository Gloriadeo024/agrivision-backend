// backend/src/context/NotificationContext.js - Advanced Real-time Notification Management
const { createContext, useState, useEffect } = require('react');

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications((prev) => [
      ...prev, 
      { 
        ...notification, 
        id: Date.now(), 
        timestamp: new Date().toISOString(), 
        read: false, 
        priority: notification.priority || 'normal' 
      }
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const getHighPriorityNotifications = () => {
    return notifications.filter((notif) => notif.priority === 'high');
  };

  const getNotificationsByType = (type) => {
    return notifications.filter((notif) => notif.type === type);
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getUnreadCount = () => {
    return notifications.filter((notif) => !notif.read).length;
  };

  const getPriorityCount = (priority) => {
    return notifications.filter((notif) => notif.priority === priority).length;
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        getHighPriorityNotifications,
        getNotificationsByType,
        markAsRead,
        getUnreadCount,
        getPriorityCount,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

module.exports = { NotificationContext, NotificationProvider };
