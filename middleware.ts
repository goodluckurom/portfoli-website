import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

// Public API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth',
  '/api/contact',
  '/api/projects',
  '/api/skills',
  '/api/blogs',
  '/api/experience'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a public API route
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  try {
    const session = await getSession(request);

    // Public auth paths
    const publicPaths = ['/auth/login', '/auth/register'];
    if (publicPaths.includes(pathname)) {
      if (session?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if(session) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
      return NextResponse.next();
    }

    // Handle admin routes
    if (pathname.startsWith('/admin')) {
      if (!session) {
        const signInUrl = new URL('/auth/login', request.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }
      
      if (session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      return NextResponse.next();
    }

    // Handle protected routes
    if (pathname === '/profile') {
      if (!session) {
        const signInUrl = new URL('/auth/login', request.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }
    }

    // Handle protected API routes
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const signInUrl = new URL('/auth/login', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/projects',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/profile',
    '/auth/login',
    '/auth/register'
  ]
};