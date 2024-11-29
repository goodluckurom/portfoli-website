import { Metadata } from 'next';
import UsersClient from './UsersClient';

export const metadata: Metadata = {
  title: 'User Management - Admin Dashboard',
  description: 'Manage users of your platform',
};

export default async function UsersPage() {
  return (
    <div>
      <UsersClient />
    </div>
  );
}
