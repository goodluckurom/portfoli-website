import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/blogs/[id]/bookmark - Check if user has bookmarked a blog
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ bookmarked: false });
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_blogId: {
          userId: session.id,
          blogId: params.id,
        },
      },
    });

    return NextResponse.json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error('[BLOG_BOOKMARK_CHECK]', error);
    return NextResponse.json({ bookmarked: false }, { status: 500 });
  }
}

// POST /api/blogs/[id]/bookmark - Bookmark a blog
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_blogId: {
          userId: session.id,
          blogId: params.id,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_blogId: {
            userId: session.id,
            blogId: params.id,
          },
        },
      });

      return NextResponse.json({ bookmarked: false });
    }

    await prisma.bookmark.create({
      data: {
        userId: session.id,
        blogId: params.id,
      },
    });

    return NextResponse.json({ bookmarked: true });
  } catch (error) {
    console.error('[BLOG_BOOKMARK]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// DELETE /api/blogs/[id]/bookmark - Unbookmark a blog
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.bookmark.delete({
      where: {
        userId_blogId: {
          blogId: params.id,
          userId: session.id,
        },
      },
    });

    return NextResponse.json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Unbookmark error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
