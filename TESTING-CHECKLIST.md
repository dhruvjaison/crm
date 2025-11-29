# CRM Testing Checklist

Complete guide to testing all functionality in your CRM.

## 🔐 **Authentication Testing**

### Sign Up Flow
1. Go to `/signup`
2. Fill out the 3-step onboarding:
   - **Step 1:** Name, email, password (min 8 chars)
   - **Step 2:** Company name, industry, company size
   - **Step 3:** Select goals (at least one)
3. Submit and verify redirect to login
4. **Expected:** New account created, default pipeline stages created

### Login Flow
1. Go to `/login`
2. Test password visibility toggle (eye icon)
3. Login with credentials
4. **Expected:** Redirect to dashboard
5. Test "Sign in with Google" (if configured)

### Dark Mode
1. Click theme toggle (sun/moon icon) in top-right
2. Test: Light, Dark, System modes
3. **Expected:** Theme persists across page refreshes

---

## 📊 **Dashboard Testing**

### Empty State (New User)
1. Login with brand new account
2. **Expected:** See "Welcome to your CRM!" empty state
3. Test quick action buttons:
   - "Get Started" → Contacts page
   - "View Pipeline" → Deals page
   - "Setup Integrations" → Integrations page
   - "Create Task" → Tasks page
   - "Open Settings" → Settings page
   - "View Documentation" → Help page

### Dashboard with Data
1. After adding contacts/deals, return to dashboard
2. **Expected:** See metrics cards:
   - Total Calls
   - Contacts
   - Active Deals
   - Total Call Cost
3. Verify hover effects on cards
4. Check charts load properly

---

## 👥 **Contacts Testing**

### Adding a Contact
1. Go to `/dashboard/contacts`
2. Click "Add Contact"
3. Fill in all fields:
   - First Name, Last Name (required)
   - Email (required)
   - Phone, Company, Job Title
   - Status (LEAD, QUALIFIED, CUSTOMER, INACTIVE)
   - Lead Score (0-100)
   - Tags (comma-separated)
   - Notes
4. Click "Save"
5. **Expected:** Contact appears in list

### Editing a Contact
1. Click on a contact name
2. Click "Edit" button
3. Modify any field
4. Click "Save"
5. **Expected:** Changes reflected immediately

### Deleting a Contact
1. Click on a contact
2. Click "Delete" button
3. Confirm deletion
4. **Expected:** Contact removed from list

### CSV Import
1. Click "Import CSV" button
2. Prepare a CSV file with these columns:
   ```
   firstName,lastName,email,phone,company,jobTitle,status,leadScore,tags,notes
   John,Doe,john@example.com,555-0100,Acme Corp,CEO,QUALIFIED,85,"vip,enterprise","Test contact"
   ```
3. Upload file
4. Review column mapping
5. Choose duplicate handling (Skip or Update)
6. Click "Import"
7. **Expected:** Contacts imported successfully

### Search & Filter
1. Use search bar to find contacts
2. Filter by status
3. Sort by name, email, company
4. **Expected:** Results update in real-time

---

## 💼 **Deals Testing**

### Creating a Deal
1. Go to `/dashboard/deals`
2. Click "Create Deal"
3. Fill in:
   - Title (required)
   - Contact (select from dropdown - required)
   - Value (dollar amount)
   - Stage (Discovery, Qualification, Proposal, Negotiation, Closed Won, Closed Lost)
   - Expected Close Date
   - Probability (0-100%)
4. Click "Create"
5. **Expected:** Deal appears in list

### Editing a Deal
1. Click on a deal title
2. Click "Edit"
3. Change stage or value
4. Click "Save"
5. **Expected:** Changes saved, notification created

### Deleting a Deal
1. Click on a deal
2. Click "Delete"
3. Confirm
4. **Expected:** Deal removed

### CSV Import for Deals
1. Click "Import CSV"
2. Prepare CSV:
   ```
   title,contactEmail,value,stageName,expectedCloseDate,probability
   "Big Enterprise Deal",john@example.com,50000,qualification,2024-12-31,60
   ```
3. Upload and import
4. **Expected:** Deals created and linked to contacts

### Pipeline View
1. View deals grouped by stage
2. Check deal values sum correctly
3. **Expected:** Clear visualization of pipeline

---

## ✅ **Tasks Testing**

### Creating a Task
1. Go to `/dashboard/tasks`
2. Click "Create Task"
3. Fill in:
   - Title (required)
   - Description
   - Due Date
   - Priority (Low, Medium, High)
   - Status (TODO, IN_PROGRESS, COMPLETED, CANCELLED)
   - Assigned To (optional)
   - Link to Contact or Deal (optional)
4. Click "Create"
5. **Expected:** Task appears in list

### Updating Task Status
1. Click on a task
2. Click "Edit"
3. Change status to "COMPLETED"
4. Click "Save"
5. **Expected:** Task marked complete, notification created

### Filtering Tasks
1. Filter by status (TODO, IN_PROGRESS, COMPLETED)
2. Filter by priority
3. Sort by due date
4. **Expected:** Filtered results display correctly

---

## 📧 **Email Templates Testing**

### Creating a Template
1. Go to `/dashboard/email`
2. Click "New Template"
3. Fill in:
   - Name (e.g., "Welcome Email")
   - Subject line
   - Body with variables: `{{firstName}}`, `{{company}}`
4. Click "Save"
5. **Expected:** Template saved and appears in list

### Editing a Template
1. Click on template name
2. Click "Edit"
3. Modify subject or body
4. Click "Save"
5. **Expected:** Changes saved

### Using Variables
1. Create template with: `Hi {{firstName}}, Welcome to {{company}}!`
2. **Expected:** Variables will be replaced when sending emails

---

## 📞 **Calls Testing** (Requires Integration)

### Viewing Calls
1. Go to `/dashboard/calls`
2. **Expected:** See list of calls (if integrated with AI voice agent)

### Call Details
1. Click on a call
2. **Expected:** View:
   - Transcript
   - Sentiment analysis
   - Duration
   - Cost
   - Contact information
   - AI insights

### Manual Call Sync
1. If no calls appear, check webhook integration
2. Verify webhook URL: `https://crm-swart-ten-11.vercel.app/api/webhooks/retell`

---

## 📈 **Analytics Testing**

### Overview Page
1. Go to `/dashboard/analytics`
2. **Expected:** See:
   - Key metrics (total revenue, deals, conversion rate)
   - Revenue by month chart
   - Pipeline funnel
   - Top performers table

### Filtering
1. Use date range picker
2. Filter by team member
3. **Expected:** Charts update based on filters

### Exporting
1. Click "Export" button
2. **Expected:** Download CSV of data

---

## 💰 **Cost Savings Testing**

1. Go to `/dashboard/cost-savings`
2. **Expected:** See:
   - Total savings calculation
   - Monthly savings
   - Cost per call comparison
   - Traditional vs AI cost breakdown
3. Verify calculations are accurate
4. Check gradient cards display properly

---

## 🔗 **Integrations Testing**

### Google Calendar
1. Go to `/dashboard/integrations`
2. Click "Connect Google Calendar"
3. Authorize with Google
4. **Expected:** Calendar synced, events appear in CRM

### Phone System
1. Click "Connect Phone System"
2. Enter API credentials
3. Configure webhook URL
4. Test connection
5. **Expected:** Calls sync automatically

---

## 📚 **Help Documentation Testing**

### Help Center
1. Go to `/dashboard/help`
2. **Expected:** See 10 category cards
3. Click on each category
4. **Expected:** All article links work (no 404s)

### Article Pages
1. Click any article link
2. **Expected:**
   - Article content displays
   - Related articles section shows
   - "Was this helpful?" feedback section
   - Back button works

### Support Page
1. Go to `/dashboard/help/support`
2. **Expected:**
   - 3 support channels displayed
   - Contact form functional
   - FAQ links work

### API Documentation
1. Go to `/dashboard/help/api`
2. **Expected:**
   - Endpoint documentation displays
   - Code examples shown
   - Tabs switch properly

---

## 🔔 **Notifications Testing**

### Viewing Notifications
1. Click bell icon in top-right
2. **Expected:** Dropdown shows recent notifications

### Notification Types
Test that notifications are created for:
- Deal won
- Deal stage changed
- Task assigned
- Task completed
- New contact created

### Marking as Read
1. Click on a notification
2. **Expected:** Notification marked as read, navigate to related item

### Mark All Read
1. Click "Mark all as read"
2. **Expected:** All notifications marked read

---

## ⚙️ **Settings Testing**

### Profile Settings
1. Go to `/dashboard/settings`
2. Update profile information
3. Change password
4. **Expected:** Changes saved

### Team Management (Admin Only)
1. Invite team member
2. Set role (Admin, User, Viewer)
3. **Expected:** Invitation sent

---

## 🎨 **UI/UX Testing**

### Responsive Design
1. Test on different screen sizes:
   - Desktop (1920x1080)
   - Laptop (1366x768)
   - Tablet (768x1024)
   - Mobile (375x667)
2. **Expected:** Layout adapts properly

### Animations & Interactions
1. Hover over buttons → Should show scale/shadow effects
2. Click navigation items → Should show smooth transitions
3. Active nav items → Should show gradient background + left border
4. Cards → Should have hover effects
5. **Expected:** Smooth 60fps animations

### Loading States
1. Navigate to pages with data
2. **Expected:** See skeleton loaders while data loads
3. Check spinner appears for long operations

### Dark Mode
1. Toggle dark mode
2. Check all pages look good in dark mode
3. **Expected:** Proper contrast, readable text, good colors

---

## 🔒 **Security Testing**

### Authentication
1. Try accessing `/dashboard` without login
2. **Expected:** Redirect to `/login`

### Authorization
1. Login as regular user
2. Try accessing admin-only features
3. **Expected:** Access denied or features hidden

### Data Isolation
1. Create data as User A
2. Login as User B (different tenant)
3. **Expected:** User B cannot see User A's data

---

## 🐛 **Error Handling Testing**

### Form Validation
1. Try submitting forms with missing required fields
2. **Expected:** Error messages display

### API Errors
1. Disconnect internet
2. Try creating a contact
3. **Expected:** User-friendly error message

### 404 Pages
1. Navigate to `/dashboard/nonexistent`
2. **Expected:** 404 page or redirect

---

## 📱 **Mobile Testing**

1. Open CRM on mobile device
2. Test all major features:
   - Login
   - View contacts
   - Create deal
   - View dashboard
3. **Expected:** Fully functional on mobile

---

## ✅ **Final Checklist**

- [ ] Can sign up new account
- [ ] Can login with email/password
- [ ] Can login with Google (if configured)
- [ ] Dark mode works
- [ ] Can add/edit/delete contacts
- [ ] Can import contacts from CSV
- [ ] Can add/edit/delete deals
- [ ] Can import deals from CSV
- [ ] Can add/edit/delete tasks
- [ ] Can create email templates
- [ ] Dashboard shows correct metrics
- [ ] Analytics page displays charts
- [ ] Cost savings calculations work
- [ ] Help documentation has no 404s
- [ ] All article links work
- [ ] Notifications appear and work
- [ ] Settings can be updated
- [ ] Responsive on all devices
- [ ] Animations are smooth
- [ ] No console errors
- [ ] All forms validate properly

---

## 🚀 **Production Readiness**

Before launching to customers:

1. **Data**: Clear all test data
2. **Integrations**: Verify all API keys are production keys
3. **Email**: Test email sending works
4. **Webhooks**: Verify webhook URLs are correct
5. **Performance**: Test with realistic data volumes
6. **Security**: Run security audit
7. **Backups**: Verify automatic backups work
8. **Monitoring**: Set up error tracking (Sentry, etc.)
9. **Documentation**: Ensure all help articles are accurate
10. **Training**: Train support team on common issues

---

## 📊 **Test Data Recommendations**

Create test data to simulate real usage:

- **10-20 contacts** with varied statuses and lead scores
- **5-10 deals** in different stages
- **5-10 tasks** with different priorities
- **3-5 email templates**
- **Simulate calls** (if integrated)

This gives you realistic data to test dashboards, analytics, and reports.

---

## 🆘 **Common Issues & Solutions**

### Issue: Can't see any data on dashboard
**Solution**: Add contacts and deals first. New accounts start empty.

### Issue: CSV import fails
**Solution**: Check CSV format matches exactly. Required fields: firstName, lastName, email.

### Issue: Notifications not appearing
**Solution**: Trigger notification events (create deal, complete task, etc.)

### Issue: Charts not loading
**Solution**: Ensure you have data in the date range selected.

### Issue: Google OAuth error
**Solution**: Verify Google Cloud Console settings and authorized redirect URIs.

---

## 📞 **Need Help?**

If you encounter issues during testing:
1. Check browser console for errors (F12)
2. Review Vercel deployment logs
3. Check database for data
4. Verify environment variables are set
5. Contact support at support@clarostrategy.com

---

**Happy Testing! 🎉**

