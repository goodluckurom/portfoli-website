'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Blog, User } from '@prisma/client';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogWithDetails extends Blog {
  user: Pick<User, 'name'>;
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  liked?: boolean;
  bookmarked?: boolean;
}

interface BlogSectionProps {
  blogs: BlogWithDetails[];
  isLoading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function BlogSection({ blogs, isLoading }: BlogSectionProps) {
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-100px" }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <motion.h2 variants={item} className="text-3xl font-bold">
            Latest Blog Posts
          </motion.h2>
          <motion.p variants={item} className="text-muted-foreground">
            My thoughts and ideas
          </motion.p>
        </div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.length > 0 ? (
            blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">No blog posts available.</p>
          )}
        </motion.div>

        <motion.div variants={item} className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
