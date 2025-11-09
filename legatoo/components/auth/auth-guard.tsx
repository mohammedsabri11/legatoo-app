'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useAuth'
import {
  isProtectedRoute,
  isPublicRoute,
  getAllowedRolesForRoute,
  getDefaultRouteForRole,
  UserRole,
} from '@/lib/auth-utils'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const user = useUser()

  // Define auth routes (login, signup, etc.)
  const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']

  useEffect(() => {
    const checkAuth = () => {
      // Check if current route is protected
      const isProtected = isProtectedRoute(pathname)

      // Check if current route is an auth route
      const isAuthRoute = authRoutes.includes(pathname)

      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      if (isProtected) {
        // If accessing protected route without token, redirect to login
        if (!token || !user) {
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`
          router.push(loginUrl)
          return
        }

        const userRole = (user.role || 'user') as UserRole
        const allowedRoles = getAllowedRolesForRoute(pathname)
        if (allowedRoles && !allowedRoles.includes(userRole)) {
          router.replace(getDefaultRouteForRole(userRole))
          return
        }

        setIsAuthenticated(true)
      } else if (isAuthRoute) {
        // If accessing auth route with token, redirect to dashboard
        if (token && user) {
          router.push('/dashboard')
          return
        }
        setIsAuthenticated(true)
      } else {
        // For other routes (like home page), allow access
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    }

    // Add a small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100)
    
    return () => clearTimeout(timer)
  }, [pathname, router, user])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render children if authenticated or on public routes
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
