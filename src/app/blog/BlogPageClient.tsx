'use client';

import { Blog } from '@prisma/client';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Icons } from '@/components/icons';
import { useUser } from '@/hooks/use-user';
import { useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { string } from 'zod';
import { UserProfileSection } from '@/components/blog/UserProfileSection';
import { Session } from '@/lib/auth';
import { FloatingBall } from '@/components/FloatingBall';

interface BlogWithInteractions extends Blog {
  user: {
    name: string | null;
  };
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  liked?: boolean;
  bookmarked?: boolean;
}

interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

interface BlogPageClientProps {
  initialData: {
    blogs: BlogWithInteractions[];
    pagination: PaginationData;
  };
  session: Session;
}

export function BlogPageClient({ initialData, session }: BlogPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useUser();
  const [blogs, setBlogs] = useState<BlogWithInteractions[]>(initialData.blogs);
  const [pagination, setPagination] = useState<PaginationData>(initialData.pagination);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogs = async (page: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      params.set('limit', pagination.limit.toString());

      // Only add published filter if not admin
      if (!isAdmin) {
        params.set('published', 'true');
      }

      const response = await fetch(`/api/blogs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      
      const data = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
      
      // Update URL with new page number
      router.push(`/blog?${params.toString()}`, { scroll: false });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: 'Error',
        message: 'Failed to fetch blogs',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === pagination.page) return;
    fetchBlogs(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <UserProfileSection session={session} />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-bold">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Read my thoughts on software development, design, and more.
          </p>
        </div>
        {blogs.length > 0 ? (
          <>
            <BlogGrid blogs={blogs} />
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">No blog posts found.</p>
        )}
      </div>
    </div>
  );
}