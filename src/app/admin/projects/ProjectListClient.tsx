'use client';

import { useState } from 'react';
import { Project } from '@prisma/client';
import { useRouter } from 'next/navigation';
// import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { ProjectCard } from '@/components/project/ProjectCard';

interface ProjectListClientProps {
  initialProjects: {
    projects: Project[];
    pagination: {
      total: number;
      pages: number;
      page: number;
      limit: number;
    };
  };
}

export function ProjectListClient({ initialProjects }: ProjectListClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects.projects || []);

  const handleDelete = async (projectId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((project) => project.id !== projectId));
      toast.success('Project deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (projectId: string) => {
    router.push(`/admin/projects/${projectId}/edit`);
  };

  const handleTogglePublish = async (projectId: string, published: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, published: !published }
            : project
        )
      );
      toast.success('Project updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Icons name="spinner" className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => router.push('/admin/projects/new')}>
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">
            Get started by creating a new project.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isAdmin
            />
          ))}
        </div>
      )}
    </div>
  );
}
