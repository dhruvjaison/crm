# Google OAuth Setup Guide

## 🚨 Quick Fix for "400 Error"

You're getting this error because Google OAuth isn't configured yet. Follow these steps:

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
   - Name: "Enterprise CRM" (or your choice)
   - Click **Create**

---

## Step 2: Enable APIs

1. In your project, go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **Google+ API** (for user profile)
   - **Google Calendar API** (optional, for calendar sync)

---

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (for testing with any Google account)
3. Fill in required fields:
   - **App name**: Enterprise CRM
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. **Scopes**: Click **Add or Remove Scopes**
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
   - (Optional) Add: `calendar` if you want calendar sync
6. Click **Save and Continue**
7. **Test users** (IMPORTANT for access control):
   - Click **+ Add Users**
   - Add email addresses of people who can sign up
   - Example: `yourname@gmail.com`, `teammate@company.com`
   - Only these users can sign in while in "Testing" mode
8. Click **Save and Continue**

---

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: "Enterprise CRM - Production"
5. **Authorized redirect URIs** - Add BOTH:
   ```
   https://crm-swart-ten-11.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
6. Click **Create**
7. **Copy your credentials**:
   - Client ID: `xxxxxxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxxxxxxxxxxxx`

---

## Step 5: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dhruvjaison)
2. Select your project: `crm-swart-ten-11`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

5. Click **Save**
6. **Redeploy** your application:
   - Go to **Deployments**
   - Click on the latest deployment
   - Click **Redeploy**

---

## Step 6: Add to Local Environment (Optional)

If testing locally, add to `.env.local`:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
```

---

## 🔐 Access Control Options

### Option 1: Test Users (Current - Most Restrictive)

**How it works:**
- While OAuth consent screen is in "Testing" mode
- Only test users you explicitly add can sign in
- Best for private beta or internal use

**To add users:**
1. Go to **OAuth consent screen** → **Test users**
2. Click **+ Add Users**
3. Enter email addresses
4. Only these users can sign in

**Limitations:**
- Max 100 test users
- Must manually add each user

---

### Option 2: Published App (Public Access)

**How it works:**
- Submit app for Google verification
- Anyone with a Google account can sign in
- Requires privacy policy and terms of service
- Takes 1-2 weeks for approval

**To publish:**
1. Go to **OAuth consent screen**
2. Click **Publish App**
3. Submit for verification
4. Follow Google's verification process

---

### Option 3: Email Domain Restriction (Recommended for Businesses)

**How it works:**
- Allow only specific email domains
- Example: Only `@yourcompany.com` emails
- Controlled in your application code

We can implement this for you! See below.

---

### Option 4: Invite-Only System (Recommended)

**How it works:**
- Admin creates "invitations" in CRM
- Users can only sign up if they have a valid invite code
- Most flexible and secure

We can implement this for you! See below.

---

## 🎯 Recommended Setup

**For Testing/Demo:**
- Use **Option 1** (Test Users)
- Add your email and client emails as test users
- Quick and simple

**For Production:**
- Use **Option 3** (Email Domain) + **Option 4** (Invite System)
- Most professional and secure
- Full control over who signs up

---

## 🚀 Quick Start (Testing Mode)

1. ✅ Create Google Cloud project
2. ✅ Enable Google+ API
3. ✅ Configure OAuth consent screen (External + Testing)
4. ✅ Add yourself as test user
5. ✅ Create OAuth credentials
6. ✅ Add credentials to Vercel env vars
7. ✅ Redeploy on Vercel
8. ✅ Test sign-in at: https://crm-swart-ten-11.vercel.app/login

---

## ❓ Troubleshooting

### Still getting 400 error?
- Check redirect URI is EXACT: `https://crm-swart-ten-11.vercel.app/api/auth/callback/google`
- No trailing slash!
- Must match exactly

### "Access blocked: This app's request is invalid"?
- You're not added as a test user
- Go to OAuth consent screen → Test users → Add your email

### "Redirect URI mismatch"?
- Check authorized redirect URIs in Google Cloud Console
- Must include: `https://crm-swart-ten-11.vercel.app/api/auth/callback/google`

---

## 📝 Next Steps

Once Google OAuth is working, would you like me to implement:
1. **Email domain restrictions** - Only allow specific domains
2. **Invite-only system** - Admin sends invites, users use codes
3. **Both** - Domain restriction + invite codes for extra security

Let me know and I'll build it!

