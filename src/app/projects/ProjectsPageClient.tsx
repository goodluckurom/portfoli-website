'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProjectWithDetails } from '@/types';
import { ProjectGrid } from '@/components/project/ProjectGrid';

interface ProjectsPageClientProps {
  projects: ProjectWithDetails[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  return (
    <div className="container py-12">
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Projects</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Here are some of the projects I've worked on. Each project is built with
          a focus on solving real problems and implementing best practices.
        </p>
        <ProjectGrid projects={projects} />
      </motion.div>
    </div>
  );
}
