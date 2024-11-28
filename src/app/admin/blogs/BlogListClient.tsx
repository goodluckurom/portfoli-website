'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/icons';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string | null;
  published: boolean;
  createdAt: Date;
}

interface BlogListClientProps {
  posts: BlogPost[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update post');
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/blogs/${id}/edit`);
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 group-hover:text-primary-600">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <span>•</span>
                <span>
                  Created {formatDistanceToNow(new Date(post.createdAt))} ago
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTogglePublish(post.id, post.published)}
                className="inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                title={post.published ? 'Unpublish' : 'Publish'}
              >
                {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <Link
                href={`/admin/blogs/${post.id}`}
                className="inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <Icons name='view' className="h-4 w-4" />
              </Link>
              <Link
                href={`/admin/blogs/${post.id}/edit`}
                className="inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="inline-flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-9 w-9"
                title="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-primary-600 dark:text-primary-400">
            No blog posts yet. Create your first post!
          </p>
        </div>
      )}
    </div>
  );
}
