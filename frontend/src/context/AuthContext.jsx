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
        // Try to verify token with backend
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

  // New registration with OTP
  const sendVerificationOTP = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/send-verification-otp', userData);
      console.log('Send OTP response:', response.data);
      return { success: true, email: response.data.email };
    } catch (err) {
      console.error('Send OTP error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const verifyOTPAndRegister = async (email, otp) => {
    try {
      setError(null);
      const response = await api.post('/auth/verify-registration', { email, otp });
      console.log('Verify OTP response:', response.data);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        } else {
          localStorage.setItem('token', 'true');
        }
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Verification failed' };
    } catch (err) {
      console.error('Verify OTP error:', err);
      const errorMsg = err.response?.data?.message || 'Verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const resendOTP = async (email) => {
    try {
      setError(null);
      const response = await api.post('/auth/resend-otp', { email });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Forgot password with OTP
  const sendPasswordResetOTP = async (email) => {
    try {
      setError(null);
      const response = await api.post('/auth/send-otp', { email, type: 'password_reset' });
      return { success: true, email: response.data.email };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const verifyPasswordResetOTP = async (email, otp) => {
    try {
      setError(null);
      const response = await api.post('/auth/verify-otp', { email, otp, type: 'password_reset' });
      return { success: true, resetToken: response.data.resetToken };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid OTP';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      setError(null);
      const response = await api.post('/auth/reset-password', { resetToken, newPassword });
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        } else {
          localStorage.setItem('token', 'true');
        }
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
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
    logout,
    sendVerificationOTP,
    verifyOTPAndRegister,
    resendOTP,
    sendPasswordResetOTP,
    verifyPasswordResetOTP,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};