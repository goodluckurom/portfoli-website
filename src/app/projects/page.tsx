import React from 'react';
import { prisma } from '@/lib/prisma';
import ProjectsPageClient from './ProjectsPageClient';
import { ProjectWithDetails } from '@/types';

async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    where: {
      published: true,
    },
  }) as ProjectWithDetails[];

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsPageClient projects={projects} />;
}
