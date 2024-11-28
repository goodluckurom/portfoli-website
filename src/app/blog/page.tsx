import { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, design, and more.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN';
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');
  const skip = (page - 1) * limit;

  const where = {
    ...(!isAdmin && { published: true }),
  };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
        ...(session && {
          likes: {
            where: {
              userId: session.id,
            },
            take: 1,
          },
          bookmarks: {
            where: {
              userId: session.id,
            },
            take: 1,
          },
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.blog.count({ where }),
  ]);

  const initialData = {
    blogs: blogs.map(blog => ({
      ...blog,
      liked: session ? blog.likes?.length > 0 : false,
      bookmarked: session ? blog.bookmarks?.length > 0 : false,
      likes: undefined,
      bookmarks: undefined,
    })),
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  };

  return <BlogPageClient initialData={initialData} session={session} />;
}