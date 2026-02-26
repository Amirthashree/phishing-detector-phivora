import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

export function useAuth() {
  const [, setLocation] = useLocation();
  
  const [username, setUsernameState] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  });

  const login = useCallback((user: string) => {
    localStorage.setItem('username', user);
    setUsernameState(user);
    setLocation('/');
  }, [setLocation]);

  const logout = useCallback(() => {
    localStorage.removeItem('username');
    setUsernameState(null);
    setLocation('/login');
  }, [setLocation]);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsernameState(localStorage.getItem('username'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { username, login, logout, isAuthenticated: !!username };
}
