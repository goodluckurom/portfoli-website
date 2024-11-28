import { Blog, User, Project, Experience, Skill, Comment } from '@prisma/client';

export type BlogWithAuthor = Blog & {
  user: Pick<User, 'name' | 'image'>;
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  liked?: boolean;
  bookmarked?: boolean;
};

export type ProjectWithDetails = Project & {
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  technologies: string[];
  techStack: string[]; // Array of technology stack image URLs
  slug: string;
  content: string;
  thumbnail: string;
  images: string[];
  published: boolean;
  featured: boolean;
};

export type ExperienceWithDetails = Experience & {
  position: string;
  current: boolean;
  technologies: string[];
};

export type SkillWithDetails = Skill & {
  proficiency: number;
};

export type CommentWithUser = Comment & {
  user: Pick<User, 'name' | 'image'>;
};

export interface ToastProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface Theme {
  typography: {
    fonts: {
      sans: string;
      mono: string;
    };
  };
  spacing: {
    content: string;
  };
  colors: {
    [key: string]: string;
  };
}
