import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { utapi } from '@/lib/uploadthing.server';

export async function DELETE(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { resumeUrl: true },
    });

    if (!user?.resumeUrl) {
      return new NextResponse('No resume found', { status: 404 });
    }

    // Extract file key from URL
    const fileKey = user.resumeUrl.split('/').pop();
    if (!fileKey) {
      return new NextResponse('Invalid resume URL', { status: 400 });
    }

    // Delete file from UploadThing
    await utapi.deleteFiles([fileKey]);

    // Update user record
    await prisma.user.update({
      where: { id: session.id },
      data: { resumeUrl: null },
    });

    return new NextResponse('Resume deleted', { status: 200 });
  } catch (error) {
    console.error('[RESUME_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
