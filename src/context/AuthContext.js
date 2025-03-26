import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Check if token is expired
      if (expiry && Date.now() < parseInt(expiry)) {
        validateToken(token);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const res = await axios.get('/api/auth/validate-token');
      setUser(res.data.user);
      startSessionTimer();
    } catch (err) {
      logout();
    }
  };

  const startSessionTimer = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry) {
      const timeLeft = parseInt(expiry) - Date.now();
      if (timeLeft > 0) {
        setSessionTimeout(setTimeout(logout, timeLeft));
      }
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser({
        ...res.data.user,
        isEmailVerified: res.data.user.isEmailVerified
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      // Set token with expiry
      const expiry = Date.now() + TOKEN_EXPIRY;
      if (rememberMe) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('tokenExpiry', expiry.toString());
      } else {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('tokenExpiry', expiry.toString());
      }
      
      startSessionTimer();
      setError(null);
      return res.data;
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'An error occurred');
      }
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setError(null);
      return res.data;
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many registration attempts. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'An error occurred');
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiry');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 