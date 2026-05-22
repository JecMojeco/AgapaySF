import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse saved user:', error);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await api('/auth/me');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (error) {
        console.error('Session validation failed:', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // Global handler for auth failures (like deactivation)
  useEffect(() => {
    const handleAuthError = (event) => {
      if (event.detail?.status === 401 || event.detail?.status === 403) {
        if (user) {
          setUser(null);
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    window.addEventListener('api-auth-error', handleAuthError);
    return () => window.removeEventListener('api-auth-error', handleAuthError);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
