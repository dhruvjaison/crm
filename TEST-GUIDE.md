# 🚀 Testing Guide - Get Your CRM Running in 10 Minutes

Follow these steps exactly to test your CRM locally and deploy to Vercel.

## Prerequisites

- Node.js installed (you have this ✅)
- A web browser
- 10 minutes of your time

## Part 1: Local Testing (5 minutes)

### Step 1: Get a Free Database from Neon

1. **Go to**: https://neon.tech
2. **Sign up** (it's free, no credit card needed)
3. **Create a new project**: 
   - Name it: "CRM Demo"
   - Choose region: "US East" (or closest to you)
4. **Copy the connection string** - it looks like:
   ```
   postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. **Keep this tab open** - you'll need it in a moment

### Step 2: Create Your Environment File

Run this command in your terminal (in the CRM directory):

```bash
cat > .env.local << 'EOF'
# Database (paste your Neon connection string here)
DATABASE_URL="postgresql://your-connection-string-from-neon"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-in-next-step"

# Encryption
ENCRYPTION_KEY="generate-this-in-next-step"

# App URL
APP_URL="http://localhost:3000"
EOF
```

### Step 3: Generate Security Secrets

Run these commands and copy the output:

```bash
# Generate NEXTAUTH_SECRET
echo "NEXTAUTH_SECRET: $(openssl rand -base64 32)"

# Generate ENCRYPTION_KEY  
echo "ENCRYPTION_KEY: $(openssl rand -hex 32)"
```

**Now edit `.env.local`** and paste these values in.

Or use this ONE-LINER to generate everything:

```bash
cat > .env.local << EOF
DATABASE_URL="YOUR_NEON_CONNECTION_STRING_HERE"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
ENCRYPTION_KEY="$(openssl rand -hex 32)"
APP_URL="http://localhost:3000"
EOF
```

**⚠️ IMPORTANT**: Replace `YOUR_NEON_CONNECTION_STRING_HERE` with your actual Neon connection string!

### Step 4: Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Populate with demo data (3 tenants, contacts, calls, deals)
npm run db:seed
```

You should see:
```
🌱 Starting database seed...
📁 Creating tenant: ABC Healthcare
✅ Created users for ABC Healthcare
...
✅ Database seeding completed!
```

### Step 5: Start the Development Server

```bash
npm run dev
```

### Step 6: Test It! 🎉

Open your browser to: **http://localhost:3000**

**Try these logins:**

**Super Admin** (sees ALL clients):
- Email: `superadmin@crmplatform.com`
- Password: `superadmin123`

**ABC Healthcare** (healthcare demo):
- Email: `admin@abc-healthcare.com`
- Password: `demo1234`

**XYZ Legal** (legal services demo):
- Email: `admin@xyz-legal.com`
- Password: `demo1234`

**123 Real Estate** (real estate demo):
- Email: `admin@123-realestate.com`
- Password: `demo1234`

### What to Check:

- ✅ Dashboard loads with stats
- ✅ Navigate to "Calls" - see AI-analyzed calls
- ✅ Click any call - see full transcript
- ✅ Go to "Cost Savings" - see the 96% savings
- ✅ Check "Contacts" - see leads and customers
- ✅ View "Deals" - see the pipeline
- ✅ Switch tenants using different logins

---

## Part 2: Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub

If you haven't already:

```bash
# Create a new repo on GitHub first, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to**: https://vercel.com
2. **Sign up/Login** (use GitHub account)
3. **Click**: "Add New" → "Project"
4. **Import** your GitHub repository
5. **Configure**:
   - Framework Preset: Next.js (auto-detected ✅)
   - Root Directory: `./` (default ✅)
   - Build Command: `next build` (default ✅)

### Step 3: Add Environment Variables

In Vercel, **BEFORE** deploying, add these environment variables:

Click "Environment Variables" tab and add:

```bash
DATABASE_URL
# Paste your Neon connection string

NEXTAUTH_URL
# Will be: https://your-project-name.vercel.app

NEXTAUTH_SECRET
# Generate new: openssl rand -base64 32

ENCRYPTION_KEY
# Generate new: openssl rand -hex 32

APP_URL
# Same as NEXTAUTH_URL
```

**⚠️ CRITICAL**: 
- Use the SAME Neon database connection string
- For `NEXTAUTH_URL`, use: `https://your-project-name.vercel.app` (you'll see this after deploy)
- Generate NEW secrets for production (don't reuse local ones)

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes ⏳
3. You'll get a URL like: `https://your-crm.vercel.app`

### Step 5: Initialize Production Database

Your database is already set up from local testing, but if you need to reset:

```bash
# Make sure DATABASE_URL in .env.local points to your Neon database
npm run db:push
npm run db:seed
```

### Step 6: Test Live! 🌍

Visit your Vercel URL and login with the same credentials:

- `superadmin@crmplatform.com` / `superadmin123`
- `admin@abc-healthcare.com` / `demo1234`
- etc.

---

## Troubleshooting

### ❌ "Can't reach database server"

**Fix**: Check your connection string in `.env.local`
```bash
# Test connection
npm run db:studio
```
If Prisma Studio opens, your database is connected!

### ❌ "Module not found" errors

**Fix**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Invalid credentials" when logging in

**Fix**: Database might not be seeded
```bash
npm run db:seed
```

### ❌ Vercel build fails

**Common causes**:
1. Environment variables not set
2. DATABASE_URL missing or incorrect
3. Build command wrong (should be: `next build`)

**Fix**: 
- Check all environment variables are set in Vercel
- Redeploy after adding/fixing env vars

### ❌ "NEXTAUTH_URL mismatch" error

**Fix**: Update environment variable in Vercel:
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to match your Vercel domain
4. Redeploy

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# View database in GUI
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:push -- --force-reset
npm run db:seed

# Update database schema after changes
npm run db:push

# Check for errors
npm run lint

# Build for production (test locally)
npm run build
npm run start
```

---

## What You Should See

### Dashboard
- 4 stat cards (Calls, Contacts, Deals, Cost)
- Cost savings widget showing 96% savings
- Call volume chart
- Sentiment analysis pie chart
- Recent calls list

### Calls Page
- List of all calls with sentiment badges
- Filter tabs (All, Inbound, Outbound, Positive)
- Click any call to see full transcript
- AI-generated summaries
- Follow-up recommendations

### Cost Savings Page
- **BIG** total savings number (this is your selling point!)
- Side-by-side comparison
- Traditional: $1.25/min
- Retell AI: $0.05/min
- Monthly and all-time tracking

### Contacts Page
- 30-50 contacts per tenant
- Status badges (Lead, Qualified, Customer)
- Lead scores
- Contact details

### Deals Page
- Pipeline stages (6 stages)
- Visual kanban-style cards
- Deal values and forecasting

---

## Next Steps After Testing

1. **Customize the demo data** (edit `prisma/seed.ts`)
2. **Add your branding** (colors, logo in components)
3. **Connect real Retell AI** (when you get API access)
4. **Show to potential clients!** 💰

---

## Demo Script for Client Presentations

1. **Start with Cost Savings** 
   - "Here's how much you're saving vs traditional call centers"
   - Show the $X saved number prominently

2. **Show Call Intelligence**
   - Navigate to Calls
   - Click on a positive sentiment call
   - Show full transcript and AI analysis
   - "Every call is automatically transcribed and analyzed"

3. **Demonstrate Multi-Tenant**
   - Log out
   - Log in as different tenant
   - "Each client gets completely isolated data"

4. **Highlight Features**
   - Dashboard analytics
   - Contact management
   - Deal pipeline
   - "Everything you need in one platform"

5. **Close with ROI**
   - Back to Cost Savings page
   - "This pays for itself in the first month"

---

**Need help?** Check:
- Full documentation: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- Quick start: `QUICKSTART.md`

**You're ready to demo! 🚀**

