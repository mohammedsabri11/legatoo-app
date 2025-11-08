import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone mode for PM2 deployment
  output: 'standalone',
  
  // Enable static export for Hostinger deployment
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configure asset prefix if using custom domain
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '',
  
  // Allow cross-origin requests from local network IPs during development
  allowedDevOrigins: ['192.168.100.13'],
  
  // Explicitly define environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' 
      ? 'https://api.fastestfranchise.net/api/v1' 
      : 'http://localhost:8000/api/v1'),
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || 'https://legatoo.fastestfranchise.net',
  },
};

export default nextConfig;
