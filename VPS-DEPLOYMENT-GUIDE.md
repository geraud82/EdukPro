# EduckPro VPS Deployment Guide (Hostinger)

Complete guide for deploying EduckPro on a Hostinger VPS server.

## Prerequisites

- Hostinger VPS with Ubuntu 22.04 LTS
- Domain name pointed to your VPS IP
- SSH access to your server
- Basic Linux command line knowledge

## 1. Initial Server Setup

### Connect to your VPS

```bash
ssh root@your_server_ip
```

### Update system packages

```bash
apt update && apt upgrade -y
```

### Create a non-root user

```bash
adduser educkpro
usermod -aG sudo educkpro
```

### Setup SSH key authentication (recommended)

```bash
# On your local machine
ssh-copy-id educkpro@your_server_ip
```

### Configure firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## 2. Install Required Software

### Install Node.js 20.x LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

### Verify installation

```bash
node --version  # Should show v20.x.x
npm --version
```

### Install PM2 globally

```bash
npm install -g pm2
```

### Install Nginx

```bash
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

### Install PostgreSQL

```bash
apt install postgresql postgresql-contrib -y
systemctl enable postgresql
systemctl start postgresql
```

### Install Git

```bash
apt install git -y
```

## 3. Setup PostgreSQL Database

### Access PostgreSQL

```bash
sudo -u postgres psql
```

### Create database and user

```sql
CREATE USER educkpro_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE educkpro_db OWNER educkpro_user;
GRANT ALL PRIVILEGES ON DATABASE educkpro_db TO educkpro_user;
\q
```

## 4. Deploy Application

### Create application directory

```bash
mkdir -p /var/www/educkpro
cd /var/www/educkpro
```

### Clone repository

```bash
git clone https://github.com/geraud82/EdukPro.git .
```

### Setup Backend

```bash
cd /var/www/educkpro/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
nano .env
```

### Configure backend .env

```env
DATABASE_URL="postgresql://educkpro_user:your_secure_password@localhost:5432/educkpro_db"
JWT_SECRET="your-generated-jwt-secret"
PORT=4000
NODE_ENV=production
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Email (optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="EduckPro <noreply@yourdomain.com>"

# Generate VAPID keys: node generate-vapid-keys.js
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Generate VAPID Keys

```bash
node generate-vapid-keys.js
```

### Run database migrations

```bash
npx prisma migrate deploy
```

### Seed database (optional)

```bash
npx prisma db seed
```

### Create logs directory

```bash
mkdir -p /var/www/educkpro/backend/logs
```

### Setup Frontend

```bash
cd /var/www/educkpro/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
nano .env
```

### Configure frontend .env

```env
VITE_API_URL=https://api.yourdomain.com
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
```

### Build frontend

```bash
npm run build
```

## 5. Setup PM2 Process Manager

### Start backend with PM2

```bash
cd /var/www/educkpro/backend
pm2 start ecosystem.config.js --env production
```

### Save PM2 configuration

```bash
pm2 save
```

### Setup PM2 startup script

```bash
pm2 startup systemd
# Run the command it outputs
```

### Useful PM2 commands

```bash
pm2 status              # Check status
pm2 logs educkpro-api   # View logs
pm2 restart educkpro-api # Restart app
pm2 stop educkpro-api   # Stop app
pm2 monit               # Monitor resources
```

## 6. Configure Nginx

### Create Nginx configuration

```bash
nano /etc/nginx/sites-available/educkpro
```

Copy the contents from `nginx.conf` in this repository and replace `YOUR_DOMAIN.com` with your actual domain.

### Enable the site

```bash
ln -s /etc/nginx/sites-available/educkpro /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
```

### Test configuration

```bash
nginx -t
```

### Reload Nginx

```bash
systemctl reload nginx
```

## 7. Setup SSL with Let's Encrypt

### Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### Create certbot webroot

```bash
mkdir -p /var/www/certbot
```

### Obtain SSL certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Test auto-renewal

```bash
certbot renew --dry-run
```

## 8. Set Permissions

```bash
chown -R educkpro:www-data /var/www/educkpro
chmod -R 755 /var/www/educkpro
chmod -R 775 /var/www/educkpro/backend/uploads
```

## 9. Final Checks

### Verify backend is running

```bash
curl http://localhost:4000
# Should return: {"status":"EduckPro API running"}
```

### Check Nginx status

```bash
systemctl status nginx
```

### Check PM2 status

```bash
pm2 status
```

### Test your domain

Open `https://yourdomain.com` in your browser.

## 10. Maintenance & Updates

### Update application

```bash
cd /var/www/educkpro

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
npx prisma migrate deploy
pm2 restart educkpro-api

# Update frontend
cd ../frontend
npm install
npm run build
```

### View logs

```bash
# PM2 logs
pm2 logs educkpro-api

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Database backup

```bash
pg_dump -U educkpro_user educkpro_db > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Application not loading

1. Check PM2 status: `pm2 status`
2. Check PM2 logs: `pm2 logs educkpro-api`
3. Check Nginx logs: `tail -f /var/log/nginx/error.log`

### Database connection issues

1. Verify PostgreSQL is running: `systemctl status postgresql`
2. Check connection string in `.env`
3. Test connection: `psql -h localhost -U educkpro_user -d educkpro_db`

### SSL certificate issues

1. Renew certificate: `certbot renew`
2. Check certificate status: `certbot certificates`

### Permission issues

```bash
chown -R educkpro:www-data /var/www/educkpro
chmod -R 755 /var/www/educkpro
```

## Security Recommendations

1. **Change SSH port** (optional but recommended)
2. **Disable root login** via SSH
3. **Enable fail2ban** for brute force protection
4. **Regular backups** of database
5. **Keep system updated** with security patches
6. **Use strong passwords** for all services

## Quick Reference

| Service | Command |
|---------|---------|
| Start backend | `pm2 start ecosystem.config.js --env production` |
| Stop backend | `pm2 stop educkpro-api` |
| Restart backend | `pm2 restart educkpro-api` |
| View logs | `pm2 logs educkpro-api` |
| Restart Nginx | `systemctl restart nginx` |
| Test Nginx config | `nginx -t` |
| Renew SSL | `certbot renew` |
