// Utility functions for authentication and cookie management

import { authApi } from './api/auth'

export const authUtils = {
  // Set authentication cookie
  setAuthCookie: (token: string) => {
    if (typeof window !== 'undefined') {
      // Only use secure flag in production (HTTPS)
      const isSecure = window.location.protocol === 'https:'
      const secureFlag = isSecure ? '; secure' : ''
      document.cookie = `auth-token=${token}; path=/; max-age=86400${secureFlag}; samesite=lax`
      console.log('🍪 Auth cookie set:', { isSecure, secureFlag })
    }
  },

  // Clear authentication cookie
  clearAuthCookie: () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  },

  // Get authentication cookie
  getAuthCookie: (): string | null => {
    if (typeof window === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => 
      cookie.trim().startsWith('auth-token=')
    )
    
    return authCookie ? authCookie.split('=')[1] : null
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('token')
    const cookie = authUtils.getAuthCookie()
    
    return !!(token && cookie)
  },

  // Get user from localStorage
  getUser: () => {
    if (typeof window === 'undefined') return null
    
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Get access token from localStorage
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  },

  // Get refresh token from localStorage
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  },

  // Get token expiration time
  getTokenExpiration: (): number | null => {
    if (typeof window === 'undefined') return null
    const expiresIn = localStorage.getItem('token_expires_in')
    return expiresIn ? parseInt(expiresIn) : null
  },

  // Check if token is expired or will expire soon (within 5 minutes)
  isTokenExpired: (): boolean => {
    if (typeof window === 'undefined') return true
    
    const tokenExpiration = authUtils.getTokenExpiration()
    if (!tokenExpiration) return true
    
    // Get token creation time (assuming it was created when stored)
    const tokenCreatedAt = localStorage.getItem('token_created_at')
    if (!tokenCreatedAt) return true
    
    const createdAt = parseInt(tokenCreatedAt)
    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = createdAt + tokenExpiration - now
    
    // Consider expired if less than 5 minutes remaining (for 15-minute tokens)
    return timeUntilExpiry < 300
  },

  // Store tokens with creation timestamp
  storeTokens: (accessToken: string, refreshToken: string, expiresIn: number) => {
    if (typeof window === 'undefined') return
    
    const now = Math.floor(Date.now() / 1000)
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('token_expires_in', expiresIn.toString())
    localStorage.setItem('token_created_at', now.toString())
    
    // Update cookie
    authUtils.setAuthCookie(accessToken)
  },

  // Store user and profile data
  storeUserData: (user: { id: number; email: string; is_active: boolean; is_verified: boolean; role: string; last_login: string }, profile: { id: number; first_name: string; last_name: string; phone_number: string; account_type: string } | null) => {
    if (typeof window === 'undefined') return
    
    localStorage.setItem('user', JSON.stringify(user))
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile))
    }
  },

  // Get profile from localStorage
  getProfile: () => {
    if (typeof window === 'undefined') return null
    
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(profile) : null
  },

  // Refresh access token using refresh token
  refreshAccessToken: async (): Promise<boolean> => {
    try {
      const refreshToken = authUtils.getRefreshToken()
      if (!refreshToken) {
        console.warn('No refresh token available')
        return false
      }

      console.log('🔄 Refreshing access token...')
      const response = await authApi.refreshToken(refreshToken)
      
      if (response.success && response.data) {
        const { access_token, refresh_token, expires_in } = response.data
        
        // Store new tokens
        authUtils.storeTokens(access_token, refresh_token, expires_in)
        
        console.log('✅ Access token refreshed successfully')
        return true
      } else {
        console.error('❌ Failed to refresh token:', response.message)
        return false
      }
    } catch (error) {
      console.error('💥 Error refreshing token:', error)
      return false
    }
  },

  // Auto-refresh token if needed
  ensureValidToken: async (): Promise<boolean> => {
    if (!authUtils.isTokenExpired()) {
      return true // Token is still valid
    }

    console.log('⚠️ Token expired or expiring soon, attempting refresh...')
    const refreshed = await authUtils.refreshAccessToken()
    
    if (!refreshed) {
      console.warn('🚨 Failed to refresh token, user needs to re-authenticate')
      authUtils.clearAuth()
      return false
    }

    return true
  },

  // Start automatic token refresh for short-lived tokens
  startTokenRefreshTimer: (): NodeJS.Timeout | null => {
    if (typeof window === 'undefined') return null
    
    console.log('🔄 Starting automatic token refresh timer (every 5 minutes)')
    
    // Check every 5 minutes for 15-minute tokens
    return setInterval(async () => {
      console.log('⏰ Token refresh timer tick - checking token validity...')
      if (authUtils.isAuthenticated()) {
        await authUtils.ensureValidToken()
      }
    }, 300000) // 5 minutes = 300,000 milliseconds
  },

  // Stop automatic token refresh timer
  stopTokenRefreshTimer: (timer: NodeJS.Timeout | null) => {
    if (timer) {
      console.log('🛑 Stopping automatic token refresh timer')
      clearInterval(timer)
    }
  },

  // Clear all authentication data
  clearAuth: () => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expires_in')
    localStorage.removeItem('token_created_at')
    authUtils.clearAuthCookie()
  },

  // Validate token format (basic validation)
  isValidToken: (token: string): boolean => {
    return !!(token && token.length > 10 && typeof token === 'string')
  },

  // Get token info for debugging
  getTokenInfo: () => {
    if (typeof window === 'undefined') return null
    
    const token = authUtils.getAccessToken()
    const refreshToken = authUtils.getRefreshToken()
    const expiresIn = authUtils.getTokenExpiration()
    const createdAt = localStorage.getItem('token_created_at')
    
    if (!token || !createdAt) return null
    
    const now = Math.floor(Date.now() / 1000)
    const created = parseInt(createdAt)
    const expiresAt = created + (expiresIn || 0)
    const timeUntilExpiry = expiresAt - now
    
    return {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      expiresIn,
      createdAt: new Date(created * 1000).toISOString(),
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      timeUntilExpiry,
      isExpired: timeUntilExpiry <= 0,
      willExpireSoon: timeUntilExpiry < 300
    }
  }
}

// Protected route configuration
export const protectedRoutes = [
  '/dashboard',
  '/dashboard/ai-analysis',
  '/dashboard/profile',
  '/dashboard/settings',
  '/dashboard/integrations',
  '/dashboard/reports',
  '/dashboard/compliance-score',
  '/dashboard/fraud-detection',
  '/dashboard/ip-protection',
  '/dashboard/compliance',
  '/dashboard/smart-editor',
  '/dashboard/templates',
  '/dashboard/class-actions',
  '/dashboard/cases',
  '/dashboard/contracts'
]

export type UserRole = 'super_admin' | 'admin' | 'user'

interface RoleProtectedRoute {
  prefix: string
  allowedRoles: UserRole[]
}

const roleProtectedRoutes: RoleProtectedRoute[] = [
  {
    prefix: '/dashboard/admin',
    allowedRoles: ['super_admin'],
  },
  {
    prefix: '/dashboard/subscribers',
    allowedRoles: ['super_admin'],
  },
  {
    prefix: '/dashboard/plans',
    allowedRoles: ['super_admin'],
  },
  {
    prefix: '/dashboard',
    allowedRoles: ['admin', 'user'],
  },
]

const sortedRoleProtectedRoutes = roleProtectedRoutes.sort(
  (a, b) => b.prefix.length - a.prefix.length
)

// Public routes that don't require authentication
export const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth/google'
]

// Check if a route is protected
export const isProtectedRoute = (pathname: string): boolean => {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export const getAllowedRolesForRoute = (
  pathname: string
): UserRole[] | null => {
  const match = sortedRoleProtectedRoutes.find(route =>
    pathname.startsWith(route.prefix)
  )
  return match ? match.allowedRoles : null
}

export const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case 'super_admin':
      return '/dashboard/admin'
    case 'admin':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

// Check if a route is public
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/')
  )
}
