// Authentication hook
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/auth.types';
import { isAuthenticated, getAuthToken } from '@/utils/authOptions';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);

      if (isAuth) {
        // TODO: Fetch user profile from API
        // For now, just set loading to false
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement login logic
    throw new Error('Not implemented');
  };

  const logout = () => {
    // TODO: Implement logout logic
    setUser(null);
    setAuthenticated(false);
  };

  return {
    user,
    loading,
    authenticated,
    login,
    logout,
  };
}
