# EduckPro Vercel Deployment Guide

This guide will help you deploy the EduckPro frontend application to Vercel. The backend should be deployed separately to a service like Render (see DEPLOYMENT.md for full setup).

## Prerequisites

- GitHub account with your code repository
- Vercel account (sign up at https://vercel.com - free tier available)
- Backend API deployed and accessible (e.g., on Render)
- Backend URL (e.g., `https://your-backend.onrender.com`)

---

## Quick Start (5 Minutes)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose your EduckPro repository

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Set Environment Variable**:
   Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   Replace with your actual backend URL (no trailing slash)

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://your-project.vercel.app`

6. **Update Backend CORS**:
   - Go to your backend deployment (Render)
   - Add environment variable:
     ```
     FRONTEND_URL=https://your-project.vercel.app
     ```
   - Restart backend service

7. **Test Your App**:
   - Visit your Vercel URL
   - Try logging in with test credentials
   - Verify API calls work correctly

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set up environment variables when prompted
   - Confirm settings

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

---

## Configuration Files

### Root `vercel.json`
Located at project root for monorepo setup:
```json
{
  "version": 2,
  "name": "educkpro",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

### Frontend `vercel.json`
Located in `frontend/` directory:
- Configures build settings
- Sets up routing for SPA
- Adds security headers
- Configures PWA service worker

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.onrender.com` |

### How to Add Variables

**Via Dashboard**:
1. Go to project settings
2. Click "Environment Variables"
3. Add variable name and value
4. Select environments (Production, Preview, Development)
5. Save

**Via CLI**:
```bash
vercel env add VITE_API_URL
# Enter value when prompted
```

### Updating Variables

After changing environment variables, you need to redeploy:
```bash
vercel --prod
```

Or trigger redeploy in Vercel dashboard.

---

## Custom Domain Setup

### Add Custom Domain

1. **In Vercel Dashboard**:
   - Go to project settings
   - Click "Domains"
   - Click "Add"
   - Enter your domain (e.g., `educkpro.com`)

2. **Configure DNS**:
   
   **Option A - Using Vercel Nameservers (Recommended)**:
   - Update nameservers at your domain registrar to:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Wait for DNS propagation (can take up to 48 hours)

   **Option B - Using Custom DNS**:
   Add these records at your DNS provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Verify Domain**:
   - Vercel will automatically verify once DNS is configured
   - SSL certificate will be automatically provisioned

4. **Update Backend CORS**:
   Add your custom domain to backend environment:
   ```
   FRONTEND_URL=https://educkpro.com
   ```

---

## PWA Configuration

### Manifest Configuration

Update `frontend/public/manifest.json`:
```json
{
  "name": "EduckPro",
  "short_name": "EduckPro",
  "description": "School Management System",
  "start_url": "https://your-domain.vercel.app",
  "scope": "https://your-domain.vercel.app/",
  "display": "standalone",
  "theme_color": "#4f46e5",
  "background_color": "#ffffff"
}
```

### Service Worker

The service worker (`frontend/public/service-worker.js`) is automatically configured to work with Vercel's CDN.

Headers are set in `frontend/vercel.json` to ensure proper service worker registration.

---

## Automatic Deployments

### Git Integration

**Production Deployments**:
- Push to `main` branch → Deploys to production
- Automatic deployment on every commit

**Preview Deployments**:
- Create pull request → Generates preview URL
- Each commit gets a unique preview URL
- Perfect for testing before merging

### Deployment Protection

**Enable Deployment Protection** (Settings → Deployment Protection):
- Require approval before deploying
- Useful for production environments
- Free on Pro plan

---

## Monitoring and Analytics

### Vercel Analytics

1. **Enable Analytics**:
   - Go to project settings
   - Click "Analytics"
   - Enable Web Analytics

2. **View Metrics**:
   - Real User Monitoring (RUM)
   - Core Web Vitals
   - Page load times
   - Traffic sources

### Speed Insights

Track performance metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

---

## Build Configuration

### Build Output

Vercel automatically detects Vite configuration and builds:
- Input: `frontend/src/`
- Output: `frontend/dist/`
- Static assets optimized and cached

### Build Logs

View build logs in:
- Dashboard → Deployments → Click deployment → View Function Logs
- Useful for debugging build errors

### Build Cache

Vercel caches dependencies between builds:
- Faster subsequent builds
- Clear cache in deployment settings if needed

---

## Performance Optimization

### Automatic Optimizations

Vercel automatically provides:
- ✅ Global CDN distribution
- ✅ HTTP/2 and HTTP/3 support
- ✅ Brotli compression
- ✅ Image optimization (for images served through Vercel)
- ✅ Edge caching
- ✅ Automatic SSL/TLS

### Manual Optimizations

**Optimize Images**:
```javascript
// Use optimized image loading
<img loading="lazy" src="/images/icon.png" alt="Icon" />
```

**Code Splitting**:
Vite automatically code-splits, but you can optimize further:
```javascript
// Lazy load components
const Component = lazy(() => import('./Component'));
```

**Reduce Bundle Size**:
```bash
# Analyze bundle
npm run build
# Check dist/ folder size
```

---

## Troubleshooting

### Common Issues

**1. "Failed to Fetch" or API Errors**
- **Cause**: Incorrect API URL or CORS issues
- **Solution**: 
  - Verify `VITE_API_URL` in Vercel environment variables
  - Check backend CORS allows your Vercel domain
  - Ensure backend URL includes `https://`

**2. Build Fails**
- **Cause**: Missing dependencies or build errors
- **Solution**:
  - Check build logs in Vercel dashboard
  - Test build locally: `cd frontend && npm run build`
  - Verify all dependencies in `package.json`

**3. 404 on Routes**
- **Cause**: SPA routing not configured
- **Solution**: 
  - Verify `frontend/vercel.json` has rewrite rules
  - Should redirect all routes to `index.html`

**4. Service Worker Not Registering**
- **Cause**: Wrong headers or HTTPS issues
- **Solution**:
  - Check browser console for errors
  - Verify headers in `frontend/vercel.json`
  - Ensure site is served over HTTPS

**5. Environment Variables Not Working**
- **Cause**: Variables not prefixed with `VITE_` or need redeploy
- **Solution**:
  - All Vite env vars must start with `VITE_`
  - Redeploy after adding/changing variables
  - Clear browser cache

**6. Slow Initial Load**
- **Cause**: Large bundle size
- **Solution**:
  - Implement code splitting
  - Lazy load routes and components
  - Optimize images and assets

### Getting Help

1. **Check Vercel Status**: https://vercel-status.com
2. **View Build Logs**: Dashboard → Deployments → Logs
3. **Browser Console**: Check for JavaScript errors
4. **Network Tab**: Verify API calls
5. **Vercel Docs**: https://vercel.com/docs
6. **Community Support**: https://github.com/vercel/vercel/discussions

---

## Security Best Practices

### Headers

Security headers are configured in `frontend/vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Vercel environment variables
- ✅ Prefix with `VITE_` for client-side access
- ✅ Rotate secrets regularly

### HTTPS

- ✅ Automatic SSL/TLS certificates
- ✅ Force HTTPS (automatic)
- ✅ HSTS enabled by default

---

## Cost and Limits

### Free Tier
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Unlimited team members
- ✅ HTTPS/SSL certificates
- ✅ Preview deployments
- ✅ Automatic optimizations

### Pro Tier ($20/month)
- ✅ 1TB bandwidth/month
- ✅ Advanced analytics
- ✅ Password protection
- ✅ Deployment protection
- ✅ Priority support
- ✅ Team collaboration features

### Enterprise
- Custom bandwidth
- SLA guarantees
- Advanced security features
- Dedicated support

---

## Rollback and Version Control

### Rollback to Previous Deployment

1. Go to dashboard → Deployments
2. Find previous working deployment
3. Click three dots → Promote to Production
4. Instant rollback (zero downtime)

### Git Integration

- Each commit creates a deployment
- Easy to track changes
- Quick rollback to any version

---

## Maintenance and Updates

### Regular Updates

1. **Update Dependencies**:
   ```bash
   cd frontend
   npm update
   npm audit fix
   ```

2. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Update dependencies"
   git push
   ```

3. **Verify Deployment**:
   - Check build succeeds
   - Test functionality
   - Monitor for errors

### Database Migrations

If your backend has database changes:
1. Deploy backend first
2. Run migrations on backend
3. Deploy frontend
4. Test integration

---

## Multi-Environment Setup

### Production
- Branch: `main`
- URL: `https://educkpro.vercel.app`
- Auto-deploy on push

### Staging
- Branch: `staging`
- URL: `https://staging-educkpro.vercel.app`
- Test before production

### Development
- Branch: `dev`
- URL: `https://dev-educkpro.vercel.app`
- Latest development changes

**Configure in Vercel**:
1. Settings → Git → Production Branch
2. Set branch mappings
3. Configure environment variables per branch

---

## Checklist Before Going Live

- [ ] Backend deployed and accessible
- [ ] `VITE_API_URL` configured correctly
- [ ] Backend CORS includes Vercel domain
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Service worker functioning
- [ ] PWA installable on mobile
- [ ] All API endpoints working
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email notifications working (if configured)
- [ ] Push notifications working (if enabled)
- [ ] Analytics enabled
- [ ] Error monitoring set up
- [ ] Default passwords changed
- [ ] Production data seeded (if needed)

---

## Next Steps After Deployment

1. **Test Thoroughly**:
   - Create test accounts
   - Test all user flows
   - Verify mobile responsiveness
   - Test PWA installation

2. **Monitor Performance**:
   - Check Vercel Analytics
   - Monitor error rates
   - Track user engagement

3. **Gather Feedback**:
   - Beta test with real users
   - Collect feedback
   - Iterate and improve

4. **Scale as Needed**:
   - Upgrade plan if traffic increases
   - Optimize performance
   - Add monitoring tools

---

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vite Documentation**: https://vitejs.dev
- **React Documentation**: https://react.dev
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **EduckPro Repository**: https://github.com/YOUR_USERNAME/educkpro

---

## Congratulations! 🎉

Your EduckPro frontend is now deployed on Vercel with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant deployments
- ✅ Preview URLs for PRs
- ✅ PWA support
- ✅ Optimized performance

**Your Live App**: https://your-project.vercel.app

Start using EduckPro and manage your school efficiently!
