# Deployment Guide - Vercel

Complete guide to deploying your Enterprise CRM to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Neon/Vercel Postgres database (free tier available)

## Step 1: Prepare Your Repository

### 1.1 Create GitHub Repository

```bash
# If you haven't already
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Files

Make sure these files are in your repo:
- ✅ `package.json`
- ✅ `prisma/schema.prisma`
- ✅ `README.md`
- ✅ `.gitignore` (with `.env*` included)

## Step 2: Setup Database (Neon)

### 2.1 Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up/Login (free tier is perfect)
3. Create a new project
4. Name it: "crm-production"
5. Select region closest to your users
6. Copy the connection string

**Connection String Format:**
```
postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/main?sslmode=require
```

### 2.2 Test Connection Locally

```bash
# Add to .env
DATABASE_URL="your-neon-connection-string"

# Test it
npm run db:push
npm run db:seed
```

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3.2 Configure Build Settings

Vercel should auto-detect:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```bash
# Database
DATABASE_URL=your-neon-connection-string-here

# NextAuth (IMPORTANT!)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Encryption (HIPAA)
ENCRYPTION_KEY=generate-with-openssl-rand-hex-32

# App URL
APP_URL=https://your-app-name.vercel.app

# Optional - Resend for email
RESEND_API_KEY=your-resend-api-key
```

**Generate Secrets:**
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -hex 32
```

⚠️ **CRITICAL**: Make sure `NEXTAUTH_URL` matches your Vercel domain!

### 3.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://your-app-name.vercel.app`

## Step 4: Initialize Production Database

### 4.1 Run Migrations from Local

```bash
# Make sure DATABASE_URL points to production
npm run db:push
```

### 4.2 Seed Demo Data

```bash
npm run db:seed
```

Alternatively, you can run these commands in Vercel:

1. Go to your project in Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Ensure DATABASE_URL is set
4. Go to "Deployments" → Click on latest deployment
5. Click "..." → "Redeploy"

### 4.3 Or Use Prisma Data Platform

For a more permanent solution:
```bash
# Run migrations as part of build
# Add to package.json scripts:
"vercel-build": "prisma generate && prisma db push && next build"
```

## Step 5: Test Your Deployment

### 5.1 Visit Your App

Go to: `https://your-app-name.vercel.app`

### 5.2 Test Login

**Super Admin:**
- Email: `superadmin@crmplatform.com`
- Password: `superadmin123`

**Demo Tenants:**
- `admin@abc-healthcare.com` / `demo1234`
- `admin@xyz-legal.com` / `demo1234`
- `admin@123-realestate.com` / `demo1234`

### 5.3 Verify Features

- ✅ Dashboard loads with stats
- ✅ Calls page shows data
- ✅ Contacts page displays
- ✅ Cost savings calculator works
- ✅ Navigation works

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Vercel, go to "Settings" → "Domains"
2. Add your domain: `crm.yourdomain.com`
3. Follow Vercel's DNS instructions
4. Wait for DNS propagation (5-30 minutes)

### 6.2 Update Environment Variables

```bash
NEXTAUTH_URL=https://crm.yourdomain.com
APP_URL=https://crm.yourdomain.com
```

Redeploy after updating env vars!

## Step 7: Post-Deployment Configuration

### 7.1 Enable Automatic Deployments

- ✅ Automatic on `main` branch (already enabled)
- ✅ Preview deployments on PRs

### 7.2 Setup Monitoring

1. Install Vercel Analytics (free):
   ```bash
   npm install @vercel/analytics
   ```

2. Add to `app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react'
   
   // Inside layout return:
   <Analytics />
   ```

### 7.3 Configure Logs

1. Go to Vercel Dashboard
2. Click on your project
3. "Settings" → "Functions"
4. View logs for debugging

## Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**
```bash
# Add postinstall script to package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

**Error: "DATABASE_URL not found"**
- Verify environment variable is set in Vercel
- Check for typos
- Ensure connection string includes `?sslmode=require` for Neon

### Database Issues

**Error: "Can't reach database server"**
- Verify Neon database is active
- Check connection string
- Ensure IP allowlist includes Vercel IPs (Neon allows all by default)

### Authentication Not Working

**Error: "NEXTAUTH_URL mismatch"**
- Update `NEXTAUTH_URL` to match your Vercel domain
- Redeploy after changing env vars

**Error: "Invalid credentials"**
- Verify database is seeded
- Check you're using correct demo credentials
- Look at Vercel logs for specific errors

### Performance Issues

1. **Enable caching**: Already configured in Next.js
2. **Database connection pooling**: Neon handles this
3. **Optimize images**: Use Next.js Image component (already done)

## Monitoring & Maintenance

### Check Application Health

```bash
# Visit health endpoint (create if needed)
https://your-app-name.vercel.app/api/health
```

### Database Backups

Neon provides automatic backups on paid plans. For free tier:
1. Use `pg_dump` regularly
2. Consider upgrading for production use

### Update Dependencies

```bash
npm update
npm audit fix
git commit -am "chore: update dependencies"
git push
# Vercel auto-deploys!
```

## Scaling Considerations

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Neon**: 512MB storage, 3GB data transfer
- Perfect for demos and testing

### Production Ready
- **Vercel Pro**: $20/month - Faster builds, more bandwidth
- **Neon Pro**: $19/month - More storage, better performance
- **Total**: ~$40/month for production-grade hosting

### Enterprise Scale (50+ clients)
- Consider AWS/GCP for full control
- Implement database read replicas
- Use Redis for caching
- CDN for static assets

## Security Checklist

- ✅ Environment variables secured in Vercel
- ✅ Database requires SSL
- ✅ HTTPS enforced (automatic on Vercel)
- ✅ Authentication with secure passwords
- ✅ SQL injection protected (Prisma ORM)
- ✅ XSS protection (Next.js defaults)
- ✅ CSRF tokens (NextAuth.js)

## Support

- **Vercel Issues**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Issues**: [neon.tech/docs](https://neon.tech/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Quick Reference

### Deploy New Changes

```bash
git add .
git commit -m "feat: your changes"
git push
# Vercel auto-deploys!
```

### View Logs

```bash
vercel logs your-app-name
```

### Rollback Deployment

1. Go to Vercel Dashboard
2. "Deployments" tab
3. Find previous working deployment
4. Click "..." → "Promote to Production"

---

**Your CRM is now live! 🎉**

Share the demo with potential clients and show off those cost savings!

