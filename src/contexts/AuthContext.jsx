import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await api.get('/profile');
      setUser(response.data);
    } catch (err) {
      localStorage.removeItem('auth_token');
      setError('Session expired');
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      
      const token = response.data.access_token || response.data.token;
      const userData = response.data.user;
      
      if (!token) {
        throw new Error("Authentication token not found in response");
      }
      
      localStorage.setItem('auth_token', token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    error,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}