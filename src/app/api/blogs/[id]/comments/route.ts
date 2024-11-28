import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const { content } = json;

    if (!content?.trim()) {
      return new NextResponse('Content is required', { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.id,
        blogId: params.id,
        approved: true, // Auto-approve comments for now
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('[BLOG_COMMENT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId: params.id,
        approved: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('[BLOG_COMMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
