# EduckPro Deployment Guide

This guide will walk you through deploying EduckPro to production using **Vercel** (frontend) and **Render** (backend).

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- PostgreSQL database (Render provides free PostgreSQL)

---

## Part 1: Push Code to GitHub

1. **Initialize Git Repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., "educkpro")
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/educkpro.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Render

### Step 1: Create PostgreSQL Database

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: educkpro-db
   - **Database**: educkpro
   - **User**: (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click **Create Database**
5. **Important**: Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Generate VAPID Keys (for Push Notifications)

On your local machine:
```bash
cd backend
node generate-vapid-keys.js
```

Copy the generated public and private keys.

### Step 3: Deploy Backend Service

1. In Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: educkpro-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Region**: Same as database
   - **Branch**: main
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click **Advanced** → **Add Environment Variable**

   Add these variables:
   ```
   DATABASE_URL=<paste Internal Database URL from Step 1>
   JWT_SECRET=<generate a random 32-character string>
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=<leave blank for now, will add after Vercel deployment>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your Gmail address>
   EMAIL_PASS=<your Gmail App Password>
   EMAIL_FROM=EduckPro <noreply@yourschool.com>
   VAPID_PUBLIC_KEY=<paste from generate-vapid-keys.js>
   VAPID_PRIVATE_KEY=<paste from generate-vapid-keys.js>
   ```

   **Note**: For Gmail App Password:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords" → Generate new app password
   - Use this password (not your regular Gmail password)

5. Click **Create Web Service**

6. Wait for deployment to complete (5-10 minutes)

7. **Copy your backend URL**: 
   - Example: `https://educkpro-backend.onrender.com`

### Step 4: Seed Initial Data

1. In Render Dashboard, go to your backend service
2. Click **Shell** tab (on the right side)
3. Run:
   ```bash
   npx prisma db seed
   ```

4. This will create:
   - Super admin account: `admin@educkpro.com` / `admin123`
   - Sample schools, users, and data

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Prepare Frontend Environment

1. Create `.env.production` file in `frontend/` directory:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   Replace with your actual Render backend URL from Part 2.

2. Commit this change:
   ```bash
   git add frontend/.env.production
   git commit -m "Add production environment variables"
   git push
   ```

### Step 2: Deploy to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
5. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (your Render backend URL)

6. Click **Deploy**

7. Wait for deployment (2-3 minutes)

8. **Copy your frontend URL**:
   - Example: `https://educkpro.vercel.app`

### Step 3: Update Backend CORS

1. Go back to Render Dashboard → Your Backend Service
2. Go to **Environment** tab
3. Edit the `FRONTEND_URL` variable:
   - Value: `https://your-app.vercel.app` (your Vercel URL)
4. Click **Save Changes**
5. Service will automatically redeploy

---

## Part 4: Update PWA Configuration

1. Update `frontend/public/manifest.json`:
   ```json
   {
     "start_url": "https://your-app.vercel.app",
     "scope": "https://your-app.vercel.app/"
   }
   ```

2. Update `frontend/public/service-worker.js` (if needed):
   - Replace localhost URLs with production URL

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update PWA config for production"
   git push
   ```

4. Vercel will auto-deploy the changes

---

## Part 5: Testing Your Deployment

1. **Visit your frontend URL**: `https://your-app.vercel.app`

2. **Test login with super admin**:
   - Email: `admin@educkpro.com`
   - Password: `admin123`

3. **Test key features**:
   - Create a new school
   - Add users (parents, teachers)
   - Enroll students
   - Send messages
   - Create invoices

4. **Test PWA Installation**:
   - On mobile: Browser menu → "Add to Home Screen"
   - On desktop: Browser address bar → Install icon

---

## Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to database"
- Solution: Check DATABASE_URL in Render environment variables
- Ensure database is in same region as backend service

**Problem**: "CORS error"
- Solution: Verify FRONTEND_URL in backend environment variables matches your Vercel URL exactly (including https://)

**Problem**: "Prisma migration failed"
- Solution: In Render Shell, run: `npx prisma migrate deploy`

### Frontend Issues

**Problem**: "Failed to fetch" or API errors
- Solution: Check VITE_API_URL in Vercel environment variables
- Ensure it points to your Render backend URL (with https://)

**Problem**: "Service worker registration failed"
- Solution: Clear browser cache and reload
- Check browser console for specific errors

### Email Issues

**Problem**: Emails not sending
- Solution: Verify EMAIL_USER and EMAIL_PASS in Render
- Use Gmail App Password, not regular password
- Check Render logs for email errors

---

## Monitoring and Maintenance

### View Logs

**Backend logs** (Render):
- Dashboard → Your Service → Logs tab

**Frontend logs** (Vercel):
- Dashboard → Your Project → Deployments → View Function Logs

### Database Backups

**Render PostgreSQL**:
- Free tier: No automatic backups
- Upgrade to paid tier for daily backups
- Manual backup: Use `pg_dump` from Render Shell

### Performance Monitoring

**Backend**:
- Render Dashboard shows CPU and Memory usage
- Free tier: Service may sleep after 15 min inactivity

**Frontend**:
- Vercel Analytics available in dashboard
- Monitor Core Web Vitals

---

## Updating Your App

### Deploy Updates

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

3. **Render**: Auto-deploys on push (check deployment status)
4. **Vercel**: Auto-deploys on push (check deployment status)

### Database Migrations

If you change `prisma/schema.prisma`:

1. Generate migration locally:
   ```bash
   cd backend
   npx prisma migrate dev --name your_migration_name
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Add database migration"
   git push
   ```

3. Render will automatically run migrations during deployment

---

## Cost Estimates

### Free Tier (Current Setup)
- **Render Backend**: Free (sleeps after 15 min inactivity)
- **Render PostgreSQL**: Free (max 1GB)
- **Vercel Frontend**: Free (100GB bandwidth/month)
- **Total**: $0/month

### Paid Tier (Recommended for Production)
- **Render Backend**: $7/month (always on, better performance)
- **Render PostgreSQL**: $7/month (daily backups, 10GB)
- **Vercel Pro**: $20/month (better analytics, priority support)
- **Total**: ~$34/month

---

## Security Checklist

- ✅ JWT_SECRET is a strong random string
- ✅ DATABASE_URL is kept secret
- ✅ VAPID keys are generated and secured
- ✅ Email credentials use App Password, not main password
- ✅ CORS is configured with specific frontend URL
- ✅ Default admin password changed after first login
- ✅ HTTPS enabled (automatic on Vercel/Render)

---

## Support

If you encounter issues:

1. Check Render and Vercel logs
2. Review environment variables
3. Test API endpoints directly (use Postman/Insomnia)
4. Check GitHub repository issues
5. Render support: https://render.com/docs
6. Vercel support: https://vercel.com/docs

---

## Next Steps

After successful deployment:

1. **Change default credentials**:
   - Login as admin@educkpro.com
   - Go to Profile → Change Password

2. **Configure your school**:
   - Create your school profile
   - Add school information

3. **Invite users**:
   - Create admin, teacher, and parent accounts
   - Share credentials securely

4. **Customize branding**:
   - Update app icons in `frontend/public/images/`
   - Modify colors in CSS files

5. **Set up custom domain** (optional):
   - Vercel: Dashboard → Project → Settings → Domains
   - Render: Dashboard → Service → Settings → Custom Domain

---

## Congratulations! 🎉

Your EduckPro application is now live and ready for production use!

**Your URLs**:
- Frontend: https://your-app.vercel.app
- Backend API: https://your-backend.onrender.com
- Database: Managed by Render

**Default Login**:
- Email: admin@educkpro.com
- Password: admin123 (⚠️ Change immediately!)
