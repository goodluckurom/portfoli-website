'use client';

import { useEffect } from 'react';
import { useAuth } from './use-auth';

export function useUser() {
  const auth = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await auth.checkAuth();
      } catch (error) {
        console.error('Error checking auth:', error);
        auth.setUser(null);
      }
    };

    if (!auth.user && !auth.isLoading) {
      checkAuth();
    }
  }, [auth]);

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: !!auth.user,
    isAdmin: auth.user?.role === 'ADMIN',
  };
}
