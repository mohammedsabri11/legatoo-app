# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Legatoo application.

## 1. Google Cloud Console Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Legatoo"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (for development)

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `http://localhost:3001` (development)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google` (development)
   - `http://localhost:3001/api/auth/google` (development)
   - Your production domain + `/api/auth/google`

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# API Configuration
NEXT_PUBLIC_API_URL=http://192.168.100.108:8000/api/v1
```

## 3. Features Implemented

### Google Sign-in Button
- **Location**: Signup page, above the regular form
- **Design**: Matches Google's design guidelines
- **Functionality**: Opens Google OAuth popup
- **Loading State**: Shows spinner during authentication
- **Error Handling**: Displays toast notifications for errors

### Authentication Flow
1. User clicks "Sign up with Google"
2. Google OAuth popup opens
3. User authorizes the application
4. Authorization code is sent to your backend
5. Backend exchanges code for user info
6. User is created/logged in
7. Redirect to dashboard

### User Data Retrieved
- **Email**: Primary email address
- **Name**: Full name
- **First Name**: Given name
- **Last Name**: Family name
- **Profile Picture**: Avatar image
- **Email Verified**: Verification status

## 4. Backend Integration

The Google authentication creates a user with:
- Google ID as unique identifier
- Email from Google account
- Name from Google profile
- Empty phone field (Google doesn't provide phone)
- Profile picture URL

## 5. Security Considerations

- **Token Validation**: All tokens are verified server-side
- **User Verification**: Email verification status is checked
- **Secure Storage**: Tokens are stored securely
- **HTTPS Required**: Production must use HTTPS

## 6. Testing

1. Start your development server: `npm run dev`
2. Go to `/auth/signup`
3. Click "Sign up with Google"
4. Complete the OAuth flow
5. Verify user is created and redirected to dashboard

## 7. Troubleshooting

### Common Issues:
- **"Google API not loaded"**: Ensure the Google script is loaded in layout.tsx
- **"Invalid client ID"**: Check your environment variables
- **"Redirect URI mismatch"**: Verify your redirect URIs in Google Console
- **"Scope not authorized"**: Check OAuth consent screen configuration

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test with different Google accounts
4. Check Google Cloud Console logs

## 8. Production Deployment

Before going to production:
1. Update OAuth consent screen to "Production"
2. Add production domains to authorized origins
3. Set up proper error monitoring
4. Test with real users
5. Configure proper CORS settings

## 9. Additional Features (Future)

- **Google Sign-in for Login**: Add to login page
- **Account Linking**: Link Google account to existing account
- **Profile Sync**: Sync profile picture and name updates
- **Revoke Access**: Allow users to disconnect Google account
