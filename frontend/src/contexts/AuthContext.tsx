import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'read-only';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (action: 'read' | 'write' | 'admin') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('finance_token'));
  const [loading, setLoading] = useState(true);

  const hasPermission = useCallback((action: 'read' | 'write' | 'admin'): boolean => {
    if (!user) return false;
    
    switch (action) {
      case 'read':
        return ['admin', 'user', 'read-only'].includes(user.role);
      case 'write':
        return ['admin', 'user'].includes(user.role);
      case 'admin':
        return user.role === 'admin';
      default:
        return false;
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('finance_token', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const data = await apiService.register(email, password, name);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('finance_token', data.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('finance_token');
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await apiService.verifyToken();
        setUser(userData.user);
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};