'use client';

import { Blog, User } from '@prisma/client';
import { BlogCard } from './BlogCard';
import {motion} from 'framer-motion'

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
      {blogs.map((blog,index) => (
        <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
          
        <BlogCard key={blog.id} blog={blog} />
            </motion.div>
      ))}
    </div>
  );
}
