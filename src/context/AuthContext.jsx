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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
