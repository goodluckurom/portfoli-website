import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export type Session = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
} | null;

export async function getSession(request?: NextRequest): Promise<Session> {
  try {
    let token;
    if (request) {
      // For middleware
      const cookieStore = request.cookies;
      token = cookieStore.get('session')?.value;
    } else {
      // For server components
      const cookieStore = cookies();
      token = cookieStore.get('session')?.value;
    }

    if (!token) return null;

    const payload = await decrypt(token);
    return payload as Session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export function isAdmin(session: Session): boolean {
  return session?.role === 'ADMIN';
}

export function setAuthCookie(token: string) {
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export function removeAuthCookie() {
  cookies().delete('session');
}
