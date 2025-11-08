# Environment Variables Setup

## Production Environment

Create a `.env.production` file on your server with the following content:

```env
# API Configuration - Backend URL
NEXT_PUBLIC_API_URL=https://api.fastestfranchise.net/api/v1

# Base Path - Frontend URL
NEXT_PUBLIC_BASE_PATH=https://legatoo.fastestfranchise.net

# Google OAuth (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://otiivelflvidgyfshmjn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWl2ZWxmbHZpZGd5ZnNobWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTQ2MDksImV4cCI6MjA2NzQzMDYwOX0.aoJZdCUfLngPLO0uDoYHp3GdiQpZlf5PlEZlr2BIr1g
```

## Development Environment

Create a `.env.local` file for local development:

```env
# API Configuration - Local Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Base Path - Local Frontend
NEXT_PUBLIC_BASE_PATH=http://localhost:3000

# Google OAuth (same as production or separate dev credentials)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# Supabase Configuration (same as production)
NEXT_PUBLIC_SUPABASE_URL=https://otiivelflvidgyfshmjn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWl2ZWxmbHZpZGd5ZnNobWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTQ2MDksImV4cCI6MjA2NzQzMDYwOX0.aoJZdCUfLngPLO0uDoYHp3GdiQpZlf5PlEZlr2BIr1g
```

## Domain Configuration

### Backend (API)
- **URL**: `https://api.fastestfranchise.net/`
- **Full API URL**: `https://api.fastestfranchise.net/api/v1`

### Frontend (Web App)
- **URL**: `https://legatoo.fastestfranchise.net/`

## After Changing Domains

When you change domain configurations:

1. **Update environment files** on the server
2. **Rebuild the application** (required for Next.js):
   ```bash
   npm run build
   ```
3. **Restart PM2**:
   ```bash
   pm2 restart all
   ```

## Important Notes

- Environment variables prefixed with `NEXT_PUBLIC_` are embedded in the build
- They are NOT available at runtime - must rebuild to apply changes
- Never commit `.env` or `.env.local` files to git (they're in `.gitignore`)
- Always use `.env.production` on production servers

