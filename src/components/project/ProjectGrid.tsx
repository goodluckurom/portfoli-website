import { ProjectWithDetails } from '@/types';
import { ProjectCard } from './ProjectCard';
import {motion}  from 'framer-motion'

interface ProjectGridProps {
  projects: ProjectWithDetails[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project,index) => (
        <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
          
        <ProjectCard key={project.id} project={project} />
            </motion.div>
      ))}
    </div>
  );
}
