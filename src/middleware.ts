import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession(request);

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/blog",
    "/projects",
    "/api/contact", // Make contact form endpoint public
    "/api/blogs/[id]/views", // Public endpoint for blog views
  ];

  // Check if the current path matches any public path pattern
  const isPublicPath = publicPaths.some(path => {
    // Convert path pattern to regex
    const pattern = path
      .replace("/", "\\/")
      .replace("[id]", "[^\\/]+")
      .replace("[slug]", "[^\\/]+");
    const regex = new RegExp(`^${pattern}($|\\?|\\/)`, "i");
    return regex.test(request.nextUrl.pathname);
  });

  // Allow public paths and static files
  if (
    isPublicPath ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.includes("/images/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protected API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return NextResponse.next();
  }

  // Admin routes require ADMIN role
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected pages
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Use experimental-edge runtime and specify matcher
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
  runtime: 'experimental-edge',
};
