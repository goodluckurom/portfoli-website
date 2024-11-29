import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Configure which routes should be dynamic
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/profile/:path*',
  ],
}
