'use client';

import { useRouter } from 'next/navigation';
import { Blog } from '@prisma/client';
import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { toast } from '@/components/toast';
import { useUser } from '@/hooks/use-user';
import { useEffect } from 'react';

interface BlogEditorClientProps {
  blog: Blog;
}

export function BlogEditorClient({ blog }: BlogEditorClientProps) {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useUser();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: 'Unauthorized',
        message: 'You must be an admin to access this page',
        type: 'error'
      });
      router.push('/');
    }
  }, [isLoading, isAdmin, router]);

  const handleSave = async (data: any) => {
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      toast({
        title: 'Success',
        message: 'Blog post updated successfully',
        type: 'success'
      });
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to update blog post',
        type: 'error'
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <BlogEditor blog={blog} onSave={handleSave} />;
}
