# Deployment Guide for Hostinger

This guide explains how to set up automatic deployment to Hostinger when pushing to the main branch.

## Prerequisites

1. GitHub repository with your code
2. Hostinger hosting account with FTP access
3. GitHub Actions enabled for your repository

## Setup Instructions

### 1. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

- `FTP_SERVER`: Your Hostinger FTP server address (e.g., `ftp.yourdomain.com`)
- `FTP_USERNAME`: Your FTP username
- `FTP_PASSWORD`: Your FTP password

### 2. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Enable GitHub Actions if not already enabled

### 3. Deploy Static Files

Since Hostinger shared hosting doesn't support Node.js server-side rendering, we'll deploy static files:

1. The workflow will automatically build your Next.js app
2. It will deploy the static files to your Hostinger `public_html` directory
3. Your site will be accessible at `https://yourdomain.com`

## Manual Deployment (Alternative)

If you prefer manual deployment:

1. Run `npm run build` locally
2. Upload the contents of `.next/static` to `public_html/_next/static/`
3. Upload the contents of `public` to `public_html/`
4. Create an `index.html` file that redirects to your static site

## File Structure After Deployment

```
public_html/
├── _next/static/          # Static assets
├── static/               # Public assets
├── logo.png             # Logo and favicons
├── favicon.ico
└── index.html           # Main page (if using static export)
```

## Troubleshooting

### Common Issues:

1. **FTP Connection Failed**: Check your FTP credentials in GitHub secrets
2. **Build Failed**: Ensure all dependencies are properly installed
3. **Files Not Uploading**: Check the server directory paths in the workflow

### Support:

- Check GitHub Actions logs for detailed error messages
- Verify FTP credentials with Hostinger support
- Ensure your Hostinger plan supports the required features

## Next Steps

After successful deployment:

1. Test your website at your domain
2. Set up custom domain if needed
3. Configure SSL certificate
4. Set up monitoring and analytics
