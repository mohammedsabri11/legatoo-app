import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code)
    
    if (!tokens.access_token) {
      return NextResponse.json(
        { success: false, message: 'Failed to get access token' },
        { status: 400 }
      )
    }

    // Verify the token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token payload' },
        { status: 400 }
      )
    }

    // Extract user information
    const userData = {
      id: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    }

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate JWT token
    // 4. Return user data and token

    // For now, we'll simulate this process
    const mockUser = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: '', // Google doesn't provide phone
      picture: userData.picture,
    }

    const mockToken = `google_token_${userData.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user: mockUser,
        token: mockToken,
      },
    })

  } catch (error: unknown) {
    console.error('Google auth error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Google authentication failed'
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage
      },
      { status: 500 }
    )
  }
}
