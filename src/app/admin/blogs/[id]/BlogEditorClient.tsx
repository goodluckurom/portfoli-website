'use client';

import { useRouter } from 'next/navigation';
import { Blog } from '@prisma/client';
import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/use-user';
import { useEffect } from 'react';

type SerializedBlog = Omit<Blog, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

interface BlogEditorClientProps {
  blog: SerializedBlog;
}

export function BlogEditorClient({ blog }: BlogEditorClientProps) {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'You do not have permission to edit blogs.',
        variant: 'destructive',
      });
      router.push('/');
    }
  }, [isLoading, isAdmin, router, toast]);

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

      toast({
        title: 'Success',
        description: 'Blog updated successfully',
      });

      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog',
        variant: 'destructive',
      });
    }
  };

  return <BlogEditor blog={blog} onSave={handleSave} />;
}
