'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Blog, Comment, User } from '@prisma/client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';
import { MDXRemote } from 'next-mdx-remote';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogPostClientProps {
  blog: Blog & {
    user: {
      name: string | null;
      image: string | null;
    };
    comments: (Comment & {
      user: {
        name: string | null;
        image: string | null;
      };
    })[];
    _count: {
      likes: number;
      bookmarks: number;
      comments: number;
    };
  };
  session: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  } | null;
}

export function BlogPostClient({ blog, session }: BlogPostClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog._count.likes);
  const [bookmarkCount, setBookmarkCount] = useState(blog._count.bookmarks);
  const [comments, setComments] = useState(blog.comments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkInteractions = async () => {
      if (!session) return;
      try {
        const [likeRes, bookmarkRes] = await Promise.all([
          fetch(`/api/blogs/${blog.id}/like`, {
            method: 'GET'
          }),
          fetch(`/api/blogs/${blog.id}/bookmark`, {
            method: 'GET'
          })
        ]);
        const [likeData, bookmarkData] = await Promise.all([
          likeRes.json(),
          bookmarkRes.json()
        ]);
        setIsLiked(likeData.liked);
        setIsBookmarked(bookmarkData.bookmarked);
      } catch (error) {
        console.error('Error checking interactions:', error);
      }
    };
    checkInteractions();
  }, [blog.id, session]);

  useEffect(() => {
    // Increment view count when the post is loaded
    const incrementViews = async () => {
      try {
        await fetch(`/api/blogs/${blog.id}/views`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    incrementViews();
  }, [blog.id]);

  const handleLike = async () => {
    if (!session) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blog.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to like post');
      }

      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      toast.success(data.liked ? 'Post liked!' : 'Post unliked');
    } catch (error) {
      console.error('Like error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleBookmark = async () => {
    if (!session) {
      toast.error('Please sign in to bookmark posts');
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blog.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to bookmark post');
      }

      const data = await res.json();
      setIsBookmarked(data.bookmarked);
      setBookmarkCount(prev => data.bookmarked ? prev + 1 : prev - 1);
      toast.success(data.bookmarked ? 'Post bookmarked!' : 'Bookmark removed');
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleComment = async () => {
    if (!session) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blog.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });
      
      if (!res.ok) throw new Error('Failed to post comment');
      
      const comment = await res.json();
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="container max-w-3xl py-10">
    
      <div className="flex flex-col gap-8">
        {blog.coverImage && (
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={1200}
              height={675}
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={blog.user.image || undefined} alt={blog.user.name || ''} />
              <AvatarFallback>{getInitials(blog.user.name || 'Anonymous')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{blog.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          <h1 className="font-heading text-4xl font-bold">{blog.title}</h1>

          <div className="flex flex-wrap gap-2">
            {blog.category && (
              <Badge variant="secondary" className="capitalize">
                {blog.category}
              </Badge>
            )}
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icons name='clock' className="h-4 w-4" />
              {blog.readingTime} min read
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Icons name='eye' className="h-4 w-4" />
              {blog.views} views
            </div>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote {...blog.content} />
        </div>

        <div className="flex items-center justify-between border-t pt-4">
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
              onClick={handleBookmark}
              disabled={isLoading}
            >
              {isBookmarked ? (
                <Icons name='bookmarkFilled' className="h-4 w-4 text-primary" />
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
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}>
                  <Icons name='link' className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => 
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
                }>
                  <Icons name='twitter' className="mr-2 h-4 w-4" />
                  <span>Share on Twitter</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => 
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
                }>
                  <Icons name='linkedin' className="mr-2 h-4 w-4" />
                  <span>Share on LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => 
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                }>
                  <Icons name='facebook' className="mr-2 h-4 w-4" />
                  <span>Share on Facebook</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t pt-8" id="comments">
          <h2 className="font-heading text-2xl font-bold mb-8">Comments</h2>
          
          {session ? (
            <div className="flex flex-col gap-4 mb-8">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleComment}
                disabled={isLoading || !newComment.trim()}
                className="self-end"
              >
                {isLoading ? (
                  <>
                    <Icons name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center mb-8">
              <p className="text-muted-foreground mb-4">
                Please sign in to leave a comment.
              </p>
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={comment.user.image || undefined} alt={comment.user.name || ''} />
                      <AvatarFallback>{getInitials(comment.user.name || 'Anonymous')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{comment.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="mt-2 text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No comments yet, Be the first to comment!.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
