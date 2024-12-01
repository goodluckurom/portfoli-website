import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BlogListClient } from './BlogListClient';
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/admin/blogs');

async function getBlogPosts() {
  const posts = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return posts;
}

export default async function AdminBlogsPage() {
  // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role !== 'ADMIN') {
    redirect("/");
  }

  const posts = await getBlogPosts();

  return (  
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50">
          Blog Posts
        </h1>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          New Post
        </Link>
      </div>
      <BlogListClient posts={posts} />
    </div>
  );
}
