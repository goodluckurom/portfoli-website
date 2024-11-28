import React from 'react';
import { prisma } from '@/lib/prisma';
import SkillsPageClient from './SkillsPageClient';

async function getSkills() {
  const skills = await prisma.skill.findMany({
    orderBy: [
      { category: 'asc' },
      { proficiency: 'desc' },
    ],
  });
  return skills;
}

function groupSkillsByCategory(skills: any[]) {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);
}

export default async function SkillsPage() {
  const skills = await getSkills();
  const groupedSkills = groupSkillsByCategory(skills);

  return <SkillsPageClient groupedSkills={groupedSkills} />;
}
