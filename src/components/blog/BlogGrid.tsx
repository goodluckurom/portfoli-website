'use client';

import { Blog, User } from '@prisma/client';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  blogs: (Blog & {
    user: Pick<User, 'name'>;
    _count: {
      comments: number;
      likes: number;
      bookmarks: number;
    };
    liked?: boolean;
    bookmarked?: boolean;
  })[];
}

export function BlogGrid({ blogs }: BlogGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
