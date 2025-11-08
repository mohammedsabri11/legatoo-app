# API Integration with React Query

This document explains how the authentication API integration works with React Query.

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Replace `http://localhost:3001/api` with your actual API endpoint.

### 2. Dependencies Installed

- `@tanstack/react-query` - React Query library
- `@tanstack/react-query-devtools` - Development tools for debugging

## API Structure

### Authentication Endpoints

The following endpoints are expected:

#### Signup
- **POST** `/auth/signup`
- **Body**: 
  ```json
  {
    "firstName": "string",
    "lastName": "string", 
    "email": "string",
    "phone": "string",
    "password": "string",
    "confirmPassword": "string",
    "agreeToTerms": boolean
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string"
      },
      "token": "string"
    }
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: Same as signup

#### Forgot Password
- **POST** `/auth/forgot-password`
- **Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```

## Error Handling

The API should return errors in this format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

## React Query Hooks

### Available Hooks

- `useSignup()` - Signup mutation
- `useLogin()` - Login mutation  
- `useForgotPassword()` - Forgot password mutation
- `useLogout()` - Logout mutation
- `useUser()` - Get current user

### Usage Example

```tsx
import { useSignup } from '@/hooks/useAuth'

function SignupForm() {
  const signupMutation = useSignup()
  
  const handleSubmit = (data) => {
    signupMutation.mutate(data, {
      onError: (error) => {
        console.error('Signup failed:', error)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={signupMutation.isPending}>
        {signupMutation.isPending ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  )
}
```

## Features

- ✅ Automatic loading states
- ✅ Error handling with field-specific errors
- ✅ Automatic token storage
- ✅ User state management
- ✅ Automatic redirects on success
- ✅ Retry logic for failed requests
- ✅ Development tools integration

## Next Steps

1. Set up your backend API with the expected endpoints
2. Update the `NEXT_PUBLIC_API_URL` environment variable
3. Test the integration
4. Add additional API endpoints as needed

## Development Tools

React Query DevTools are automatically included in development mode. You can access them to debug queries and mutations.
