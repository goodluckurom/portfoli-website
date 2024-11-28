import { ProjectWithDetails } from '@/types';
import { ProjectCard } from './ProjectCard';

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
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
