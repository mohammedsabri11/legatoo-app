'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authUtils } from '@/lib/auth-utils'

interface GoogleUser {
  id: string
  email: string
  name: string
  given_name: string
  family_name: string
  picture: string
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    try {
      // Check if Google API is available
      if (typeof window === 'undefined' || !window.google) {
        throw new Error('Google API not loaded')
      }

      // Initialize Google OAuth2
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        scope: 'email profile',
        ux_mode: 'popup',
        callback: async (response: any) => {
          try {
            // Send the authorization code to your backend
            const backendResponse = await fetch('/api/auth/google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: response.code,
              }),
            })

            if (!backendResponse.ok) {
              throw new Error('Google authentication failed')
            }

            const data = await backendResponse.json()
            
            if (data.success) {
              // Store user data and token
              localStorage.setItem('user', JSON.stringify(data.data.user))
              localStorage.setItem('token', data.data.token)
              
              // Set cookie for server-side authentication
              authUtils.setAuthCookie(data.data.token)
              
              toast.success('Successfully signed up with Google!')
              
              // Redirect to dashboard
              setTimeout(() => {
                router.push('/dashboard')
              }, 1500)
            } else {
              throw new Error(data.message || 'Google authentication failed')
            }
          } catch (error: any) {
            console.error('Google auth error:', error)
            toast.error(error.message || 'Failed to sign up with Google')
          } finally {
            setIsLoading(false)
          }
        },
      })

      // Request authorization code
      client.requestCode()
      
    } catch (error: any) {
      console.error('Google sign-in error:', error)
      toast.error('Failed to initialize Google sign-in')
      setIsLoading(false)
    }
  }

  return {
    handleGoogleSignIn,
    isLoading,
  }
}

// Extend Window interface for Google API
declare global {
  interface Window {
    google: any
  }
}
