# CRM Testing Guide

Complete guide for testing and interacting with the CRM web application.

## 🗺️ Navigation Structure

### Side Menu (Left Sidebar)
Primary modules accessible from the left navigation:
- **Dashboard** - Overview metrics and recent activity
- **Contacts** - Contact/lead management
- **Deals** - Pipeline and deal tracking
- **Calls** - Call logs and analytics
- **Analytics** - Revenue charts and performance metrics
- **Cost Savings** - ROI calculator and comparison
- **Email** - Email template management
- **Tasks** - Task management and tracking
- **Integrations** - Third-party integrations
- **Settings** - Organization and user settings

### Top Bar
- **Notifications** - Bell icon with unread count badge
- **User Profile** - Displays logged-in user (Dhruv Jaison)

---

## 📋 Module-by-Module Testing Guide

### 1. Contacts Module

#### Initial State (Empty)
- Shows "0 contacts" with empty state
- Two action buttons: **Add Contact** and **Import CSV**
- Bottom button: **Add Your First Contact** (same action as Add Contact)

#### Add Contact Flow
1. **Click** "Add Contact" or "Add Your First Contact"
2. **Modal opens** with fields:
   - First Name (text input)
   - Last Name (text input)
   - Email (text input)
   - Phone (text input)
   - Company (text input)
   - Job Title (text input)
   - Status (dropdown: Lead, Qualified, Customer, Inactive)
   - Lead Score (number input with up/down arrows)
   - Tags (text input)
   - Notes (textarea)

3. **Multi-action sequence**:
   ```
   - Click "First Name" field → Type value
   - Click "Last Name" field → Type value
   - Click "Email" field → Type value
   - Click "Phone" field → Type value
   - Click "Company" field → Type value
   - Click "Job Title" field → Type value
   - Click "Status" dropdown → Wait 200ms → Click desired option
   - Click "Lead Score" field → Type number
   - Click "Tags" field → Type tags
   - Click "Notes" field → Type notes
   - Click "Create Contact" button
   ```

4. **Confirmation**: Contact appears in the list

#### Import CSV Flow
1. **Click** "Import CSV" button
2. **Modal opens** with drag-and-drop area
3. **Actions**:
   - Drag CSV file or click to browse
   - Preview first 5 rows
   - Map columns to fields
   - Choose "Update existing contacts" option
   - Click "Import Contacts"
4. **Result**: Shows import summary (created, updated, errors)

#### Edit Contact
1. **Click** on a contact row
2. **Modal opens** with pre-filled fields
3. **Modify** any field
4. **Click** "Update Contact"

#### Delete Contact
1. **Click** trash icon on contact row
2. **Confirmation modal** appears
3. **Click** "Delete" to confirm

---

### 2. Deals Module

#### Initial State
- Shows metrics: Active Deals, Pipeline Value, Won This Month, Win Rate
- **Create Deal** button at top right

#### Prerequisites
⚠️ **Important**: You must create at least one contact before creating a deal. If no contacts exist, the modal will show an error: "Please select a contact first"

#### Create Deal Flow
1. **Click** "Create Deal" button
2. **Modal opens** with fields:
   - Deal Title (text input) *required*
   - Deal Value (number input) *required*
   - Expected Close Date (date picker)
   - Contact (dropdown - must have contacts)
   - Pipeline Stage (dropdown)

3. **Multi-action sequence**:
   ```
   - Click "Deal Title" field → Type value
   - Click "Deal Value" field → Type number
   - Click "Expected Close Date" → Use date picker (see below)
   - Click "Contact" dropdown → Wait 200ms → Click contact name
   - Click "Pipeline Stage" dropdown → Wait 200ms → Click stage
   - Click "Create Deal" button
   ```

#### Date Picker Usage
1. **Click** calendar icon
2. **Navigate** using left/right arrows to select month
3. **Click** desired day
4. **Format**: Displays as MM/DD/YYYY

#### Import Deals CSV
1. **Click** "Import CSV" button (next to Create Deal)
2. **Upload** CSV with columns: title, value, stageName, contactEmail, expectedCloseDate, status
3. **Preview** and map columns
4. **Click** "Import Deals"
5. **Result**: Shows import summary with contact linking

---

### 3. Email Templates Module

#### Initial State
- Shows existing templates (e.g., "Welcome Email")
- Displays metrics: Usage count, Open Rate, Click Rate
- **New Template** button at top right

#### Create Template Flow
1. **Click** "New Template" button
2. **Modal opens** with fields:
   - Template Name (text input)
   - Subject Line (text input)
   - Variables (button to add {{firstName}}, {{company}}, etc.)
   - Body (large textarea)
   - Preview tab

3. **Multi-action sequence**:
   ```
   - Click "Template Name" field → Type name
   - Click "Subject Line" field → Type subject
   - Click "Add Variable" → Select variable (optional)
   - Click "Body" field → Type email content
   - Click "Preview" tab to see rendered version (optional)
   - Click "Create Template" button
   ```

4. **Variables**: Click "Add Variable" to insert {{firstName}}, {{lastName}}, {{company}}, {{email}}

#### Edit Template
1. **Click** edit icon on template row
2. **Modal opens** with pre-filled content
3. **Modify** fields
4. **Click** "Update Template"

#### Delete Template
1. **Click** trash icon on template row
2. **Confirmation modal** appears
3. **Click** "Delete" to confirm

---

### 4. Tasks Module

#### Initial State
- Shows metrics: Total Tasks, To Do, In Progress, Completed, Overdue
- **Add Task** button (or "Create Your First Task" if empty)

#### Create Task Flow
1. **Click** "Add Task" or "Create Your First Task"
2. **Modal opens** with fields:
   - Task Title (text input) *required*
   - Status (dropdown: To Do, In Progress, Completed, Cancelled)
   - Priority (dropdown: Low, Medium, High)
   - Due Date (date picker)
   - Description (textarea)

3. **Multi-action sequence**:
   ```
   - Click "Task Title" field → Type title
   - Click "Status" dropdown → Wait 200ms → Click status
   - Click "Priority" dropdown → Wait 200ms → Click priority
   - Click "Due Date" → Use date picker (see Deals section)
   - Click "Description" field → Type description
   - Click "Create Task" button
   ```

#### Edit Task
1. **Click** on a task row
2. **Modal opens** with pre-filled fields
3. **Modify** any field
4. **Click** "Update Task"

#### Delete Task
1. **Click** trash icon on task row
2. **Confirmation modal** appears
3. **Click** "Delete" to confirm

---

### 5. Calls Module

#### Current State
- Shows metrics: Total Calls, Inbound, Outbound, Average Duration, Total Cost
- **No calls logged** currently
- No interactive elements until calls exist

#### When Calls Exist
- Filter by date range
- Search by contact name
- View call details (transcript, sentiment, duration)
- Click on call to see full analysis

---

### 6. Analytics Module

#### Current State
- **Metrics displayed**:
  - Total Revenue
  - Win Rate
  - Average Deal Size
  - Pipeline Value
  - Total Contacts
  - Conversion Rate
  - Total Deals

- **Charts**:
  - Revenue Trend (12-month line chart)
  - Pipeline Funnel (by stage)
  - Top Performers (leaderboard)

#### Interaction
- **No forms or buttons** - purely informational
- **Auto-updates** when data changes
- **Hover** over charts for detailed tooltips

---

### 7. Cost Savings Module

#### Current State
- **Comparison Table**:
  - Traditional Call Center costs
  - AI Voice Solution costs
  - Savings breakdown

- **Metrics**:
  - Total Savings
  - This Month savings
  - Cost per call comparison

#### Interaction
- **Informational only** - no forms to submit
- **Auto-calculates** based on call volume

---

### 8. Integrations Module

#### Current State
- **Managed Services** (handled by provider):
  - AI Voice Agents
    - Buttons: "Sync Now", "View Call Logs", "Contact Support"

- **Available Add-ons**:
  - Email Automation
  - SMS & WhatsApp
  - Calendar Sync
  - Workflow Automation
  - Each has a "Request Access" button

#### Testing Actions
1. **Click** "Request Access" on any add-on
   - No modal appears
   - Backend request triggered
   - Check for notification or success message

2. **Click** "Sync Now" on AI Voice Agents
   - Triggers sync with AI platform
   - Check for notification

3. **Click** "View Call Logs"
   - Navigates to Calls page

4. **Click** "Contact Support"
   - May open email client or support form

---

### 9. Settings Module

#### Organization Tab
- **Read-only fields**:
  - Organization Name
  - Plan (e.g., "Starter")
  - Tenant ID

#### Your Profile Tab
- **Read-only fields**:
  - Name
  - Email
  - Role

#### Team Members Tab
- **List of members** with:
  - Name
  - Email
  - Role
  - Status
- **No add/remove buttons** currently

#### Branding Tab
- **Under development**
- Future: Logo upload, color customization

---

### 10. Notifications Panel

#### Access
- **Click** bell icon in top bar
- **Badge** shows unread count (e.g., "3" or "9+" for 10+)

#### Interaction
1. **Click** bell icon → Dropdown opens
2. **View** notifications with:
   - Icon (color-coded by type)
   - Title
   - Message
   - Time ago
   - Unread indicator (blue dot)

3. **Actions**:
   - Click notification → Navigate to related item
   - Click "X" → Delete notification
   - Click "Mark all read" → Clear all unread

4. **Auto-refresh**: Every 30 seconds

---

## 🤖 Automation Best Practices

### Multi-Action Sequences
```
1. Click field
2. Type value
3. Move to next field (no delay needed)
4. Repeat
5. Click submit button
```

### Dropdown Handling
```
1. Click dropdown trigger
2. Wait 200ms (for animation)
3. Click desired option
```

### Date Picker Handling
```
1. Click calendar icon
2. Click left/right arrows to navigate months
3. Click desired day
4. Date auto-fills in MM/DD/YYYY format
```

### Modal Closure
```
1. After testing, click "X" or "Cancel"
2. Verify modal closes
3. Verify UI returns to previous state
```

### Confirmation Actions
```
1. Fill form completely
2. STOP before clicking final "Create" button
3. Ask user for confirmation
4. Only proceed after user approval
```

---

## ✅ Testing Checklist

### Contacts
- [ ] Add contact with all fields
- [ ] Add contact with minimal fields
- [ ] Edit existing contact
- [ ] Delete contact
- [ ] Import CSV (valid data)
- [ ] Import CSV (duplicate detection)
- [ ] Search contacts
- [ ] Filter by status

### Deals
- [ ] Create deal (after creating contact)
- [ ] Edit deal
- [ ] Delete deal
- [ ] Change deal stage
- [ ] Mark deal as won
- [ ] Mark deal as lost
- [ ] Import deals CSV
- [ ] Verify contact linking

### Email Templates
- [ ] Create template
- [ ] Add variables
- [ ] Preview template
- [ ] Edit template
- [ ] Delete template

### Tasks
- [ ] Create task
- [ ] Set due date
- [ ] Change status
- [ ] Change priority
- [ ] Edit task
- [ ] Delete task
- [ ] Mark as completed

### Notifications
- [ ] Receive notification (deal won)
- [ ] Receive notification (stage changed)
- [ ] Click notification to navigate
- [ ] Mark as read
- [ ] Delete notification
- [ ] Mark all as read

### Integrations
- [ ] Click "Request Access"
- [ ] Click "Sync Now"
- [ ] Click "View Call Logs"
- [ ] Verify no errors

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **Settings**: Most settings are read-only (by design for demo)
2. **Calls**: No manual call creation (populated via AI integration)
3. **Branding**: Under development
4. **Team Members**: No add/remove functionality yet

### Expected Behaviors
- **Empty states**: Show helpful prompts and action buttons
- **Error messages**: Display inline when validation fails
- **Success messages**: Show toast notifications (top-right)
- **Loading states**: Show spinners during API calls

---

## 📊 Test Data Recommendations

### Sample Contact
```
First Name: John
Last Name: Smith
Email: john.smith@acme.com
Phone: (555) 123-4567
Company: Acme Corp
Job Title: VP of Sales
Status: Lead
Lead Score: 75
Tags: enterprise, hot-lead
Notes: Met at conference, interested in Q1 demo
```

### Sample Deal
```
Title: Enterprise Software License
Value: 50000
Expected Close Date: 30 days from now
Contact: John Smith (from above)
Stage: Qualification
```

### Sample Task
```
Title: Follow up with John Smith
Status: To Do
Priority: High
Due Date: Tomorrow
Description: Schedule demo call to discuss requirements
```

### Sample Email Template
```
Name: Follow-Up Email
Subject: Great meeting you at {{eventName}}!
Body: Hi {{firstName}},

It was great meeting you at {{eventName}}. I wanted to follow up on our conversation about {{topic}}.

Would you be available for a quick call next week?

Best regards,
{{senderName}}
```

---

## 🚀 Quick Start Testing Script

### 1. Create a Contact
```
1. Navigate to Contacts
2. Click "Add Contact"
3. Fill in all fields (use sample data above)
4. Click "Create Contact"
5. Verify contact appears in list
```

### 2. Create a Deal
```
1. Navigate to Deals
2. Click "Create Deal"
3. Fill in all fields (use sample data above)
4. Select the contact you just created
5. Click "Create Deal"
6. Verify deal appears in pipeline
```

### 3. Create a Task
```
1. Navigate to Tasks
2. Click "Add Task"
3. Fill in all fields (use sample data above)
4. Click "Create Task"
5. Verify task appears in list
```

### 4. Create an Email Template
```
1. Navigate to Email
2. Click "New Template"
3. Fill in name, subject, and body
4. Add variables ({{firstName}}, {{company}})
5. Click "Create Template"
6. Verify template appears in list
```

### 5. Check Notifications
```
1. Click bell icon in top bar
2. Verify notifications appear
3. Click a notification
4. Verify navigation to related item
5. Mark notification as read
```

### 6. View Analytics
```
1. Navigate to Analytics
2. Verify metrics display correctly
3. Hover over charts
4. Verify tooltips show detailed data
```

---

## 📝 Notes for Cursor Automation

1. **Precise Clicks**: Click on the label text, not just the icon
2. **Wait for Animations**: Add 200ms wait after dropdown clicks
3. **Date Pickers**: Use arrow navigation, don't type dates directly
4. **Modals**: Always close modals after testing
5. **Confirmations**: Stop before final submit, ask user
6. **Error Handling**: Check for error messages after each action
7. **Success Feedback**: Look for toast notifications (top-right)
8. **Network Delays**: Add optional waits for slower connections

---

## 🎯 Success Criteria

A successful test run should:
- ✅ Create at least 1 contact
- ✅ Create at least 1 deal (linked to contact)
- ✅ Create at least 1 task
- ✅ Create at least 1 email template
- ✅ View analytics (with data)
- ✅ Receive and interact with notifications
- ✅ No console errors
- ✅ All modals open/close correctly
- ✅ All forms validate properly
- ✅ All data persists after page refresh

---

**Last Updated**: November 28, 2025  
**CRM Version**: 1.0.0 (Production Ready)  
**Deployment**: https://crm-swart-ten-11.vercel.app
