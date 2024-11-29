'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@prisma/client';
import { ProjectEditor } from '@/components/admin/project/ProjectEditor';
import { toast } from '@/components/toast';
import { ProjectFormValues } from '@/types/project';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

// Helper function to ensure project status is properly typed
function convertProjectToFormValues(project: Project): ProjectFormValues {
  return {
    ...project,
    status: project.status as 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED',
    github: project.github || undefined,
    link: project.link || undefined,
    slug: project.slug,
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          message: 'Failed to load project',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params.id]);

  const onSave = async (data: ProjectFormValues) => {
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update project');

      toast({
        title: 'Success',
        message: 'Project updated successfully',
        type: 'success',
      });
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        message: 'Failed to update project',
        type: 'error',
      });
    }
  };

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Project: {project.title}</h1>
      <ProjectEditor project={convertProjectToFormValues(project)} onSave={onSave} />
    </div>
  );
}
