'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Blog } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { uploadFiles, deleteUploadThing } from '@/lib/uploadthing';
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/providers/ThemeProvider';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

type SerializedBlog = Omit<Blog, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  coverImage: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  metaDescription: z.string().min(1, 'Meta description is required'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogEditorProps {
  blog?: SerializedBlog;
  onSave: (data: BlogFormValues) => Promise<void>;
}

export function BlogEditor({ blog, onSave }: BlogEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useThemeContext();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      excerpt: blog?.excerpt || '',
      coverImage: blog?.coverImage || '',
      category: blog?.category || '',
      tags: blog?.tags || [],
      metaDescription: blog?.metaDescription || '',
      published: blog?.published || false,
      featured: blog?.featured || false,
    },
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const [res] = await uploadFiles("blogImageUploader", {
        files: [file],
      });

      if (!res) {
        throw new Error("Failed to upload image");
      }

      return res.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const handleImageDelete = async (imageUrl: string | undefined) => {
    if (!imageUrl) return;
    
    try {
      const fileKey = imageUrl.split("/").pop();
      if (!fileKey) return;

      await deleteUploadThing(fileKey);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setIsLoading(true);
      await onSave(data);
      toast.success('Blog saved successfully');
      router.push('/admin/blogs');
    } catch (error) {
      toast.error('Failed to save blog');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Blog category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of the blog post"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div data-color-mode={isDark ? 'dark' : 'light'}>
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    preview="edit"
                    height={500}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                      <img
                        src={field.value}
                        alt="Cover"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0"
                        onClick={async () => {
                          await handleImageDelete(field.value);
                          field.onChange('');
                        }}
                      >
                        <Icons name="trash" className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icons name="image" className="h-6 w-6 text-primary" />
                      </div>
                      <p className="mt-2 text-sm font-medium">Drag and drop or click to upload</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG or GIF up to 4MB
                      </p>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files) return;
                        const file = e.target.files[0];
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error("File size should be less than 4MB");
                          return;
                        }
                        const url = await handleImageUpload(file);
                        field.onChange(url);
                      }}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      <Icons name="upload" className="mr-2 h-4 w-4" />
                      Select Image
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Recommended size: 1200x630 pixels
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter tags separated by commas" 
                  value={field.value.join(', ')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const tags = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];
                    field.onChange(tags);
                  }}
                />
              </FormControl>
              <FormDescription>
                Separate tags with commas (e.g. "nextjs, react, typescript")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="SEO meta description"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description for search engines (recommended: 150-160
                characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Published</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Featured</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blogs')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons name='spinner' className="mr-2 h-4 w-4 animate-spin" />
            )}
            {blog ? 'Update' : 'Create'} Blog
          </Button>
        </div>
      </form>
    </Form>
  );
}
