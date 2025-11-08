# Refresh Token System Documentation

## Overview

This document describes the comprehensive refresh token system implemented in the law-contract application. The system provides automatic token refresh, expiration handling, and secure token management.

## Features

- ✅ **Automatic Token Refresh**: Tokens are automatically refreshed when they expire or are about to expire
- ✅ **Token Expiration Tracking**: Monitors token expiration with 5-minute buffer
- ✅ **Secure Storage**: Tokens stored securely in localStorage with proper cleanup
- ✅ **Error Handling**: Graceful handling of refresh failures
- ✅ **Debugging Support**: Built-in token information for debugging

## API Endpoints

### Refresh Token Endpoint
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your_refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token", 
    "token_type": "bearer",
    "expires_in": 900
  }
}
```

## Core Functions

### `authUtils.storeTokens(accessToken, refreshToken, expiresIn)`
Stores tokens with creation timestamp for expiration tracking.

**Parameters:**
- `accessToken` (string): The access token
- `refreshToken` (string): The refresh token  
- `expiresIn` (number): Token expiration time in seconds

**Example:**
```javascript
authUtils.storeTokens(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "cH2230crsf_wbl11xJYd5Lw9fIaPeoD6OJJE0n-P42E",
  900
);
```

### `authUtils.isTokenExpired()`
Checks if the current token is expired or will expire within 5 minutes.

**Returns:** `boolean`

**Example:**
```javascript
if (authUtils.isTokenExpired()) {
  console.log("Token needs refresh");
}
```

### `authUtils.refreshAccessToken()`
Manually refreshes the access token using the stored refresh token.

**Returns:** `Promise<boolean>` - Success status

**Example:**
```javascript
const success = await authUtils.refreshAccessToken();
if (success) {
  console.log("Token refreshed successfully");
} else {
  console.log("Failed to refresh token");
}
```

### `authUtils.ensureValidToken()`
Automatically checks token validity and refreshes if needed.

**Returns:** `Promise<boolean>` - Token validity status

**Example:**
```javascript
const isValid = await authUtils.ensureValidToken();
if (!isValid) {
  // Redirect to login
  router.push('/auth/login');
}
```

### `authUtils.getTokenInfo()`
Returns detailed token information for debugging.

**Returns:** Object with token details or `null`

**Example:**
```javascript
const tokenInfo = authUtils.getTokenInfo();
console.log(tokenInfo);
// Output:
// {
//   hasToken: true,
//   hasRefreshToken: true,
//   expiresIn: 900,
//   createdAt: "2024-01-20T10:30:00.000Z",
//   expiresAt: "2024-01-20T10:45:00.000Z", 
//   timeUntilExpiry: 300,
//   isExpired: false,
//   willExpireSoon: true
// }
```

## Usage Examples

### 1. Basic Token Management

```javascript
import { authUtils } from '@/lib/auth-utils';

// Check if user is authenticated
if (authUtils.isAuthenticated()) {
  console.log("User is logged in");
}

// Get current access token
const token = authUtils.getAccessToken();

// Check if token needs refresh
if (authUtils.isTokenExpired()) {
  await authUtils.refreshAccessToken();
}
```

### 2. API Request with Auto-Refresh

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  // Ensure token is valid before making request
  const tokenValid = await authUtils.ensureValidToken();
  
  if (!tokenValid) {
    throw new Error('Authentication required');
  }
  
  const token = authUtils.getAccessToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // If request fails with 401, try to refresh and retry
  if (response.status === 401) {
    const refreshed = await authUtils.refreshAccessToken();
    if (refreshed) {
      const newToken = authUtils.getAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        }
      });
    } else {
      throw new Error('Authentication failed');
    }
  }
  
  return response;
}
```

### 3. React Hook Integration

```javascript
import { useEffect } from 'react';
import { authUtils } from '@/lib/auth-utils';

function useTokenRefresh() {
  useEffect(() => {
    const checkToken = async () => {
      if (authUtils.isAuthenticated()) {
        await authUtils.ensureValidToken();
      }
    };
    
    // Check token every 5 minutes
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    
    // Initial check
    checkToken();
    
    return () => clearInterval(interval);
  }, []);
}
```

### 4. Logout with Cleanup

```javascript
function handleLogout() {
  // Clear all authentication data
  authUtils.clearAuth();
  
  // Redirect to login page
  router.push('/auth/login');
}
```

## Error Handling

### Refresh Token Failure
When refresh token fails, the system automatically:
1. Clears all stored authentication data
2. Logs the error for debugging
3. Returns `false` to indicate failure

```javascript
const refreshed = await authUtils.refreshAccessToken();
if (!refreshed) {
  // Handle refresh failure
  console.log("Refresh failed, user needs to re-login");
  authUtils.clearAuth();
  router.push('/auth/login');
}
```

### Network Errors
The system handles network errors gracefully:

```javascript
try {
  await authUtils.refreshAccessToken();
} catch (error) {
  console.error('Network error during refresh:', error);
  // Handle network error appropriately
}
```

## Security Considerations

### Token Storage
- **Access Token**: Stored in localStorage (client-side)
- **Refresh Token**: Stored in localStorage (client-side)
- **Cookies**: Access token also stored in secure HTTP-only cookie

### Token Expiration
- **Access Token**: 15 minutes (900 seconds)
- **Refresh Buffer**: 5 minutes before expiration
- **Automatic Cleanup**: All tokens cleared on logout

### Best Practices
1. **Always check token validity** before making authenticated requests
2. **Handle refresh failures** by redirecting to login
3. **Clear tokens** on logout or refresh failure
4. **Monitor token expiration** in production

## Debugging

### Token Information
Use `authUtils.getTokenInfo()` to debug token issues:

```javascript
// In browser console
console.log(authUtils.getTokenInfo());
```

### Console Logs
The system provides detailed console logs:
- `🔄 Refreshing access token...`
- `✅ Access token refreshed successfully`
- `⚠️ Token expired or expiring soon, attempting refresh...`
- `🚨 Failed to refresh token, user needs to re-authenticate`

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://192.168.100.108:8000/api/v1
```

### Token Expiration Buffer
Default: 5 minutes (300 seconds)
```javascript
// In authUtils.isTokenExpired()
return timeUntilExpiry < 300; // 5 minutes
```

## Migration Guide

### From Old System
If migrating from a system without refresh tokens:

1. **Update API calls** to use `authUtils.ensureValidToken()`
2. **Replace manual token checks** with `authUtils.isTokenExpired()`
3. **Update logout** to use `authUtils.clearAuth()`
4. **Add refresh token handling** to login/signup flows

### Example Migration
```javascript
// Old way
const token = localStorage.getItem('token');
if (!token) {
  redirectToLogin();
}

// New way
const tokenValid = await authUtils.ensureValidToken();
if (!tokenValid) {
  redirectToLogin();
}
```

## Troubleshooting

### Common Issues

1. **"No refresh token available"**
   - Check if refresh token is stored in localStorage
   - Verify login/signup response includes refresh_token

2. **"Failed to refresh token"**
   - Check API endpoint `/auth/refresh` is working
   - Verify refresh token format and validity

3. **"Token expired" errors**
   - Ensure `authUtils.ensureValidToken()` is called before API requests
   - Check token expiration buffer settings

### Debug Steps
1. Check token info: `authUtils.getTokenInfo()`
2. Verify API endpoint: Test `/auth/refresh` manually
3. Check console logs for detailed error messages
4. Verify localStorage has all required tokens

## API Reference

### Types
```typescript
interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  errors?: Record<string, string>;
}
```

### Methods
- `storeTokens(accessToken, refreshToken, expiresIn)`
- `isTokenExpired()`
- `refreshAccessToken()`
- `ensureValidToken()`
- `getTokenInfo()`
- `getAccessToken()`
- `getRefreshToken()`
- `clearAuth()`

## Support

For issues or questions about the refresh token system:
1. Check console logs for detailed error messages
2. Use `authUtils.getTokenInfo()` for debugging
3. Verify API endpoints are working correctly
4. Check network requests in browser dev tools
