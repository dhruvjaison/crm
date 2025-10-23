# ✅ Vercel Deployment Setup Guide

## 🌐 Your Deployed App

**Live URL:** https://crm-swart-ten-11.vercel.app

---

## 🔐 Step 1: Configure Google OAuth (Required for "Sign in with Google")

### 1.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Enable **Google+ API** and **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - User Type: **External**
   - App name: **Your CRM Name**
   - Support email: Your email
   - Scopes: Add `userinfo.email`, `userinfo.profile`

### 1.2 Add Authorized Redirect URIs

In your OAuth 2.0 Client ID settings, add:

```
https://crm-swart-ten-11.vercel.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### 1.3 Add Environment Variables to Vercel

Go to: https://vercel.com/dhruvjaison/your-project/settings/environment-variables

Add these variables:

```bash
# Google OAuth (Required for Sign in with Google)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Already configured (keep these)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://crm-swart-ten-11.vercel.app

# Optional: For encryption (calendar, sensitive data)
ENCRYPTION_KEY=generate-32-character-random-string
```

### 1.4 Generate ENCRYPTION_KEY

Run this command to generate a secure encryption key:

```bash
openssl rand -base64 32
```

---

## 🧪 Step 2: Test Your Login Page

### Current Login Options:

1. **Sign in with Google** ✅ (after OAuth setup)
2. **Email + Password** ✅

### Test Credentials (from seed):

Check your `SECURITY-SUMMARY.txt` file for generated passwords, or run:

```bash
npm run db:seed
```

---

## 📋 Step 3: What's Working Now

✅ **White-label design** - No technology mentions
✅ **Google OAuth sign-in** - Auto-creates tenant for new users
✅ **Email/password sign-in** - Traditional authentication
✅ **Multi-tenancy** - Data isolation per organization
✅ **Contacts management** - Full CRUD
✅ **Deals pipeline** - Visual drag-and-drop
✅ **Call tracking** - Intelligence and analytics
✅ **Tasks management** - Complete workflow
✅ **Calendar integration** - Google Calendar sync (optional)
✅ **Cost savings calculator** - ROI dashboard
✅ **Settings & integrations** - Control panel

---

## 🚧 What's Next (To-Do List)

### Priority 1: Fresh User Experience

1. **Empty States** - Show "Get Started" cards instead of demo data
2. **Remove Demo Data** - Clean database for new users
3. **Onboarding Wizard** - First-time setup flow (company name, team size)

### Priority 2: Data Import

4. **CSV Import** - Let users import their contacts/deals
5. **Field Mapper** - Map CSV columns to CRM fields

### Priority 3: Integration Model

6. **Integration Model** - Track connected services per tenant
7. **Clean Integrations Page** - Make all integrations optional

---

## 🎯 User Flow (After Setup)

### New User Signs Up with Google:

1. Clicks "Continue with Google" on login page
2. Authorizes with Google
3. System auto-creates:
   - ✅ User account
   - ✅ Tenant (organization)
   - ✅ Default pipeline stages
4. Redirects to `/dashboard`
5. **Next:** Show onboarding wizard (TO-DO)

### Existing User Signs In:

1. Uses email + password OR Google
2. Redirects to `/dashboard`
3. Sees their data

---

## 🔧 Quick Commands

```bash
# Local development
npm run dev

# Build and test locally
npm run build

# Push database changes
npm run db:push

# Reset database with fresh seed
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Deploy to Vercel
git push origin main
```

---

## 📝 Notes

- Login page is fully functional ✅
- Google OAuth requires setup in Google Cloud Console
- Calendar integration is optional (user can connect in Settings)
- Demo data is currently seeded (will be removed in next phase)

---

## 🆘 Troubleshooting

### "Sign in with Google" not working?

1. Check Google OAuth credentials are correct in Vercel env vars
2. Verify redirect URI is exact: `https://crm-swart-ten-11.vercel.app/api/auth/callback/google`
3. Make sure Google+ API is enabled
4. Redeploy after adding env vars

### Database connection issues?

1. Verify `DATABASE_URL` in Vercel env vars
2. Check Neon database is running
3. Run `npm run db:push` locally to sync schema

### Login fails with email/password?

1. Check if user exists in database
2. Run `npm run db:seed` to create demo users
3. Check `SECURITY-SUMMARY.txt` for passwords

---

**Ready to test!** 🚀

Visit: https://crm-swart-ten-11.vercel.app/login

