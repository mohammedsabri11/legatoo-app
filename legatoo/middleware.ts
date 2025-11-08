import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isProtectedRoute, isPublicRoute } from './lib/auth-utils'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtected = isProtectedRoute(pathname)
  
  // Check if the current path is a public route
  const isPublic = isPublicRoute(pathname)
  
  // If it's a protected route, check for authentication
  if (isProtected) {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // If user is on login/signup page and has a token, redirect to dashboard
  if ((pathname === '/auth/login' || pathname === '/auth/signup') && !isPublic) {
    const token = request.cookies.get('auth-token')?.value
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
