import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDynamicConfig } from '@/lib/dynamic';

export const dynamic = getDynamicConfig('/api/auth/session');

export async function GET(req: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    // Decrypt session token
    const session = await decrypt(sessionCookie.value);

    if (!session?.email) {
      return NextResponse.json({ user: null });
    }

    // Fetch full user data from database using session email
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
