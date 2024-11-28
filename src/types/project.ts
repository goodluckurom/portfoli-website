import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED']),
  published: z.boolean(),
  featured: z.boolean(),
  github: z.string().optional(),
  link: z.string().optional(),
  technologies: z.array(z.string()),
  techStack: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
