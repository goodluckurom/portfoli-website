'use client';

import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { Blog } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type SerializedBlog = Omit<Blog, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

interface BlogEditorClientProps {
  blog: SerializedBlog;
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
        body: JSON.stringify({
          ...data,
          createdAt: blog.createdAt,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      toast.success('Blog updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    }
  };

  return <BlogEditor blog={blog} onSave={handleSave} />;
}
