import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/api/blogs/[id]');

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/blogs/[id] - Get a single blog
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();

    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        comments: {
          where: { approved: true },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        ...(session && {
          likes: {
            where: {
              userId: session.id,
            },
            take: 1,
          },
          bookmarks: {
            where: {
              userId: session.id,
            },
            take: 1,
          },
        }),
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.blog.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    // Transform the response to include user interaction status
    const response = {
      ...blog,
      liked: session ? blog.likes.length > 0 : false,
      bookmarked: session ? blog.bookmarks.length > 0 : false,
      // Remove the arrays since we only need the boolean status
      likes: undefined,
      bookmarks: undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update a blog
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      metaDescription,
      published,
      featured,
    } = body;

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        metaDescription,
        published,
        featured,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// PATCH /api/blogs/[id] - Update a blog
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      metaDescription,
      published,
      featured,
    } = body;

    // If title is being updated, update slug as well
    const updateData: any = {
      ...body,
    };

    if (title) {
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-');
    }

    // If content is being updated, update reading time
    if (content) {
      const wordCount = content.trim().split(/\s+/).length;
      updateData.readingTime = Math.ceil(wordCount / 200);
    }

    const blog = await prisma.blog.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.blog.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
