// Route configuration for Next.js
export const dynamicConfig = {
  dynamic: 'force-dynamic',
  revalidate: 0,
} as const

// Routes that need force-dynamic
export const dynamicRoutes = [
  // API Routes
  '/api/projects',
  '/api/projects/[id]',
  '/api/skills',
  '/api/blogs',
  '/api/blogs/[id]',
  '/api/blogs/[id]/comments',
  '/api/experience',
  '/api/admin/blogs',
  '/api/admin/projects',
  '/api/admin/skills',
  '/api/admin/experience',
  '/api/admin/users',
  '/api/auth/session',
  '/api/user/bookmarks',
  
  // Page Routes
  '/admin/blogs',
  '/admin/projects',
  '/admin/skills',
  '/admin/experience',
  '/admin/users',
  '/blog',
  '/blog/[slug]',
  '/projects',
  '/projects/[slug]',
  '/profile',
]

// Public API routes that don't require authentication
export const publicApiRoutes = [
  '/api/projects',
  '/api/projects/[id]', // For reading individual published projects
  '/api/skills',
  '/api/blogs',
  '/api/blogs/[id]', // For reading individual published blogs
  '/api/blogs/[id]/comments', // For reading blog comments
  '/api/experience',
  '/api/contact',
]

// Auth routes that need dynamic rendering
export const authRoutes = [
  '/api/auth/session',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/register',
  '/api/auth/user',
  '/api/auth/check',
  '/api/user/bookmarks',
  '/api/user/profile',
]

// Admin API routes
export const adminApiRoutes = [
  '/api/admin/blogs',
  '/api/admin/blogs/[id]',
  '/api/admin/projects',
  '/api/admin/projects/[id]',
  '/api/admin/skills',
  '/api/admin/skills/[id]',
  '/api/admin/experience',
  '/api/admin/experience/[id]',
  '/api/admin/users',
  '/api/admin/users/[id]',
  '/api/admin/settings',
]

// Admin page routes
export const adminPageRoutes = [
  '/admin',
  '/admin/blogs',
  '/admin/blogs/new',
  '/admin/blogs/[id]/edit',
  '/admin/projects',
  '/admin/projects/new',
  '/admin/projects/[id]/edit',
  '/admin/skills',
  '/admin/skills/new',
  '/admin/skills/[id]/edit',
  '/admin/experience',
  '/admin/experience/new',
  '/admin/experience/[id]/edit',
  '/admin/settings',
  '/admin/users',
]

// Public page routes that need dynamic rendering
export const publicRoutes = [
  '/blog',
  '/blog/[slug]',
  '/projects',
  '/projects/[slug]',
  '/profile',
]

// Helper function to match dynamic routes
export const matchDynamicRoute = (pathname: string, routes: string[]) => {
  return routes.some(route => {
    // Convert route pattern to regex
    // Replace [param] with regex pattern that matches anything except /
    const pattern = route
      .replace(/\[([^\]]+)\]/g, '([^/]+)')
      .replace(/\//g, '\\/') // Escape forward slashes
    const regex = new RegExp(`^${pattern}(/.*)?$`)
    return regex.test(pathname)
  })
}

// Helper to check if a route should be dynamic
export const shouldBeDynamic = (pathname: string) => {
  return matchDynamicRoute(pathname, dynamicRoutes)
}

// Middleware configuration
export const authConfig = {
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    authorized: ({ auth, request }: { auth: any; request: Request }) => {
      const { pathname } = new URL(request.url)
      const isLoggedIn = !!auth?.user
      const isAdmin = auth?.user?.role === 'ADMIN'
      
      // Check route types using the helper function
      const isPublicApiRoute = matchDynamicRoute(pathname, publicApiRoutes)
      const isAdminApiRoute = matchDynamicRoute(pathname, adminApiRoutes)
      const isAdminPageRoute = matchDynamicRoute(pathname, adminPageRoutes)
      
      // Public API routes are always accessible
      if (isPublicApiRoute) return true
      
      // Admin routes require admin role
      if (isAdminPageRoute || isAdminApiRoute) return isAdmin
      
      // Auth routes are accessible when not logged in
      if (pathname.startsWith('/auth/')) return !isLoggedIn
      
      // Profile route requires authentication
      if (pathname === '/profile') return isLoggedIn
      
      // Protected API routes require authentication
      if (pathname.startsWith('/api/user/')) return isLoggedIn
      
      // All other routes are public
      return true
    }
  }
}
