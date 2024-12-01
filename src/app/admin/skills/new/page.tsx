import React from 'react';
import SkillForm from '../_components/SkillForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewSkillPage() {
  // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
          Add New Skill
        </h1>
      </div>
      <SkillForm />
    </div>
  );
}
