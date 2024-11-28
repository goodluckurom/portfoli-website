import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/blogs - Get all blogs (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured') === 'true';
    const published = searchParams.get('published') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const take = parseInt(searchParams.get('take') || String(limit));
    const skip = (page - 1) * limit;

    const session = await getSession();
    const isAdmin = session?.role === 'ADMIN';

    const where = {
      ...(!isAdmin && { published: true }),
      ...(category && { category }),
      ...(tag && { tags: { has: tag } }),
      ...(typeof featured === 'boolean' && { featured }),
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      blogs: blogs.map(blog => ({
        ...blog,
        liked: session ? blog.likes?.length > 0 : false,
        bookmarked: session ? blog.bookmarks?.length > 0 : false,
        likes: undefined,
        bookmarks: undefined,
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: Request) {
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        excerpt,
        coverImage,
        slug,
        category,
        tags,
        metaDescription,
        published: published || false,
        featured: featured || false,
        readingTime,
        userId: session.id,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Failed to create blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
