import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BlogEditorClient } from './BlogEditorClient';
import { BlogPostDetailsClient } from './BlogPostDetailsClient';
import { notFound, redirect } from 'next/navigation';
import { Blog, Comment, User } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin/blogs/[id]');

interface BlogPageProps {
  params: {
    id: string;
  };
  searchParams: {
    mode?: string;
  };
}

type SerializedBlog = Omit<Blog, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

type SerializedComment = Omit<Comment, 'createdAt'> & {
  createdAt: string;
};

type BlogWithComments = SerializedBlog & {
  comments: (SerializedComment & {
    user: User;
  })[];
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: `${blog.title} | Admin`,
  };
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  
   // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }
  const blog = await prisma.blog.findUnique({
    where: {
      id: params.id,
    },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!blog) {
    notFound();
  }

  // Serialize the dates
  const serializedBlog: BlogWithComments = {
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    comments: blog.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
  };

  const isEditMode = searchParams.mode === 'edit';

  return (
    <div className="container mx-auto py-10">
      {isEditMode ? (
        <div className="w-full">
          <BlogEditorClient blog={serializedBlog} />
        </div>
      ) : (
        <BlogPostDetailsClient initialData={serializedBlog} />
      )}
    </div>
  );
}
