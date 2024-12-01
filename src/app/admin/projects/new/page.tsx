import React from 'react';
import { NewProjectClient } from './NewProjectClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin/projects/new');

export default async function NewProjectPage() {
   // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  return <NewProjectClient />;
}
