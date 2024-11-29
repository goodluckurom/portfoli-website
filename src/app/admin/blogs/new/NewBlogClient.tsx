'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor } from '@/components/admin/blog/BlogEditor';
import { toast } from '@/components/toast';
import { useState } from 'react';

export default function NewBlogClient() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (data: any) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <BlogEditor onSave={handleSave} />;
}
