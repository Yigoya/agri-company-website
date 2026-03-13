import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';
import type { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authApi.getMe()
        .then((u) => {
          setUser(u);
          localStorage.setItem('auth_user', JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokenData = await authApi.login(email, password);
    localStorage.setItem('auth_token', tokenData.access_token);
    localStorage.setItem('auth_user', JSON.stringify(tokenData.user));
    setUser(tokenData.user);
    return tokenData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return { user, isLoading, isAuthenticated, login, logout };
}
