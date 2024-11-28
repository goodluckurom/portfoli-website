'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { toast } from '@/components/toast';
import { useUser } from '@/hooks/use-user';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export function NewBlogClient() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const { user, isLoading, isAdmin } = useUser();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Failed to check auth:', error);
        toast({
          title: 'Error',
          message: 'Failed to verify authentication',
          type: 'error'
        });
      }
    };

    initAuth();
  }, [checkAuth]);

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
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      const blog = await response.json();
      toast({
        title: 'Success',
        message: 'Blog post created successfully',
        type: 'success'
      });
      router.push(`/admin/blogs/${blog.id}`);
    } catch (error) {
      console.error('Failed to create blog:', error);
      toast({
        title: 'Error',
        message: 'Failed to create blog post',
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

  return <BlogEditor onSave={handleSave} />;
}
