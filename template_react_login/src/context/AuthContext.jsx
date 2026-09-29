import { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage (persistent) or sessionStorage (transient) on mount
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }

    setLoading(false);
  }, []);

  // Poll server to check if this token is still the active session.
  useEffect(() => {
    if (!token) return;

    const checkSessionStatus = async () => {
      try {
        await apiClient.get('/auth/session-status');
      } catch (err) {
        console.warn('Session verification check status:', err.message);
      }
    };

    checkSessionStatus();
    const intervalId = setInterval(checkSessionStatus, 15000);
    return () => clearInterval(intervalId);
  }, [token]);

  const login = (userData, authToken, rememberMe = true) => {
    setUser(userData);
    setToken(authToken);

    if (rememberMe) {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('remember_me');
    }

    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember_me');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
