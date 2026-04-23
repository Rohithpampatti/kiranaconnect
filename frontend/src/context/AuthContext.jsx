import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('checkAuth - token:', token);
    console.log('checkAuth - savedUser:', savedUser);
    
    if (token && savedUser) {
      try {
        // Verify token with backend
        const response = await api.get('/auth/me');
        if (response.data) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log('User verified:', response.data);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', 'true');
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email, password) => {
  try {
    setError(null);
    const response = await api.post('/auth/login', { email, password });
    console.log('Login API response:', response.data);
    
    if (response.data.user) {
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Store token from response body
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else {
        localStorage.setItem('token', 'true');
      }
      setUser(response.data.user);
      console.log('User set in state:', response.data.user);
      return { success: true, user: response.data.user };
    }
    return { success: false, error: 'Login failed' };
  } catch (err) {
    console.error('Login API error:', err);
    const errorMsg = err.response?.data?.message || 'Login failed';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }
};

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};