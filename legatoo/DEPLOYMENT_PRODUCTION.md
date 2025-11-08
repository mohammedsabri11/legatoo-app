# Production Deployment Guide

## Problem
The Next.js app crashes in production with PM2 even though the port is available.

## Root Cause
Next.js needs environment variables to be available at **BUILD TIME**, not runtime. The `.env.production` file must exist before running `npm run build`.

## Solution Steps

### 1. Create `.env.production` file on the server

```bash
cd ~/legatoo
nano .env.production
```

Add this content:
```env
NEXT_PUBLIC_API_URL=https://api.fastestfranchise.net/api/v1
NEXT_PUBLIC_BASE_PATH=https://legatoo.fastestfranchise.net
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NEXT_PUBLIC_SUPABASE_URL=https://otiivelflvidgyfshmjn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWl2ZWxmbHZpZGd5ZnNobWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTQ2MDksImV4cCI6MjA2NzQzMDYwOX0.aoJZdCUfLngPLO0uDoYHp3GdiQpZlf5PlEZlr2BIr1g"
```

### 2. Stop old processes
```bash
pm2 stop all
pm2 delete all
```

### 3. Build the application
```bash
npm install  # Install dependencies
npm run build  # Build with production environment variables
```

### 4. Start with PM2 using ecosystem file
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Optional: auto-start on server reboot
```

### 5. Check logs
```bash
pm2 logs next-frontend
```

## Troubleshooting

### If still getting errors:

1. **Check build logs**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

2. **Verify environment variables in build**
   ```bash
   grep -r "NEXT_PUBLIC" .next/
   ```

3. **Check Node version** (should be 18+)
   ```bash
   node --version
   ```

4. **Check if port is really free**
   ```bash
   sudo lsof -i :3000
   # or
   sudo netstat -tlnp | grep 3000
   ```

5. **Try a different port** (update ecosystem.config.js):
   ```javascript
   args: 'start -p 3001',  // Change from 3000 to 3001
   env: {
     // ...
     PORT: 3001  // Update here too
   }
   ```

6. **Check PM2 logs**
   ```bash
   pm2 logs --lines 50
   ```

### Alternative: Direct Node.js start (for testing)

```bash
# Start without PM2 to test
NODE_ENV=production npm start

# If that works, the issue is with PM2 configuration
```

## Important Notes

- Environment variables with `NEXT_PUBLIC_` prefix are **baked into the build**
- They cannot be changed at runtime for Next.js apps
- Must rebuild if you change environment variables
- `.env.production` is only loaded during build, not at runtime

## Verification

After deployment, verify:

1. Check if app is running:
   ```bash
   pm2 status
   ```

2. Check app health:
   ```bash
   curl http://localhost:3000
   ```

3. Check environment variables in browser:
   - Open DevTools (F12)
   - Console tab
   - Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
