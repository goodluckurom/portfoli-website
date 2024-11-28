import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
    commentId: string;
  };
}

// PATCH /api/blogs/[id]/comments/[commentId] - Update a comment (admin only)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { approved } = await request.json();

    const comment = await prisma.comment.update({
      where: {
        id: params.commentId,
        blogId: params.id,
      },
      data: {
        approved,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Failed to update comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id]/comments/[commentId] - Delete a comment (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    console.log('route for deleting comment reached');
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: params.commentId,
        blogId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
