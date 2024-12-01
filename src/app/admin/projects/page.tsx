import React from 'react';
import { prisma } from '@/lib/prisma';
import { ProjectListClient } from './ProjectListClient';
import { getSession, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin/projects');

async function getData() {
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.project.count(),
  ]);

  return {
    projects,
    pagination: {
      total,
      pages: Math.ceil(total / 10),
      page: 1,
      limit: 10,
    },
  };
}

export default async function AdminProjectsPage() {
    // Server-side authentication check
  const session = await getSession();
  
  if (!session || !isAdmin(session)) {
    redirect("/");
  }
  const data = await getData();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectListClient initialProjects={data} />
    </div>
  );
}
