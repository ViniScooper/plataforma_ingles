import { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from sessionStorage on mount
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Poll server to check if this token is still the active session.
  // If the user logs in from another device/browser, it updates the token in the DB,
  // causing this check to fail and trigger the log out automatically.
  useEffect(() => {
    if (!token) return;

    const checkSessionStatus = async () => {
      try {
        await apiClient.get('/auth/session-status');
      } catch (err) {
        // Errors like 401 SESSION_EXPIRED are handled by the axios response interceptor in apiClient.js
        console.warn('Session verification check status:', err.message);
      }
    };

    // Run immediately on auth change
    checkSessionStatus();

    const intervalId = setInterval(checkSessionStatus, 10000);
    return () => clearInterval(intervalId);
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
