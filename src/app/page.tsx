import { prisma } from "@/lib/prisma";
import { getDynamicConfig } from '@/lib/dynamic';
import { HomeClient } from "@/components/home/HomeClient";
import { Blog, Experience, Project, Skill, SocialLink, User } from "@prisma/client";

interface BlogWithCounts extends Blog {
  user: {
    name: string | null;
  };
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  liked: boolean;
  bookmarked: boolean;
}

export const dynamic = getDynamicConfig('/');

async function getData() {
  // Fetch featured projects
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  // Fetch recent blogs
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          bookmarks: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  }) as BlogWithCounts[];

  // Fetch skills
  const skills = await prisma.skill.findMany({
    orderBy: [
      {
        category: "asc",
      },
      {
        proficiency: "desc",
      },
    ],
  });

  // Fetch experiences
  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  // Fetch user info
  const user = await prisma.user.findFirst({
    include: {
      socialLinks: true,
    },
  });

  return {
    user,
    experiences,
    skills,
    projects,
    blogs: blogs.map((blog) => ({
      ...blog,
      liked: false,
      bookmarked: false,
    })),
  };
}

export default async function HomePage() {
  const data = await getData();
  return <HomeClient initialData={data} />;
}
