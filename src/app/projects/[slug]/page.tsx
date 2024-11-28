import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProjectClient } from './ProjectDetailClient';
import { serializeMDX } from '@/lib/mdx';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    notFound();
  }

  const mdxSource = await serializeMDX(project.content);

  return <ProjectClient project={project} mdxSource={mdxSource} />;
}