'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Skill } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  level: z.number().min(0).max(100).default(0),
  proficiency: z.number().min(0).max(100).default(0),
  category: z.string().optional().nullable(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  skill?: Skill;
  isEditing?: boolean;
}

export default function SkillForm({ skill, isEditing }: SkillFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name || '',
      description: skill?.description || '',
      icon: skill?.icon || '',
      level: skill?.level || 0,
      proficiency: skill?.proficiency || 0,
      category: skill?.category || '',
    },
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (!data.icon) {
        toast.error('Please upload an icon for the skill');
        return;
      }

      const response = await fetch(
        `/api/skills${isEditing ? `/${skill?.id}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            level: Number(data.level),
            proficiency: Number(data.proficiency),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save skill');
      }

      toast.success(isEditing ? 'Skill updated successfully' : 'Skill created successfully');
      router.push('/admin/skills');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save skill');
      console.error('Error saving skill:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Card className="p-4">
                  <div className="space-y-4">
                    {field.value && (
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-800">
                          <Image
                            src={field.value}
                            alt="Skill icon"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            field.onChange('');
                            form.setValue('icon', '');
                          }}
                        >
                          <Icons name='trash' className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <UploadButton
                      endpoint="skillImageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          field.onChange(res[0].url);
                          form.setValue('icon', res[0].url);
                          toast.success('Icon uploaded successfully');
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Failed to upload icon: ${error.message}`);
                      }}
                    />
                  </div>
                </Card>
              </FormControl>
              <FormDescription>
                Upload an icon for your skill. The icon will be displayed in a circular format.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level (0-100)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proficiency (0-100)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
            {form.formState.isSubmitting || uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update Skill'
            ) : (
              'Create Skill'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
