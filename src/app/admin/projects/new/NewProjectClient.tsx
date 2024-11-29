'use client';

import { useRouter } from 'next/navigation';
import { toast } from '@/components/toast';
import { ProjectEditor } from '@/components/admin/project/ProjectEditor';

export function NewProjectClient() {
  const router = useRouter();
 



  const handleSave = async (data: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const project = await response.json();

      toast({
        title: 'Success',
        message: 'Project created successfully',
        type: 'success'
      });

      router.push(`/admin/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: 'Error',
        message: 'Failed to create project',
        type: 'error'
      });
    }
  };
  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <ProjectEditor onSave={handleSave} />
    </div>
  );
}
