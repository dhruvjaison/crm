# 🗑️ Clear Demo Data from Database

## Problem
Your database still has 80+ demo records from the old seed script. New users should see empty states.

## Solution
Run this SQL script to clear all demo data while keeping your Super Admin account.

---

## **Step 1: Connect to Your Database**

Go to your Neon dashboard: https://console.neon.tech/

1. Click on your project
2. Click "SQL Editor" in the left sidebar
3. Copy and paste the SQL below

---

## **Step 2: Run This SQL Script**

```sql
-- Clear all demo data but keep Super Admin
DELETE FROM "Activity" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Task" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Deal" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Call" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Contact" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "PipelineStage" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "User" WHERE "tenantId" != (SELECT id FROM "Tenant" WHERE slug = 'crm-platform');
DELETE FROM "Tenant" WHERE slug != 'crm-platform';

-- Recreate pipeline stages for your tenant
INSERT INTO "PipelineStage" ("id", "name", "order", "probability", "color", "tenantId", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  stage_data.name,
  stage_data.order,
  stage_data.probability,
  stage_data.color,
  (SELECT id FROM "Tenant" WHERE slug = 'crm-platform'),
  NOW(),
  NOW()
FROM (VALUES
  ('New Lead', 1, 10, '#gray'),
  ('Qualified', 2, 30, '#blue'),
  ('Demo Scheduled', 3, 50, '#yellow'),
  ('Proposal Sent', 4, 70, '#orange'),
  ('Negotiation', 5, 85, '#purple'),
  ('Closed Won', 6, 100, '#green')
) AS stage_data(name, order, probability, color);
```

---

## **Step 3: Verify**

After running the script:

1. **Logout** of your CRM
2. **Login** again with Super Admin credentials:
   - Email: `admin@crm.local`
   - Password: `T+qs9@*-s8Q5%wDa`
3. **Check Dashboard** - Should see "Welcome to Your CRM" empty state
4. **Check Contacts** - Should see "No contacts yet"
5. **Check Deals** - Should see "No deals yet"
6. **Check Tasks** - Should see "No tasks yet"

---

## **What This Does:**

✅ Deletes all demo contacts, deals, tasks, calls  
✅ Deletes demo tenants (ABC Healthcare, XYZ Legal, etc.)  
✅ Deletes demo users  
✅ **KEEPS** your Super Admin account  
✅ **KEEPS** the platform tenant  
✅ Recreates pipeline stages for deals  

---

## **After Clearing:**

You'll have a **clean CRM** ready to show clients:
- Empty states with helpful CTAs
- No fake data
- Professional first impression
- Ready for real data

---

## **Alternative: Reset Entire Database**

If you want to start completely fresh:

```bash
cd /Users/dhruvjaison/Documents/CRM
npm run db:push  # Reset schema
npm run db:seed  # Create fresh Super Admin
```

This will:
- Drop all tables
- Recreate schema
- Create new Super Admin with new password
- **You'll need to save the new credentials!**

---

## **Next Steps After Clearing:**

1. Test empty states
2. Create a real contact
3. Create a real deal
4. Show to potential clients
5. Get feedback!

