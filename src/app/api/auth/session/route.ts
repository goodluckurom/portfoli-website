import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    console.log('Session cookie in API:', sessionCookie);

    if (!sessionCookie?.value) {
      console.log('No session cookie found');
      return NextResponse.json({ user: null });
    }

    // Decrypt session token
    const session = await decrypt(sessionCookie.value);
    console.log('Decrypted session:', session);

    if (!session?.email) {
      console.log('Invalid session data');
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
      console.log('No user found for session:', session);
      return NextResponse.json({ user: null });
    }

    console.log('User found:', user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
