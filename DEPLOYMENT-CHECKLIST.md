# EduckPro Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Repository
- [ ] All code is committed to Git
- [ ] Repository is pushed to GitHub
- [ ] `.gitignore` files are properly configured
- [ ] No sensitive data (passwords, keys) in Git history

### 2. Environment Files
- [ ] `backend/.env.example` exists with all required variables
- [ ] `frontend/.env.example` exists with API URL example
- [ ] Local `.env` files are in `.gitignore`
- [ ] No duplicate environment variables in backend/.env

### 3. Configuration Files
- [ ] `frontend/vercel.json` is configured correctly
- [ ] `render.yaml` has correct `rootDir: backend`
- [ ] `.vercelignore` excludes backend files
- [ ] CORS origins in `backend/server.js` include your domains

---

## 🗄️ Database Setup (Render)

### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `educkpro-db`
   - **Database**: `educkpro`
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click **Create Database**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgresql://`)

---

## 🔐 Security Setup

### Step 1: Generate VAPID Keys
```bash
cd backend
node generate-vapid-keys.js
```
**Copy the output** - you'll need:
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY

### Step 2: Gmail App Password (for emails)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**
4. Generate a new app password for "EduckPro"
5. **Copy the 16-character password**

---

## 🚀 Backend Deployment (Render)

### Step 1: Deploy Backend Service
1. In Render Dashboard, click **New +** → **Web Service**
2. **Connect your GitHub repository**
3. Configure:
   - **Name**: `educkpro-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Region**: Same as database
   - **Branch**: main
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### Step 2: Add Environment Variables
Click **Advanced** → **Add Environment Variable**

**Required Variables:**
```
DATABASE_URL=<paste Internal Database URL from Step 1>
JWT_SECRET=<generate a random 32-character string>
PORT=4000
NODE_ENV=production
FRONTEND_URL=<will add after Vercel deployment>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your Gmail address>
EMAIL_PASS=<your Gmail App Password from Security Setup>
EMAIL_FROM=EduckPro <noreply@yourschool.com>
VAPID_PUBLIC_KEY=<from generate-vapid-keys.js>
VAPID_PRIVATE_KEY=<from generate-vapid-keys.js>
VAPID_SUBJECT=mailto:admin@educkpro.com
```

4. Click **Create Web Service**
5. Wait for deployment (5-10 minutes)
6. **Copy your backend URL**: `https://educkpro-backend.onrender.com`

### Step 3: Seed Database (Optional but Recommended)
1. In Render Dashboard, go to your backend service
2. Click **Shell** tab (on the right side)
3. Run:
   ```bash
   npx prisma db seed
   ```
4. This creates:
   - Super admin: `admin@educkpro.com` / `admin123`
   - Sample data for testing

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. **Import your GitHub repository**
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variable
Add this environment variable:
```
VITE_API_URL=https://your-backend.onrender.com
```
Replace with your actual Render backend URL from the Backend Deployment step.

5. Click **Deploy**
6. Wait for deployment (2-3 minutes)
7. **Copy your frontend URL**: `https://your-app.vercel.app`

---

## 🔄 Final Configuration

### Step 1: Update Backend CORS
1. Go back to **Render Dashboard** → Your Backend Service
2. Go to **Environment** tab
3. **Edit** the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
   (Use your actual Vercel URL)
4. Click **Save Changes**
5. Service will automatically redeploy (~2 minutes)

### Step 2: Update CORS in server.js (if needed)
If your Vercel URL is different from `edukpro.vercel.app`, update `backend/server.js`:

Add your Vercel URL to the `allowedOrigins` array:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4000',
  'https://edukpro.vercel.app',
  'https://your-actual-vercel-url.vercel.app',  // Add this
  process.env.FRONTEND_URL
].filter(Boolean);
```

Then commit and push to trigger redeployment.

---

## ✅ Post-Deployment Verification

### Test Basic Functionality
1. **Visit your frontend URL**: `https://your-app.vercel.app`
2. **Test Super Admin Login**:
   - Email: `admin@educkpro.com`
   - Password: `admin123`
   - ⚠️ Change this password immediately after first login!

### Test Key Features
- [ ] User registration works
- [ ] Login/logout works
- [ ] Dashboard loads correctly
- [ ] Can create schools (for admins)
- [ ] Can create students (for parents)
- [ ] Can create classes (for admins)
- [ ] Chat functionality works
- [ ] Notifications appear
- [ ] Invoice generation works
- [ ] File uploads work

### Test PWA Installation
- [ ] **On Mobile**: Browser menu → "Add to Home Screen"
- [ ] **On Desktop**: Browser address bar → Install icon
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to database"
- ✅ **Solution**: Check `DATABASE_URL` in Render environment variables
- ✅ Ensure database is in same region as backend service
- ✅ Use **Internal Database URL**, not external

**Problem**: "CORS error" or "Access blocked by CORS policy"
- ✅ **Solution**: Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- ✅ Include `https://` in the URL
- ✅ No trailing slash
- ✅ Check `allowedOrigins` array in `server.js`

**Problem**: "Prisma migration failed"
- ✅ **Solution**: In Render Shell, run: `npx prisma migrate deploy`
- ✅ Check that `DATABASE_URL` is correctly formatted

**Problem**: "Module not found" or build errors
- ✅ **Solution**: Check `package.json` has all dependencies
- ✅ Clear build cache in Render: Settings → "Clear build cache & deploy"

### Frontend Issues

**Problem**: "Failed to fetch" or API connection errors
- ✅ **Solution**: Check `VITE_API_URL` in Vercel environment variables
- ✅ Ensure it points to your Render backend URL (with https://)
- ✅ Redeploy frontend after changing environment variables

**Problem**: Blank page or white screen
- ✅ **Solution**: Check browser console for errors
- ✅ Verify build completed successfully in Vercel
- ✅ Check that `dist` folder was created during build

**Problem**: "Service worker registration failed"
- ✅ **Solution**: Clear browser cache and reload
- ✅ Check browser console for specific error messages
- ✅ Ensure HTTPS is enabled (required for service workers)

### Email Issues

**Problem**: Emails not sending
- ✅ **Solution**: Verify `EMAIL_USER` and `EMAIL_PASS` in Render
- ✅ Must use Gmail App Password, not regular password
- ✅ Check that 2-Step Verification is enabled on Gmail
- ✅ Review Render logs for email errors

**Problem**: "Invalid login" error for email
- ✅ **Solution**: Regenerate Gmail App Password
- ✅ Ensure no spaces in password when pasting
- ✅ Check that `EMAIL_HOST` is `smtp.gmail.com`

---

## 📊 Monitoring

### View Logs

**Backend Logs (Render)**:
- Dashboard → Your Service → **Logs** tab
- Real-time logs of all requests and errors

**Frontend Logs (Vercel)**:
- Dashboard → Your Project → **Deployments** → **View Function Logs**
- Check for build errors and runtime issues

### Performance Monitoring

**Backend**:
- Render Dashboard shows CPU and Memory usage
- ⚠️ Free tier: Service may sleep after 15 min inactivity
- First request after sleep may take 30-60 seconds

**Frontend**:
- Vercel Analytics available in dashboard
- Monitor Core Web Vitals and performance metrics

---

## 🔄 Making Updates

### Deploy Code Changes

1. Make changes locally
2. Test locally
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
4. **Render**: Auto-deploys on push (monitor in dashboard)
5. **Vercel**: Auto-deploys on push (monitor in dashboard)

### Database Migrations

If you change `backend/prisma/schema.prisma`:

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

### Environment Variable Changes

**Render**:
- Dashboard → Service → Environment → Edit variable
- Save changes (triggers automatic redeployment)

**Vercel**:
- Dashboard → Project → Settings → Environment Variables
- Add/Edit variable → Save
- **Must redeploy** for changes to take effect

---

## 💰 Cost Information

### Free Tier (Current Setup)
- **Render Backend**: Free (sleeps after 15 min inactivity)
- **Render PostgreSQL**: Free (max 1GB storage)
- **Vercel Frontend**: Free (100GB bandwidth/month)
- **Total**: $0/month

### Limitations
- Backend cold starts after inactivity (~30-60s first request)
- 750 hours/month of backend runtime
- 1GB database storage limit
- No automatic database backups on free tier

### Paid Tier (Recommended for Production)
- **Render Backend**: $7/month (always on, better performance)
- **Render PostgreSQL**: $7/month (daily backups, 10GB)
- **Vercel Pro**: $20/month (better analytics, priority support)
- **Total**: ~$34/month

---

## 🔒 Security Best Practices

- [x] All `.env` files are in `.gitignore`
- [x] Strong JWT_SECRET (32+ random characters)
- [x] Gmail App Password (not regular password)
- [x] CORS configured with specific origins (no wildcards)
- [x] HTTPS enabled (automatic on Vercel/Render)
- [ ] **Change default admin password immediately**
- [ ] Use environment-specific API keys for production
- [ ] Enable database backups (upgrade to paid tier)
- [ ] Set up monitoring and alerting
- [ ] Regular security updates for dependencies

---

## 🎉 Success Criteria

Your deployment is successful when:

- [ ] Frontend loads at your Vercel URL
- [ ] Can login with super admin credentials
- [ ] Backend API responds to requests
- [ ] Database queries work correctly
- [ ] Real-time features (chat, notifications) work
- [ ] File uploads work
- [ ] Email notifications send successfully
- [ ] PWA installs on mobile devices
- [ ] No CORS errors in browser console
- [ ] All pages and features are accessible

---

## 📞 Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Repository Issues**: Check your GitHub repository issues tab

---

## 🚀 Next Steps After Deployment

1. **Change Default Credentials**:
   - Login as `admin@educkpro.com`
   - Go to Profile → Change Password
   - Use a strong, unique password

2. **Configure Your School**:
   - Create your school profile
   - Add school information
   - Upload school logo

3. **Create User Accounts**:
   - Create admin accounts
   - Add teachers
   - Invite parents

4. **Customize Branding** (Optional):
   - Update app icons in `frontend/public/images/`
   - Modify colors in CSS files
   - Update app name in manifest.json

5. **Set Up Custom Domain** (Optional):
   - **Vercel**: Dashboard → Project → Settings → Domains
   - **Render**: Dashboard → Service → Settings → Custom Domain

---

## ✅ Deployment Complete!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
- Database: Managed by Render

**Default Login:**
- Email: `admin@educkpro.com`
- Password: `admin123`
- ⚠️ **CHANGE THIS IMMEDIATELY!**

Congratulations! Your EduckPro application is now live! 🎉
