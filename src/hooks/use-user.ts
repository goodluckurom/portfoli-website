'use client';

import { useEffect } from 'react';
import { useAuth } from './use-auth';

export function useUser() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user && !auth.isLoading) {
      auth.checkAuth();
    }
  }, []);

  return {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: !!auth.user,
    isAdmin: auth.user?.role === 'ADMIN',
  };
}
