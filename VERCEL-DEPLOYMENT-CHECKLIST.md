# Vercel Deployment - Quick Checklist

Follow these steps to deploy EduckPro frontend to Vercel in under 10 minutes.

## Prerequisites Checklist

- [ ] GitHub repository with EduckPro code
- [ ] Vercel account (free tier works - signup at https://vercel.com)
- [ ] Backend API deployed and running (e.g., Render, Railway, etc.)
- [ ] Backend URL ready (e.g., `https://your-backend.onrender.com`)

---

## Deployment Steps

### 1. Prepare Your Code (2 minutes)

- [ ] Ensure all changes are committed to Git
- [ ] Push to GitHub main branch
  ```bash
  git add .
  git commit -m "Ready for Vercel deployment"
  git push origin main
  ```

### 2. Connect to Vercel (3 minutes)

- [ ] Go to https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Select your EduckPro repository
- [ ] Click "Import"

### 3. Configure Project Settings (2 minutes)

- [ ] **Framework Preset**: Select **Vite**
- [ ] **Root Directory**: Set to `frontend`
- [ ] **Build Command**: Should auto-detect as `npm run build`
- [ ] **Output Directory**: Should auto-detect as `dist`
- [ ] **Install Command**: Should auto-detect as `npm install`

### 4. Set Environment Variables (1 minute)

- [ ] Click "Environment Variables" section
- [ ] Add variable:
  - **Name**: `VITE_API_URL`
  - **Value**: `https://your-backend.onrender.com` (replace with your actual backend URL)
  - **Environment**: Select all (Production, Preview, Development)
- [ ] Click "Add"

### 5. Deploy (2 minutes)

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (typically 2-3 minutes)
- [ ] You'll see "Congratulations!" when done
- [ ] Copy your deployment URL (e.g., `https://your-project.vercel.app`)

### 6. Update Backend CORS (1 minute)

- [ ] Go to your backend deployment (e.g., Render dashboard)
- [ ] Find environment variables section
- [ ] Add or update `FRONTEND_URL` variable:
  - **Value**: Your Vercel URL (e.g., `https://your-project.vercel.app`)
- [ ] Save and restart backend service

### 7. Test Deployment (2 minutes)

- [ ] Visit your Vercel URL
- [ ] Test login with default credentials:
  - Email: `admin@educkpro.com`
  - Password: `admin123`
- [ ] Verify API calls are working (check browser console for errors)
- [ ] Test navigation between pages
- [ ] Check that data loads correctly

---

## Post-Deployment Tasks

### Security (Required)

- [ ] Change default admin password immediately
- [ ] Create new admin accounts with strong passwords
- [ ] Disable or delete demo accounts

### PWA Configuration (Optional)

- [ ] Update `frontend/public/manifest.json`:
  - Change `start_url` to your Vercel URL
  - Change `scope` to your Vercel URL
- [ ] Commit and push changes (auto-deploys)
- [ ] Test PWA installation on mobile device

### Custom Domain (Optional)

- [ ] Go to Vercel project settings
- [ ] Click "Domains" tab
- [ ] Add your custom domain
- [ ] Follow DNS configuration instructions
- [ ] Update backend `FRONTEND_URL` with custom domain

### Monitoring (Recommended)

- [ ] Enable Vercel Analytics (Project Settings → Analytics)
- [ ] Enable Speed Insights for performance tracking
- [ ] Check deployment logs regularly

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `frontend/package.json`
- Test build locally: `cd frontend && npm run build`

### API Errors ("Failed to fetch")
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend CORS settings include your Vercel URL
- Ensure backend URL includes `https://`
- Check browser console for specific error messages

### 404 on Page Refresh
- Verify `frontend/vercel.json` exists with rewrite rules
- Check Vercel deployment logs

### Changes Not Showing
- Force redeploy in Vercel dashboard
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check if deployment actually succeeded

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `VITE_API_URL` | Yes | `https://backend.onrender.com` | No trailing slash |

### Backend (e.g., Render)

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `FRONTEND_URL` | Yes | `https://your-app.vercel.app` | Must match exactly |
| `DATABASE_URL` | Yes | `postgresql://...` | From database service |
| `JWT_SECRET` | Yes | Random 32+ char string | Keep secret |
| `PORT` | Yes | `4000` | Usually 4000 |

---

## Common Commands

### Redeploy Production
```bash
# Via CLI
vercel --prod

# Or push to GitHub main branch (auto-deploys)
git push origin main
```

### View Logs
```bash
vercel logs
```

### Check Deployment Status
```bash
vercel ls
```

---

## Support Resources

- **Detailed Guide**: See `VERCEL-DEPLOYMENT-GUIDE.md`
- **General Deployment**: See `DEPLOYMENT.md`
- **Vercel Docs**: https://vercel.com/docs
- **Backend Guide**: See `RENDER-DEPLOYMENT-GUIDE.md`

---

## Success Indicators

✅ **Deployment is successful when**:
- Build completes without errors
- App loads at Vercel URL
- Login works correctly
- API calls return data (not CORS errors)
- Navigation works smoothly
- No console errors in browser

---

## Next Steps After Deployment

1. **Change Default Password**: Login and update admin password
2. **Create School**: Set up your school profile
3. **Invite Users**: Add teachers, parents
4. **Test Features**: Try creating classes, enrolling students
5. **Monitor Performance**: Check Vercel analytics
6. **Gather Feedback**: Share with initial users

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **New Deployment**: https://vercel.com/new
- **Documentation**: https://vercel.com/docs

---

**Estimated Total Time**: 10-15 minutes

**Congratulations!** 🎉 Your EduckPro app is now live on Vercel!
