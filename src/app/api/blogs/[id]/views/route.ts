import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/blogs/[id]/views - Increment blog views
export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Check if blog exists and is published
    const blog = await prisma.blog.findUnique({
      where: { 
        id: params.id,
        published: true
      },
      select: {
        id: true
      }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found or not published' },
        { status: 404 }
      );
    }

    // Increment views
    const updated = await prisma.blog.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        views: true
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}
