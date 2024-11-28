'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Session } from '@/lib/auth';

interface ProfileClientProps {
  user: NonNullable<Session>;
}

interface BookmarkedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: string;
  category: string | null;
}

interface UserProfile extends NonNullable<Session> {
  bookmarks: {
    blog: BookmarkedBlog;
  }[];
}

export function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  const [formData, setFormData] = useState({
    name: initialUser.name || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image');
        return;
      }
      setImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', image);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      const imageUrl = data.urls[0];

      const updateResponse = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!updateResponse.ok) throw new Error('Failed to update profile image');

      toast.success('Profile image updated');
      router.refresh();
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      setImage(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Icons name="spinner" className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
     
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-y-6">
              <div className="relative h-40 w-40">
                <Image
                  src={user.image || '/placeholder.png'}
                  alt={user.name || 'Profile'}
                  className="rounded-full object-cover"
                  fill
                  priority
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="cursor-pointer inline-flex items-center gap-x-2 text-sm font-medium">
                  {isUploading ? (
                    <>
                      <Icons name='spinner' className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Icons name='edit' className="h-4 w-4" />
                      Change photo
                    </>
                  )}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                {image && (
                  <Button
                    size="sm"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons name='spinner' className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookmarked Posts</CardTitle>
          <CardDescription>
            Posts you've saved for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.bookmarks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookmarked posts yet.</p>
          ) : (
            <div className="grid gap-4">
              {user.bookmarks.map(({ blog }) => (
                <div key={blog.id} className="flex flex-col space-y-2">
                  <div className="flex items-start justify-between group">
                    <Link href={`/blog/${blog.slug}`} className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium group-hover:underline">{blog.title}</h3>
                          {blog.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                          )}
                        </div>
                        {blog.coverImage && (
                          <div className="relative h-16 w-16 ml-4 flex-shrink-0">
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              className="rounded-md object-cover"
                              fill
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        {blog.category && (
                          <Badge variant="secondary" className="capitalize">
                            {blog.category}
                          </Badge>
                        )}
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(blog.createdAt))} ago</span>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-8 w-8 ml-2"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const response = await fetch(`/api/blogs/${blog.id}/bookmark`, {
                            method: 'DELETE',
                          });
                          
                          if (!response.ok) throw new Error('Failed to remove bookmark');
                          
                          setUser(prev => prev ? {
                            ...prev,
                            bookmarks: prev.bookmarks.filter(b => b.blog.id !== blog.id)
                          } : null);
                          
                          toast.success('Bookmark removed');
                        } catch (error) {
                          toast.error('Failed to remove bookmark');
                        }
                      }}
                    >
                      <Icons name="bookmarkminus" className="h-4 w-4" />
                      <span className="sr-only">Remove bookmark</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
