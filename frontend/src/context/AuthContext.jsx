import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

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
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken') || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken') || null
  );

  // Configure axios defaults
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // Check if user is logged in on mount
  useEffect(() => {
    if (accessToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      });
      const { user, accessToken, refreshToken } = response.data.data;

      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return false;

    try {
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      const { accessToken: newAccessToken } = response.data.data;

      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

