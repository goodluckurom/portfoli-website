import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProjectClient } from './ProjectDetailClient';
import { serializeMDX } from '@/lib/mdx';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/projects/[slug]');

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    notFound();
  }

  const mdxSource = await serializeMDX(project.content);

  return <ProjectClient project={project} mdxSource={mdxSource} />;
}