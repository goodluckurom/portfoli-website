'use client';

import { ProjectEditor } from "@/components/admin/project/ProjectEditor";
import { toast } from "sonner";
import { ProjectFormValues } from "@/types/project";

export default function CreateProjectPage() {
  const handleSave = async (data: ProjectFormValues) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }

      const result = await response.json();
      toast.success('Project created successfully');
      return result;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(error.message || 'Failed to create project');
      throw error;
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <ProjectEditor onSave={handleSave} />
    </div>
  );
}
