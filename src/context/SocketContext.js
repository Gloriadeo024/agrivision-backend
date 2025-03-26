// backend/src/context/SocketContext.js - Real-time WebSocket management with custom events, heartbeat pings, dynamic rooms, and animated notifications for AgriVision
const { createContext, useState, useEffect } = require('react');
const io = require('socket.io-client');

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.SOCKET_SERVER_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('%c✅ Connected to WebSocket server', 'color: green; font-weight: bold;');
      startHeartbeat(newSocket);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.warn('%c⚠️ Disconnected from WebSocket server', 'color: orange; font-weight: bold;');
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
      animateNotification('New Message', message);
    });

    newSocket.on('error', (error) => {
      console.error('%c❌ WebSocket error:', 'color: red; font-weight: bold;', error);
    });

    newSocket.on('customEvent', (data) => {
      console.log('%c✨ Received custom event:', 'color: purple; font-weight: bold;', data);
      animateNotification('Custom Event', data.message || 'No message provided');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const startHeartbeat = (socket) => {
    setInterval(() => {
      if (socket && socket.connected) {
        socket.emit('heartbeat', { time: new Date().toISOString() });
      }
    }, 30000); // Ping server every 30 seconds
  };

  const sendMessage = (event, data) => {
    if (socket) {
      socket.emit(event, data);
      animateNotification('Sent Message', `Event: ${event}`);
    }
  };

  const joinRoom = (room) => {
    if (socket) {
      socket.emit('joinRoom', room);
      console.log(`%c🏠 Joined room: ${room}`, 'color: blue; font-weight: bold;');
      animateNotification('Room Joined', room);
    }
  };

  const leaveRoom = (room) => {
    if (socket) {
      socket.emit('leaveRoom', room);
      console.log(`%c🚪 Left room: ${room}`, 'color: gray; font-weight: bold;');
      animateNotification('Room Left', room);
    }
  };

  const animateNotification = (title, message) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      new Notification(title, { body: message });
    } else {
      console.log('%c🔔 Notification:', 'color: gold; font-weight: bold;', title, message);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, messages, sendMessage, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

module.exports = { SocketContext, SocketProvider };
