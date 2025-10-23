# Vercel Environment Variables Setup

## ⚠️ IMPORTANT: Add This Before Deploying

Your deployment will fail without the `ENCRYPTION_KEY` environment variable. Add it in Vercel now!

## Required Environment Variables

### 1. ENCRYPTION_KEY (REQUIRED)

Go to your Vercel project → Settings → Environment Variables and add:

**Name:** `ENCRYPTION_KEY`

**Value:** Generate a secure 32+ character key. Use one of these methods:

#### Option A: Generate in Terminal
```bash
openssl rand -base64 32
```

#### Option B: Use this value (for demo only - generate your own!)
```
aB3$cD9#eF2@gH5!iJ8*kL1&mN4^oP7%qR6+sT0-uV9
```

**Environment:** All (Production, Preview, Development)

### 2. Other Security Variables (Optional - Have Defaults)

You can optionally add these for custom configuration:

```env
SESSION_TIMEOUT_MINUTES=30
MAX_SESSION_DURATION_HOURS=8
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION_MINUTES=15
PASSWORD_MIN_LENGTH=12
REQUIRE_PASSWORD_CHANGE_DAYS=90
RATE_LIMIT_LOGIN=5
RATE_LIMIT_API=100
```

## Steps to Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your CRM project
3. Click **Settings** in the top menu
4. Click **Environment Variables** in the left sidebar
5. Add each variable:
   - Enter **Name** (e.g., `ENCRYPTION_KEY`)
   - Enter **Value** (your generated key)
   - Select **All** environments
   - Click **Save**

## Testing Locally

Add to your `.env.local`:

```env
# Required
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
ENCRYPTION_KEY="aB3$cD9#eF2@gH5!iJ8*kL1&mN4^oP7%qR6+sT0-uV9"

# Optional (defaults shown)
SESSION_TIMEOUT_MINUTES=30
MAX_SESSION_DURATION_HOURS=8
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION_MINUTES=15
```

## After Deployment

1. Your Vercel deployment will trigger automatically after pushing to GitHub
2. Check the deployment logs for any errors
3. Visit your deployed URL
4. You should see the login page
5. Try logging in with credentials from your seed output

## Reseed Database with Secure Passwords

If you haven't already, reseed your database to get secure passwords:

```bash
npm run db:seed
```

**SAVE THE OUTPUT!** The secure passwords will only be shown once.

## Quick Security Checklist

- [ ] Added `ENCRYPTION_KEY` to Vercel environment variables
- [ ] Reseeded database with secure passwords
- [ ] Saved generated credentials securely
- [ ] Tested login with new credentials
- [ ] Changed password on first login
- [ ] Verified security headers are present (check browser dev tools → Network)
- [ ] Tested rate limiting (5 failed logins = lockout)
- [ ] Reviewed SECURITY.md documentation

## Troubleshooting

### Error: "ENCRYPTION_KEY environment variable is not set"
- Add `ENCRYPTION_KEY` to Vercel environment variables
- Redeploy after adding

### Can't login after deployment
- Make sure you're using the credentials from the seed output
- Check if account is locked (wait 15 minutes or unlock via database)
- Verify `DATABASE_URL` is correct in Vercel

### Security headers not showing
- Clear browser cache
- Check Network tab in browser dev tools
- Verify deployment completed successfully

---

**Next Step:** Check your Vercel deployment at https://vercel.com/dashboard

