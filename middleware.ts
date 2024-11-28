import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/sign-in'];
  if (publicPaths.includes(pathname)) {
    if (session) {
      // If user is signed in and tries to access auth pages, redirect to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to sign-in page if not authenticated
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (session.role !== 'ADMIN') {
      // Redirect to home if not an admin
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/sign-in',
  ],
};
