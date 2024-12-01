import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SkillListClient } from './SkillListClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin/skills');

async function getSkills() {
  const skills = await prisma.skill.findMany({
    orderBy: [
      { category: 'asc' },
      { name: 'asc' },
    ],
  });
  return skills;
}

export default async function AdminSkillsPage() {
  // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  const skills = await getSkills();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
          Skills
        </h1>
        <Link
          href="/admin/skills/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add Skill
        </Link>
      </div>

      <SkillListClient skills={skills} />
    </div>
  );
}
