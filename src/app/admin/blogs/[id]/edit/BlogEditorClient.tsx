'use client';

import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { Blog } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BlogEditorClientProps {
  blog: Blog;
}

export function BlogEditorClient({ blog }: BlogEditorClientProps) {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      toast.success('Blog updated successfully');
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
      throw error;
    }
  };

  return <BlogEditor blog={blog} onSave={handleSave} />;
}
