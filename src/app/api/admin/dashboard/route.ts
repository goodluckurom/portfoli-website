import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    const [
      blogCount,
      projectCount,
      experienceCount,
      skillCount,
      recentBlogs,
      recentProjects,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.project.count(),
      prisma.experience.count(),
      prisma.skill.count(),
      prisma.blog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          published: true,
        },
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          published: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        blogs: blogCount,
        projects: projectCount,
        experience: experienceCount,
        skills: skillCount,
      },
      recentBlogs,
      recentProjects,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
