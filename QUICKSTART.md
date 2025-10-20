# Quick Start Guide

Get your CRM up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL database (we recommend [Neon](https://neon.tech) free tier)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Database

### Option A: Using Neon (Recommended - Free)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string

### Option B: Local PostgreSQL

```bash
# Make sure PostgreSQL is running
psql -U postgres
CREATE DATABASE crm_db;
\q
```

## Step 3: Configure Environment

Create a `.env` file in the root directory:

```env
# Database (use your Neon connection string or local)
DATABASE_URL="postgresql://user:password@host/crm_db"

# Generate these values:
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
ENCRYPTION_KEY="run: openssl rand -hex 32"

# Optional
RESEND_API_KEY=""
APP_URL="http://localhost:3000"
```

### Generate Secrets

```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For ENCRYPTION_KEY
openssl rand -hex 32
```

## Step 4: Setup Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push

# Seed with demo data (3 tenants with contacts, calls, deals)
npm run db:seed
```

## Step 5: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo Login Credentials

### Super Admin (Access All Tenants)
- **Email**: `superadmin@crmplatform.com`
- **Password**: `superadmin123`

### Demo Clients

**ABC Healthcare**
- Admin: `admin@abc-healthcare.com` / `demo1234`

**XYZ Legal Services**
- Admin: `admin@xyz-legal.com` / `demo1234`

**123 Real Estate**
- Admin: `admin@123-realestate.com` / `demo1234`

## What You'll See

- 📊 **Dashboard**: Executive overview with KPIs
- 📞 **Call Intelligence**: AI-analyzed calls with sentiment
- 👥 **Contacts**: 30-50 demo contacts per tenant
- 💼 **Deals**: Sales pipeline with stages
- 💰 **Cost Savings**: ROI calculator showing 96% savings

## Next Steps

1. Explore the dashboard and different sections
2. Click through to call details to see full transcripts
3. Check out the cost savings calculator
4. Review the contacts and deals sections
5. Customize the demo data as needed

## Troubleshooting

### Database Connection Issues

```bash
# Test your database connection
npm run db:studio
```

This opens Prisma Studio - if it works, your database is connected!

### Port Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Reset Database

```bash
# Warning: This deletes all data!
npm run db:push -- --force-reset
npm run db:seed
```

## Deploying to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Connect Neon database
5. Deploy!

See [README.md](./README.md) for full documentation.

## Support

- Check [README.md](./README.md) for detailed documentation
- Review [prisma/schema.prisma](./prisma/schema.prisma) for database structure
- Inspect mock data in [lib/mock-data.ts](./lib/mock-data.ts)

---

**Need help?** Review the full README.md or check the inline code comments.

