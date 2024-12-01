import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SkillForm from '../../_components/SkillForm';
import { getSession } from '@/lib/auth';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin/skills/[id]/edit');

async function getSkill(id: string) {
  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill) notFound();
  return skill;
}

export default async function EditSkillPage({
  params,
}: {
  params: { id: string };
}) {
  // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  const skill = await getSkill(params.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
          Edit Skill
        </h1>
      </div>
      <SkillForm skill={skill} isEditing />
    </div>
  );
}
