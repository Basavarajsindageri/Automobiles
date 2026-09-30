import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStoredUser, getStoredToken } from '../utils/storage';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.loginUser(credentials);
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.registerUser(userData);
      setUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logoutUser();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data) => {
    setLoading(true);
    try {
      return await authApi.forgotPassword(data);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setLoading(true);
    try {
      return await authApi.verifyOtp(data);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      return await authApi.resetPassword(data);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.updateProfile(data);
      if (res.user) setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    try {
      return await authApi.changePassword(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
