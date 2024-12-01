import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDynamicConfig } from '@/lib/dynamic';
import { ProfileClient } from './ProfileClient';

export const dynamic = getDynamicConfig('/profile');

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  return <ProfileClient user={session} />;
}
