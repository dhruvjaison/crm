# 📋 Consolidated TODO List - Enhanced MVP (Option B)

**Last Updated:** November 26, 2025  
**MVP Target:** 18-24 hours of focused development  
**Current Progress:** 4/17 core todos complete (24%)

---

## ✅ **COMPLETED (4/17)**

### Phase 1: White-Label & Setup
- [x] **Remove tech mentions** - Removed all Retell AI/Arnie AI branding
- [x] **Google OAuth code** - Added Google provider to NextAuth
- [x] **Empty states created** - Built all 5 empty state components
- [x] **Seed scripts split** - Production (Super Admin only) vs Demo data

---

## 🔴 **PHASE 1: CRITICAL CRUD (6-8 hours) - IN PROGRESS**

### Priority: HIGHEST - Users can't add/edit data without this

### 1. Configure Google OAuth (15 min) - **USER ACTION REQUIRED**
- [ ] **Status:** Pending (needs user to configure)
- [ ] **Action:** Follow `GOOGLE-OAUTH-SETUP.md`
- [ ] **Steps:**
  1. Create Google Cloud project
  2. Configure OAuth consent screen
  3. Add test users
  4. Create OAuth credentials
  5. Add to Vercel env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  6. Redeploy Vercel
- [ ] **Blocker:** Yes - "Sign in with Google" returns 400 error
- [ ] **Can proceed without:** Yes - email/password login works

---

### 2. Contact CRUD (2 hours) - **STARTING NOW**
- [ ] **Status:** In Progress
- [ ] **Build:**
  - Contact Add/Edit dialog component
  - Form validation (email, required fields)
  - API routes: POST `/api/contacts`, PATCH `/api/contacts/[id]`, DELETE `/api/contacts/[id]`
  - Wire up to contacts page
  - Success/error toasts
- [ ] **Blocker:** Yes - Users can't add contacts

---

### 3. Deal CRUD (2 hours)
- [ ] **Status:** Pending
- [ ] **Build:**
  - Deal Create/Edit dialog component
  - Contact dropdown (search/select)
  - Stage dropdown (from pipeline)
  - Currency formatting
  - API routes: POST `/api/deals`, PATCH `/api/deals/[id]`, DELETE `/api/deals/[id]`
  - Wire up to deals page
- [ ] **Blocker:** Yes - Users can't create deals

---

### 4. Task CRUD (1.5 hours)
- [ ] **Status:** Pending
- [ ] **Build:**
  - Task Create/Edit dialog component
  - Date picker with time
  - Priority/Status selectors
  - User assignment dropdown
  - API routes: POST `/api/tasks`, PATCH `/api/tasks/[id]`, DELETE `/api/tasks/[id]`
  - Wire up to tasks page
- [ ] **Blocker:** Yes - Users can't create tasks

---

### 5. Delete Confirmations (0.5 hours)
- [ ] **Status:** Pending
- [ ] **Build:**
  - Reusable delete confirmation dialog
  - "Are you sure?" with entity name
  - Cancel/Delete buttons
  - Loading state
- [ ] **Blocker:** No - But needed for complete CRUD

---

## 🟡 **PHASE 2: EMPTY STATES INTEGRATION (2 hours)**

### Priority: HIGH - Better UX for new users

### 6. Integrate Empty States
- [ ] **Status:** Pending
- [ ] **Update:**
  - `app/(dashboard)/dashboard/contacts/page.tsx` - Show `NoContacts` when empty
  - `app/(dashboard)/dashboard/deals/page.tsx` - Show `NoDeals` when empty
  - `app/(dashboard)/dashboard/calls/page.tsx` - Show `NoCalls` when empty
  - `app/(dashboard)/dashboard/tasks/page.tsx` - Show `NoTasks` when empty
  - `app/(dashboard)/dashboard/page.tsx` - Show `WelcomeDashboard` for new users
- [ ] **Blocker:** No - But poor first-time experience without it

---

## 🟢 **PHASE 3: CSV IMPORT (4-6 hours)**

### Priority: MEDIUM - Users need to import existing data

### 7. CSV Import for Contacts (3 hours)
- [ ] **Status:** Pending
- [ ] **Build:**
  - CSV uploader component (drag-and-drop)
  - Field mapper component (auto-detect columns)
  - Import API route with validation
  - Import page with progress tracking
  - Duplicate detection (by email)
- [ ] **Blocker:** No - But important for users with existing data

---

### 8. CSV Import for Deals (1-2 hours)
- [ ] **Status:** Pending
- [ ] **Build:**
  - Reuse CSV uploader
  - Deal-specific field mapper
  - Import API route
  - Link to contacts during import
- [ ] **Blocker:** No

---

## 🔵 **PHASE 4: BASIC ANALYTICS (2-3 hours)**

### Priority: MEDIUM - Replace placeholder page

### 9. Analytics Dashboard
- [ ] **Status:** Pending
- [ ] **Build:**
  - Replace `app/(dashboard)/dashboard/analytics/page.tsx` placeholder
  - Key metrics cards (revenue, conversion rate, avg deal size)
  - Revenue by month chart
  - Deals by stage funnel
  - Top performers list
- [ ] **Blocker:** No - But users expect this feature

---

## 🟣 **PHASE 5: EMAIL TEMPLATES (2-3 hours)**

### Priority: MEDIUM - Basic email functionality

### 10. Email Template Management
- [ ] **Status:** Pending
- [ ] **Build:**
  - Replace `app/(dashboard)/dashboard/email/page.tsx` placeholder
  - Template list page
  - Template editor (name, subject, body with variables)
  - API routes for templates
  - Variable picker ({{firstName}}, {{companyName}})
- [ ] **Blocker:** No

---

## 🟤 **PHASE 6: ONBOARDING WIZARD (2-3 hours)**

### Priority: LOW - Nice to have

### 11. Onboarding Wizard
- [ ] **Status:** Pending
- [ ] **Build:**
  - Multi-step onboarding flow
  - Company info (name, industry, size)
  - What to track (checkboxes)
  - Import data option
  - Invite team members
  - Store in Tenant.settings
- [ ] **Blocker:** No

---

## 🔧 **PHASE 7: POLISH & CLEANUP**

### Priority: VARIES

### 12. Clean Integrations Page
- [ ] **Status:** Pending
- [ ] **Update:** Make all integrations clearly optional
- [ ] **Blocker:** No

---

### 13. Integration Model
- [ ] **Status:** Pending
- [ ] **Build:** Database model to track connected services per tenant
- [ ] **Blocker:** No - Future enhancement

---

## 📊 **Progress Summary**

### By Phase:
- **Phase 1 (CRUD):** 0/5 complete (0%) - **IN PROGRESS**
- **Phase 2 (Empty States):** 0/1 complete (0%)
- **Phase 3 (CSV Import):** 0/2 complete (0%)
- **Phase 4 (Analytics):** 0/1 complete (0%)
- **Phase 5 (Email):** 0/1 complete (0%)
- **Phase 6 (Onboarding):** 0/1 complete (0%)
- **Phase 7 (Polish):** 0/2 complete (0%)

### Overall:
- **Completed:** 4/17 (24%)
- **In Progress:** 1/17 (6%)
- **Pending:** 12/17 (70%)

### Time Estimate:
- **Phase 1:** 6-8 hours (CRITICAL)
- **Phase 2:** 2 hours (HIGH)
- **Phase 3:** 4-6 hours (MEDIUM)
- **Phase 4:** 2-3 hours (MEDIUM)
- **Phase 5:** 2-3 hours (MEDIUM)
- **Phase 6:** 2-3 hours (LOW)
- **Phase 7:** 1-2 hours (LOW)

**Total:** 19-27 hours (Target: 18-24 hours for Option B)

---

## 🎯 **What's Next?**

### Immediate (Now):
1. **Starting:** Contact CRUD dialog (2 hours)
2. **User Action:** Configure Google OAuth (15 min - follow guide)

### Today (6-8 hours):
1. ✅ Contact CRUD
2. ✅ Deal CRUD
3. ✅ Task CRUD
4. ✅ Delete confirmations
5. ✅ Test everything

### Tomorrow (6-8 hours):
1. ✅ Integrate empty states
2. ✅ CSV import (contacts)
3. ✅ CSV import (deals)
4. ✅ Test import flow

### Day 3 (6-8 hours):
1. ✅ Analytics dashboard
2. ✅ Email templates
3. ✅ Onboarding wizard (if time)
4. ✅ Final testing & deploy

---

## 🚀 **Ready to Build!**

**Current Task:** Building Contact CRUD dialog (Phase 1.2)  
**Next Task:** Deal CRUD dialog (Phase 1.3)  
**Blocking User:** Google OAuth configuration (Phase 1.1)

**Note:** You can configure Google OAuth anytime - it doesn't block development. Email/password login works fine for testing.

---

## 📝 **Notes**

- **Google OAuth:** Not blocking - can be configured later
- **Old Todos:** 20+ old todos from original plan are NOT needed for MVP
- **Focus:** These 17 todos are all that's needed for Enhanced MVP (Option B)
- **Post-MVP:** Calendar features, advanced reporting, etc. come after MVP launch

---

**Last Updated:** November 26, 2025  
**Next Review:** After Phase 1 complete

