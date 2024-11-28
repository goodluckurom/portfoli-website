import { Metadata } from 'next';
import { NewBlogClient } from './NewBlogClient';

export const metadata: Metadata = {
  title: 'New Blog Post',
  description: 'Create a new blog post for your portfolio.',
};

export default function NewBlogPage() {
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
