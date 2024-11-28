import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BlogEditorClient } from './BlogEditorClient';
import { BlogPostDetailsClient } from './BlogPostDetailsClient';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: {
    id: string;
  };
  searchParams: {
    mode?: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: {
      id: params.id,
    },
  });

  return {
    title: blog ? `${blog.title} - Admin` : 'Blog not found',
  };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const blog = await prisma.blog.findUnique({
    where: {
      id: params.id,
    },
    include: {
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!blog) {
    notFound();
  }

  // If mode is edit, show the editor, otherwise show the details view
  if (searchParams.mode === 'edit') {
    return (
      <div className="container mx-auto py-10">
        <div className="w-full">
          <BlogEditorClient blog={blog} />
        </div>
      </div>
    );
  }

  // Default to showing the details view
  return <BlogPostDetailsClient initialData={blog} />;
}
