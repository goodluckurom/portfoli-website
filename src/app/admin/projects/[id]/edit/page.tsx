import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/admin/ProjectForm';
import { getSession } from '@/lib/auth';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
  });
  return project;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  
   // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50 mb-8">
        Edit Project: {project.title}
      </h1>
      <ProjectForm project={project} isEditing />
    </div>
  );
}
