import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { settingsFormSchema } from '@/lib/validations/settings';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = settingsFormSchema.parse(body);

    const user = await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        bio: validatedData.bio,
        headline: validatedData.headline,
        location: validatedData.location,
        image: validatedData.image,
        socialLinks: {
          deleteMany: {},
          create: validatedData.socialLinks.map(link => ({
            platform: link.platform,
            name: link.platform.toLowerCase(),
            url: link.url,
            icon: link.platform.toLowerCase(),
          })),
        },
      },
      include: {
        socialLinks: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[SETTINGS_PATCH]', error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        socialLinks: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[SETTINGS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
