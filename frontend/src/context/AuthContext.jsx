import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res && res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Failed to restore auth session:', err.message);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    if (res && res.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      });
      return res.data;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res && res.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      });
      return res.data;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
