import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ liked: false });
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId: session.id,
          blogId: params.id,
        },
      },
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error('[BLOG_LIKE_CHECK]', error);
    return NextResponse.json({ liked: false }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId: session.id,
          blogId: params.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_blogId: {
            userId: session.id,
            blogId: params.id,
          },
        },
      });

      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: {
        userId: session.id,
        blogId: params.id,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('[BLOG_LIKE]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
