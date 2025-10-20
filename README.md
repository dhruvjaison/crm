# Enterprise CRM with Retell AI Integration

A modern, HIPAA-compliant CRM platform with AI-powered call intelligence, designed for managed service providers offering Retell AI voice agents to their clients.

## 🚀 Features

### Multi-Tenant Architecture
- Complete tenant isolation
- Custom branding per client
- Three-tier role system (Super Admin, Client Admin, Client User)

### Call Intelligence (Retell AI Integration)
- Full call transcripts with AI analysis
- Sentiment analysis and scoring
- Key moment detection
- Automated follow-up recommendations
- Cost tracking per call

### CRM Core Features
- **Contact Management**: Full CRUD with custom fields, tags, and views
- **Deal Pipeline**: Customizable stages with drag-and-drop kanban
- **Task Management**: Automated task creation from call intelligence
- **Email Automation**: Templates, triggers, and campaign management
- **Advanced Analytics**: Executive dashboards with real-time metrics
- **Cost Savings Calculator**: ROI visualization comparing traditional call centers

### Professional UI/UX
- Modern, responsive design
- Dark mode support
- Smooth animations
- Loading states and error handling
- Accessibility compliant (WCAG 2.1 AA)

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with RBAC
- **UI Components**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand + React Query
- **Charts**: Recharts
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud - Neon/Vercel Postgres recommended)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd CRM
npm install
\`\`\`

### 2. Environment Setup

Create a `.env` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Email (Resend) - Optional for demo
RESEND_API_KEY="re_your_api_key_here"

# Encryption (HIPAA compliance)
ENCRYPTION_KEY="generate-with: openssl rand -hex 32"

# App
APP_URL="http://localhost:3000"
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data (3 tenants with contacts, calls, deals)
npm run db:seed
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Login Credentials

After seeding, you can log in with:

### Super Admin (Access all tenants)
- Email: `superadmin@crmplatform.com`
- Password: `superadmin123`

### Client Accounts

**ABC Healthcare**
- Admin: `admin@abc-healthcare.com` / `demo1234`
- User: `user@abc-healthcare.com` / `demo1234`

**XYZ Legal Services**
- Admin: `admin@xyz-legal.com` / `demo1234`
- User: `user@xyz-legal.com` / `demo1234`

**123 Real Estate**
- Admin: `admin@123-realestate.com` / `demo1234`
- User: `user@123-realestate.com` / `demo1234`

## 📁 Project Structure

\`\`\`
/app
  /(auth)
    /login              # Login page
  /(dashboard)
    /dashboard          # Executive dashboard
    /contacts           # Contact management
    /deals              # Deal pipeline
    /calls              # Call intelligence
    /analytics          # Advanced analytics
    /cost-savings       # ROI calculator
    /email              # Email automation
    /tasks              # Task management
    /settings           # Settings
  /api
    /auth               # NextAuth API routes
/components
  /ui                   # Shadcn UI components
  /dashboard            # Dashboard-specific components
/lib
  /db.ts               # Prisma client
  /auth.ts             # Auth utilities
  /mock-data.ts        # Mock Retell AI data generator
/prisma
  schema.prisma        # Database schema
  seed.ts              # Seed script
\`\`\`

## 🗄️ Database Schema

Key models:
- **Tenant**: Multi-tenant isolation
- **User**: Authentication with RBAC
- **Contact**: Lead and customer management
- **Call**: Retell AI call data with transcripts
- **Deal**: Sales pipeline management
- **Task**: Activity tracking
- **EmailCampaign**: Automation
- **Activity**: Audit logging

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy!

3. **Database Setup**
   - Use Neon or Vercel Postgres for production
   - Run migrations: `npm run db:push`
   - Seed data: `npm run db:seed`

### Environment Variables (Vercel)

Add these in your Vercel project settings:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your Vercel URL)
- `NEXTAUTH_SECRET`
- `ENCRYPTION_KEY`

## 📊 Mock Retell AI Data

The system includes a comprehensive mock data generator that creates:
- Realistic call transcripts (healthcare, legal, real estate scenarios)
- Sentiment analysis (positive, neutral, negative)
- Call durations and timestamps
- Cost calculations
- Follow-up recommendations
- Key moment extraction

## 🔒 HIPAA Compliance Features

- Data encryption at rest and in transit
- Audit logging for all data access
- Session timeouts (15-minute idle)
- Password complexity requirements
- Role-based access control
- Secure API endpoints
- Environment variable management

## 🛠️ Development Commands

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio (GUI)
\`\`\`

## 🎯 Use Cases

This CRM is perfect for:
- **Healthcare Providers**: HIPAA-compliant patient communication
- **Legal Firms**: Client intake and consultation scheduling
- **Real Estate Agencies**: Lead qualification and follow-up
- **Any Service Business**: Using Retell AI for customer communication

## 💼 Selling Points

1. **Cost Savings**: Save 96% vs traditional call centers ($0.05/min vs $1.25/min)
2. **AI Intelligence**: Automatic sentiment analysis and follow-up suggestions
3. **Complete Visibility**: Full transcripts and analytics for every call
4. **Multi-Tenant**: Serve multiple clients from one platform
5. **HIPAA Ready**: Built with compliance in mind
6. **Professional UI**: Modern, branded experience for each client

## 📝 License

Private - All Rights Reserved

## 🤝 Support

For questions or support, contact your development team.
