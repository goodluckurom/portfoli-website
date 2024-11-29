import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BlogPostClient } from "./BlogPostClient";
import { UserProfileSection } from "@/components/blog/UserProfileSection";
import { serialize } from 'next-mdx-remote/serialize';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: { slug: params.slug },
  });

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.metaDescription,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.slug,
      ...(!isAdmin && { published: true }),
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      comments: {
        where: { approved: true },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          likes: true,
          bookmarks: true,
          comments: true,
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
  });

  if (!blog) {
    notFound();
  }

  // Serialize the MDX content
  const serializedContent = await serialize(blog.content);

  // Get user interactions if logged in
  let liked = false;
  let bookmarked = false;

  if (session) {
    const [likeData, bookmarkData] = await Promise.all([
      prisma.like.findUnique({
        where: {
          userId_blogId: {
            userId: session.id,
            blogId: blog.id,
          },
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_blogId: {
            userId: session.id,
            blogId: blog.id,
          },
        },
      }),
    ]);

    liked = !!likeData;
    bookmarked = !!bookmarkData;
  }

  const blogWithInteractions = {
    ...blog,
    content: serializedContent,
    liked,
    bookmarked,
    likes: undefined,
    bookmarks: undefined,
  };

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <UserProfileSection session={session} variant="single-post" />
        <BlogPostClient blog={blogWithInteractions} session={session} />
      </div>
    </main>
  );
}