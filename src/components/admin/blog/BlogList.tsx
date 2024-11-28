'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Blog } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

interface BlogListProps {
  blogs: (Blog & {
    _count: {
      comments: number;
      likes: number;
      bookmarks: number;
    };
  })[];
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

export function BlogList({
  blogs,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: BlogListProps) {
  const router = useRouter();
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBlogs(blogs.map((blog) => blog.id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelect = (blogId: string, checked: boolean) => {
    if (checked) {
      setSelectedBlogs([...selectedBlogs, blogId]);
    } else {
      setSelectedBlogs(selectedBlogs.filter((id) => id !== blogId));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedBlogs.map((id) => onDelete(id)));
      setSelectedBlogs([]);
      toast.success('Selected blogs deleted successfully');
    } catch (error) {
      toast.error('Failed to delete selected blogs');
    }
  };

  return (
    <div className="space-y-4">
      {selectedBlogs.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
          >
            Delete Selected ({selectedBlogs.length})
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedBlogs.length === blogs.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedBlogs.includes(blog.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(blog.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {blog.coverImage && (
                      <div className="relative h-10 w-10 overflow-hidden rounded">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{blog.title}</div>
                      {blog.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={blog.published ? 'default' : 'secondary'}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{blog.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div title="Views">
                      <Icons name='eye' className="mr-1 inline h-4 w-4" />
                      {blog.views}
                    </div>
                    <div title="Likes">
                      <Icons name='heart' className="mr-1 inline h-4 w-4" />
                      {blog._count.likes}
                    </div>
                    <div title="Comments">
                      <Icons name='message' className="mr-1 inline h-4 w-4" />
                      {blog._count.comments}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icons name='more' className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/blogs/${blog.id}`)
                        }
                      >
                        <Icons name='edit' className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onTogglePublish(blog.id, !blog.published)
                        }
                      >
                        <Icons name='eye' className="mr-2 h-4 w-4" />
                        {blog.published ? 'Unpublish' : 'Publish'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onToggleFeatured(blog.id, !blog.featured)
                        }
                      >
                        <Icons name='star' className="mr-2 h-4 w-4" />
                        {blog.featured ? 'Unfeature' : 'Feature'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(blog.id)}
                        className="text-red-600"
                      >
                        <Icons name='trash' className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
