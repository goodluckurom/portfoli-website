  'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Blog, User } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogCardProps {
  blog: Blog & {
    user: Pick<User, 'name'>;
    _count: {
      comments: number;
      likes: number;
      bookmarks: number;
    };
    liked?: boolean;
    bookmarked?: boolean;
  };
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const [isLiked, setIsLiked] = useState(blog.liked);
  const [isBookmarked, setIsBookmarked] = useState(blog.bookmarked);
  const [likeCount, setLikeCount] = useState(blog._count.likes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/blogs/${blog.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to like blog');

      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Please sign in to like this post',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/blogs/${blog.id}/bookmark`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to bookmark blog');

      const data = await response.json();
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Please sign in to bookmark this post',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${blog.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || '',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Success',
          message: 'Link copied to clipboard!',
          type: 'success'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to share blog post',
        type: 'error'
      });
    }
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col space-y-2',
        className
      )}
    >
      {blog.coverImage && (
        <Link
          href={`/blog/${blog.slug}`}
          className="aspect-video overflow-hidden rounded-lg border bg-muted"
        >
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={800}
            height={450}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={blog.createdAt.toString()}>
            {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
          </time>
          <span>•</span>
          <span>{blog.readingTime} min read</span>
          <span>•</span>
          <span>{blog.views} views</span>
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h2 className="text-2xl font-bold leading-tight hover:underline">
            {blog.title}
          </h2>
        </Link>

        {blog.excerpt && (
          <p className="text-muted-foreground line-clamp-2">{blog.excerpt}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {blog.category && (
            <Badge variant="default" className="capitalize">
              {blog.category}
            </Badge>
          )}
          <div className="flex flex-wrap gap-1">
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={handleLike}
              disabled={isLoading}
            >
              {isLiked ? (
                <Icons name='heartFilled' className="h-4 w-4 text-red-500" />
              ) : (
                <Icons name='heart' className="h-4 w-4" />
              )}
              <span>{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              asChild
            >
              <Link href={`/blog/${blog.slug}#comments`}>
                <Icons name='message' className="h-4 w-4" />
                <span>{blog._count.comments}</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={handleBookmark}
              disabled={isLoading}
            >
              {isBookmarked ? (
                <Icons name='bookmarkFilled' className="h-4 w-4" />
              ) : (
                <Icons name='bookmark' className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Icons name='share' className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Icons name='link' className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(`${window.location.origin}/blog/${blog.slug}`)}`, '_blank')}>
                  <Icons name='twitter' className="mr-2 h-4 w-4" />
                  <span>Share on Twitter</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/blog/${blog.slug}`)}`, '_blank')}>
                  <Icons name='linkedin' className="mr-2 h-4 w-4" />
                  <span>Share on LinkedIn</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
