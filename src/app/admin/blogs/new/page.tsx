import { Metadata } from 'next';
import NewBlogClient  from './NewBlogClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDynamicConfig } from '@/lib/dynamic';

export const metadata: Metadata = {
  title: 'New Blog Post',
  description: 'Create a new blog post for your portfolio.',
};

export const dynamic = getDynamicConfig('/admin/blogs/new');

export default async function NewBlogPage() {
   // Server-side authentication check
  const session = await getSession();
  
  if (!session || session?.role!=='ADMIN') {
    redirect("/");
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">
            Write and publish a new blog post to your portfolio.
          </p>
        </div>
        <NewBlogClient />
      </div>
    </div>
  );
}
