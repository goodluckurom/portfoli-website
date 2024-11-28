import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SkillForm from '../../_components/SkillForm';

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
