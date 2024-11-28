'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Icons } from '@/components/icons';
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
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SocialPlatform } from '@prisma/client';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';

const socialPlatformIcons = {
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  YOUTUBE: 'youtube',
  DRIBBBLE: 'briefcase',
  BEHANCE: 'briefcase',
  MEDIUM: 'post',
  DEVTO: 'code',
  WEBSITE: 'globe',
  WHATSAPP:'whatsApp',
  OTHER: 'link',

} as const;

const settingsFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  image: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.nativeEnum(SocialPlatform),
    name: z.string(),
    url: z.string().url(),
    icon: z.string(),
  })),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      headline: user?.headline || '',
      location: user?.location || '',
      image: user?.image || '',
      socialLinks: user?.socialLinks || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast({
        description: 'Your settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>
            </div>
            <Separator />
            <div className="grid gap-6">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24">
                  <Image
                    src={form.watch('image') || '/placeholder.png'}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <UploadButton
                    endpoint="profileImageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) {
                        form.setValue('image', res[0].url);
                        toast({
                          title: 'Success',
                          description: 'Image uploaded successfully',
                        });
                        form.trigger('image');
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        title: 'Error',
                        description: error.message,
                        variant: 'destructive',
                      });
                    }}
                    appearance={{
                      button: "bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground",
                      allowedContent: "text-muted-foreground text-sm",
                      container: "w-full max-w-[300px]"
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a profile picture. Max file size: 4MB
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="Your professional headline" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short headline that appears under your name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description for your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Your location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Social Links</h3>
                <p className="text-sm text-muted-foreground">
                  Add your social media profiles.
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => append({ 
                  platform: SocialPlatform.GITHUB, 
                  name: '', 
                  url: '', 
                  icon: socialPlatformIcons.GITHUB 
                })}
              >
                <Icons name="add" className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </div>
            <Separator />
            
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.platform`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select
                          onValueChange={(value: SocialPlatform) => {
                            field.onChange(value);
                            form.setValue(
                              `socialLinks.${index}.icon`,
                              socialPlatformIcons[value]
                            );
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background-main border">
                            {Object.values(SocialPlatform).map((platform) => (
                              <SelectItem
                                key={platform}
                                value={platform}
                                className="hover:bg-accent focus:bg-accent"
                              >
                                <div className="flex items-center gap-2">
                                  <Icons
                                    name={socialPlatformIcons[platform]}
                                    className="h-4 w-4"
                                  />
                                  {platform}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., GitHub Profile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Icons name="trash" className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Resume</h3>
              <p className="text-sm text-muted-foreground">
                Upload your resume for visitors to download.
              </p>
            </div>
            <Separator />
            
            {user?.resumeUrl && (
              <div className="flex items-center justify-between">
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Current Resume
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Add delete resume functionality
                  }}
                >
                  <Icons name="trash" className="h-4 w-4" />
                </Button>
              </div>
            )}
              
            <UploadButton
              endpoint="resumeUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  // Add update resume functionality
                  toast({
                    description: 'Your resume has been updated.',
                  });
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: 'Error',
                  description: error.message,
                  variant: 'destructive',
                });
              }}
            />
          </div>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons name="spinner" className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
