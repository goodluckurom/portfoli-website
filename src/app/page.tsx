"use server";

import { prisma } from "@/lib/prisma";
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
  });

  // Fetch user data
  const user = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
    include: {
      socialLinks: true,
    },
  });

  // Fetch experiences
  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  // Fetch skills
  const skills = await prisma.skill.findMany({
    orderBy: {
      category: "asc",
    },
  });

  const data = {
    user,
    experiences,
    skills,
    projects,
    blogs: blogs.map((blog) => ({
      ...blog,
      liked: false,
      bookmarked: false,
    })),
  } satisfies {
    user: (User & { socialLinks: SocialLink[] }) | null;
    experiences: Experience[];
    skills: Skill[];
    projects: Project[];
    blogs: BlogWithCounts[];
  };

  return data;
}

export default async function HomePage() {
  const data = await getData();
  return <HomeClient initialData={data} />;
}
