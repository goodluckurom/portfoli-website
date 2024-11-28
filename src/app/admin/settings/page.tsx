import React from 'react';
import SettingsForm from './SettingsForm';
import { redirect } from 'next/navigation';
import { getSession, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getUserSettings() {
  const session = await getSession();

  if (!session || !isAdmin(session)) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    include: {
      socialLinks: true,
    },
  });

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}

export default async function AdminSettingsPage() {
  const user = await getUserSettings();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
