// Authentication middleware for Next.js
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes that require authentication
 */
export function authMiddleware(request: NextRequest) {
  // Get token from cookies or headers
  const token = request.cookies.get('auth_token')?.value;

  // Define protected routes
  const protectedRoutes = ['/profile', '/movies', '/tv-shows'];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect to home if accessing auth routes with token
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/movies/:path*', '/tv-shows/:path*', '/auth/:path*'],
};
