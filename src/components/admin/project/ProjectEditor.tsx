'use client';

import React, { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud } from "lucide-react";
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/providers/ThemeProvider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { projectFormSchema, type ProjectFormValues } from '@/types/project';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface ProjectEditorProps {
  project?: ProjectFormValues;
  onSave: (data: ProjectFormValues) => Promise<void>;
}

export function ProjectEditor({ project, onSave }: ProjectEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [techStackInput, setTechStackInput] = useState('');
  const [technologyInput, setTechnologyInput] = useState('');
  const { isDark } = useThemeContext();
  const router = useRouter();

  const { startUpload: startProjectUpload } = useUploadThing("projectImageUploader", {
    onClientUploadComplete: () => {
      toast.success('Project images uploaded successfully');
    },
  });
  
  const { startUpload: startTechStackUpload } = useUploadThing("techStackImageUploader", {
    onClientUploadComplete: () => {
      toast.success('Tech stack images uploaded successfully');
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      content: project?.content ?? '',
      status: project?.status ?? 'PLANNED',
      published: project?.published ?? false,
      featured: project?.featured ?? false,
      github: project?.github ?? '',
      link: project?.link ?? '',
      technologies: project?.technologies ?? [],
      techStack: project?.techStack ?? [],
      images: project?.images ?? [],
      slug: project?.slug ?? '',
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onSave(data);
      toast.success(project ? 'Project updated successfully' : 'Project created successfully');
      router.push('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTechnology = (tech: string) => {
    if (!tech) return;
    const technologies = form.getValues('technologies');
    if (!technologies.includes(tech)) {
      form.setValue('technologies', [...technologies, tech]);
    }
    setTechnologyInput('');
  };

  const handleRemoveTechnology = (tech: string) => {
    const technologies = form.getValues('technologies');
    form.setValue(
      'technologies',
      technologies.filter((t) => t !== tech)
    );
  };

  const ImageUploadField = ({ fieldName }: { fieldName: 'images' | 'techStack' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const uploadFunction = fieldName === 'images' ? startProjectUpload : startTechStackUpload;

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        setIsUploading(true);
        try {
          const uploadedFiles = await uploadFunction(acceptedFiles);
          if (uploadedFiles) {
            const currentFiles = form.getValues(fieldName) || [];
            const newFiles = [...currentFiles, ...uploadedFiles.map(f => f.url)];
            form.setValue(fieldName, newFiles);
          }
        } catch (error) {
          toast.error(`Error uploading ${fieldName === 'images' ? 'project' : 'tech stack'} images`);
        } finally {
          setIsUploading(false);
        }
      },
      [fieldName, uploadFunction]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      },
      multiple: true,
    });

    const fieldValue = form.watch(fieldName) || [];
    const isStack = fieldName === 'techStack';

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isStack ? 'Technology Stack Images' : 'Project Images'}</FormLabel>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {fieldValue.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`${isStack ? 'Tech stack' : 'Project'} image ${index + 1}`}
                      className={cn(
                        "object-cover",
                        isStack
                          ? "w-12 h-12 rounded-full ring-2 ring-background"
                          : "w-32 h-32 rounded-lg"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...fieldValue];
                        newFiles.splice(index, 1);
                        form.setValue(fieldName, newFiles);
                      }}
                      className={cn(
                        "absolute p-1 rounded-full bg-destructive opacity-0 group-hover:opacity-100 transition-opacity",
                        isStack ? "-top-2 -right-2" : "top-1 right-1"
                      )}
                    >
                      <X className={cn("text-white", isStack ? "h-3 w-3" : "h-4 w-4")} />
                    </button>
                  </div>
                ))}
              </div>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition cursor-pointer",
                  isDragActive && "border-primary"
                )}
              >
                <input {...getInputProps()} />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Uploading {isStack ? 'tech stack images' : 'images'}...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop {isStack ? 'tech stack ' : ''}images here, or click to select files
                    </p>
                  </div>
                )}
              </div>
            </div>
            {isStack && (
              <FormDescription>
                Upload technology stack images. These will be displayed as circular icons.
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Project description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Technologies Field */}
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology"
                    value={technologyInput}
                    onChange={(e) => setTechnologyInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechnology(technologyInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleAddTechnology(technologyInput)}
                  >
                    Add
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tech Stack Upload */}
          <ImageUploadField fieldName="techStack" />
        </div>

        {/* URLs */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Project Images Upload */}
        <ImageUploadField fieldName="images" />

        {/* Content Field */}
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
                    onChange={(value) => field.onChange(value || '')}
                    preview="edit"
                    height={400}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published Switch */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <FormDescription>
                  Make this project visible to visitors.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Featured Switch */}
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured</FormLabel>
                <FormDescription>
                  Show this project in the featured section.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Icons name='spinner' className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Project'
          )}
        </Button>
      </form>
    </Form>
  );
}