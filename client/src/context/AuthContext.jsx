// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.auth.me();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            setToken(null);
          }
        } catch (err) {
          console.warn('Failed to restore session:', err.message);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const demoLogin = async (role) => {
    const res = await api.auth.demoLogin(role);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    demoLogin,
    logout,
    isAuthenticated: !!user,
    isDiner: user?.role === 'diner',
    isMerchant: user?.role === 'merchant',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
