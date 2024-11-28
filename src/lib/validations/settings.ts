import * as z from 'zod';
import { SocialPlatform } from '@prisma/client';

export const socialPlatforms = Object.values(SocialPlatform);

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.nativeEnum(SocialPlatform),
  name: z.string().optional(),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  icon: z.string().optional(),
});

export const settingsFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email(),
  headline: z.string().min(2, { message: 'Headline must be at least 2 characters' }).optional(),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }).optional(),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }).optional(),
  image: z.string().optional(),
  socialLinks: z.array(socialLinkSchema),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
