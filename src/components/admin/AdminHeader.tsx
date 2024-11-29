'use client';

import { useEffect, useState } from 'react';
import { AdminHeaderClient } from './AdminHeaderClient';

export function AdminHeader() {
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        setUserImage(data.user?.image || null);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return <AdminHeaderClient userImage={userImage} />;
}