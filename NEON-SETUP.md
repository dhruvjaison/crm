# 🚀 Neon Setup - Quick Guide

## Step 1: Get Your Neon Connection String

1. Go to: **https://neon.tech**
2. Sign up (free, no credit card)
3. Create new project: "crm-demo"
4. **Copy the connection string** - looks like:
   ```
   postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Add to .env.local

Open `.env.local` in your editor and update the DATABASE_URL line:

```env
DATABASE_URL="postgresql://your-neon-url-here"
```

**Important**: Keep the quotes and paste your ENTIRE connection string!

## Step 3: Setup Database

Run these commands in order:

```bash
# 1. Push schema to database (creates tables)
npm run db:push

# 2. Seed with demo data (adds 3 tenants with contacts, calls, deals)
npm run db:seed
```

You should see:
```
✅ Database schema created
🌱 Starting database seed...
📁 Creating tenant: ABC Healthcare
✅ Created users for ABC Healthcare
...
✅ Database seeding completed!
```

## Step 4: Start the Server

```bash
npm run dev
```

## Step 5: Test!

Open: **http://localhost:3000**

Login with:
- Email: `superadmin@crmplatform.com`
- Password: `superadmin123`

---

## 🆘 Troubleshooting

### "Can't reach database server"

**Check your connection string**:
1. Make sure you copied the ENTIRE string from Neon
2. It should include `?sslmode=require` at the end
3. Should have your password in it (between : and @)

**Test connection**:
```bash
npm run db:studio
```
If Prisma Studio opens (http://localhost:5555), your database is connected!

### "Invalid credentials"

The database might not be seeded. Run:
```bash
npm run db:seed
```

### Still stuck?

1. Check `.env.local` file - is DATABASE_URL filled in?
2. Go back to Neon dashboard and verify project is active
3. Try copying the connection string again

---

## ✅ Success Checklist

- [ ] Neon account created
- [ ] Project created in Neon
- [ ] Connection string copied
- [ ] Pasted into `.env.local`
- [ ] `npm run db:push` completed successfully
- [ ] `npm run db:seed` completed successfully
- [ ] `npm run dev` running
- [ ] Can login at http://localhost:3000

---

## 🎯 Next Steps

Once it's working locally:
1. Test all features (Dashboard, Calls, Contacts, Cost Savings)
2. Try different tenant logins
3. Ready to deploy to Vercel! (See DEPLOYMENT.md)

---

**Your Neon connection string is safe** - it's in `.env.local` which is gitignored and won't be committed to GitHub.

