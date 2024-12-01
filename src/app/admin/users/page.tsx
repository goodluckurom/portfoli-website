import { Metadata } from 'next';
import UsersClient from './UsersClient';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDynamicConfig } from '@/lib/dynamic';

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard',
  description: 'Manage users of your platform',
};

export const dynamic = getDynamicConfig('/admin/users');

export default async function UsersPage() {
   // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  return (
    <div>
      <UsersClient />
    </div>
  );
}
