# 🔌 Integration Guide - Connect Arnie AI (Retell AI) & Other Services

This guide will help you integrate your CRM with Retell AI's actual API and other third-party services.

---

## 📋 **Table of Contents**

1. [Retell AI Integration](#retell-ai-integration)
2. [Architecture Overview](#architecture-overview)
3. [Setup Steps](#setup-steps)
4. [Webhook Configuration](#webhook-configuration)
5. [API Key Management](#api-key-management)
6. [Other Integrations](#other-integrations)
7. [Testing](#testing)

---

## 🎯 **Retell AI Integration**

### **What You'll Integrate:**

1. **Call Webhooks** - Real-time call events from Retell AI
2. **Call Details API** - Fetch call transcripts and analysis
3. **Agent Management** - Sync your AI agents
4. **Phone Numbers** - Manage phone numbers per tenant

### **How It Works:**

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────┐
│   Retell AI     │ webhook │  Your CRM    │  saves  │  Database   │
│   (Arnie AI)    │────────>│  /api/webhooks│────────>│  (Neon)     │
└─────────────────┘         └──────────────┘         └─────────────┘
                                    │
                                    │ queries
                                    ▼
                            ┌──────────────┐
                            │  Dashboard   │
                            │  (Frontend)  │
                            └──────────────┘
```

---

## 🏗️ **Architecture Overview**

### **Current State (Mock Data):**
- `lib/mock-data.ts` - Generates fake call data
- `prisma/seed.ts` - Seeds demo data

### **Future State (Real Integration):**
- `app/api/webhooks/retell/route.ts` - Receives Retell AI webhooks
- `lib/retell-client.ts` - Retell AI SDK wrapper
- `app/api/calls/sync/route.ts` - Manual sync endpoint
- Per-tenant API keys stored securely in database

---

## 🚀 **Setup Steps**

### **Step 1: Get Retell AI API Keys**

1. Sign up at [Retell AI](https://www.retellai.com/)
2. Get your API key from the dashboard
3. Note your agent IDs
4. Get webhook signing secret

### **Step 2: Add Environment Variables**

Update `.env.local`:

```bash
# Retell AI (Global - for super admin functions)
RETELL_API_KEY=your_retell_api_key_here
RETELL_WEBHOOK_SECRET=your_webhook_secret_here

# Your CRM webhook URL (for Retell to call)
WEBHOOK_BASE_URL=https://your-crm.vercel.app
```

### **Step 3: Update Database Schema**

Add API key storage for multi-tenant:

```prisma
model Tenant {
  // ... existing fields ...
  
  // Integration Keys (encrypted)
  retellApiKey      String?  @db.Text
  retellAgentIds    String[] // Array of agent IDs
  retellPhoneNumbers String[] // Array of phone numbers
  
  // Webhook settings
  webhookSecret     String?
  webhooksEnabled   Boolean  @default(true)
}
```

Run migration:
```bash
npx prisma db push
```

### **Step 4: Install Retell AI SDK**

```bash
npm install retell-sdk
```

---

## 🔔 **Webhook Configuration**

### **Retell AI Webhook Events:**

Retell AI sends webhooks for:
- `call.started` - When a call begins
- `call.ended` - When a call completes
- `call.analyzed` - When AI analysis is ready
- `call.transcribed` - When transcript is available

### **Webhook Setup in Retell AI Dashboard:**

1. Go to Retell AI Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-crm.vercel.app/api/webhooks/retell`
3. Select events: All call events
4. Copy the webhook signing secret
5. Save

---

## 🔐 **API Key Management**

### **Multi-Tenant Architecture:**

Each client (tenant) can have their own Retell AI account:

```typescript
// Client A (ABC Healthcare)
{
  tenantId: "abc-healthcare",
  retellApiKey: "re_abc123...", // Their own API key
  retellAgentIds: ["agent_healthcare_1", "agent_healthcare_2"]
}

// Client B (XYZ Legal)
{
  tenantId: "xyz-legal", 
  retellApiKey: "re_xyz456...", // Different API key
  retellAgentIds: ["agent_legal_1"]
}
```

### **Security Best Practices:**

1. **Encrypt API keys** in database (use `ENCRYPTION_KEY` from env)
2. **Never expose** API keys to frontend
3. **Use per-tenant keys** when possible
4. **Fallback to super admin key** for clients without own keys

---

## 🔌 **Other Integrations**

### **1. Email Services (Resend, SendGrid, Postmark)**

**Use Case:** Send follow-up emails after calls

```typescript
// app/api/email/send/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { to, subject, html } = await req.json()
  
  await resend.emails.send({
    from: 'CRM <crm@yourcompany.com>',
    to,
    subject,
    html,
  })
  
  return Response.json({ success: true })
}
```

**Add to schema:**
```prisma
model Tenant {
  emailApiKey       String?
  emailFromAddress  String?
  emailProvider     String? // "resend", "sendgrid", "postmark"
}
```

---

### **2. Calendar Integration (Google Calendar, Cal.com)**

**Use Case:** Schedule follow-up calls

```typescript
// Use Google Calendar API or Cal.com
model Task {
  // ... existing fields ...
  calendarEventId String?
  meetingLink     String?
}
```

---

### **3. SMS/WhatsApp (Twilio)**

**Use Case:** Send SMS reminders or WhatsApp messages

```bash
npm install twilio
```

```typescript
// app/api/sms/send/route.ts
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(req: Request) {
  const { to, message } = await req.json()
  
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  })
  
  return Response.json({ success: true })
}
```

---

### **4. Zapier/Make.com Integration**

**Use Case:** Connect to thousands of apps without coding

Create a generic webhook endpoint:

```typescript
// app/api/webhooks/zapier/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  
  // Process Zapier webhook
  // Create contact, deal, task, etc.
  
  return Response.json({ success: true })
}
```

---

### **5. CRM Exports (HubSpot, Salesforce)**

**Use Case:** Import existing contacts or sync data

```typescript
// app/api/import/hubspot/route.ts
// Fetch contacts from HubSpot and import to your CRM
```

---

## 🧪 **Testing Your Integration**

### **Test Retell AI Webhook Locally:**

1. **Install ngrok:**
   ```bash
   brew install ngrok  # macOS
   # or download from ngrok.com
   ```

2. **Start your dev server:**
   ```bash
   npm run dev
   ```

3. **Create tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Update Retell AI webhook URL:**
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/retell
   ```

5. **Make a test call** in Retell AI dashboard

6. **Check your logs** - you should see the webhook hit

### **Test with curl:**

```bash
curl -X POST http://localhost:3000/api/webhooks/retell \
  -H "Content-Type: application/json" \
  -d '{
    "event": "call.ended",
    "call_id": "test_123",
    "tenant_id": "abc-healthcare"
  }'
```

---

## 📊 **Monitoring & Logging**

### **Track Integration Health:**

Add a new model:

```prisma
model WebhookLog {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  
  provider    String   // "retell", "twilio", "zapier"
  event       String   // "call.ended", "sms.sent"
  payload     Json     // Raw webhook data
  success     Boolean
  error       String?  @db.Text
  
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  
  @@index([tenantId])
  @@index([provider])
  @@index([createdAt])
}
```

Create a dashboard page to view webhook logs:
```
/dashboard/integrations/logs
```

---

## 🎯 **Recommended Integration Order**

### **Phase 1: Core (Week 1)**
1. ✅ Retell AI webhooks (call data)
2. ✅ Retell AI API client (fetch transcripts)
3. ✅ Per-tenant API key management

### **Phase 2: Communication (Week 2)**
4. Email integration (Resend)
5. SMS integration (Twilio)

### **Phase 3: Automation (Week 3)**
6. Zapier webhooks
7. Calendar integration
8. Automated follow-ups

### **Phase 4: Advanced (Week 4)**
9. CRM imports (HubSpot, Salesforce)
10. WhatsApp Business API
11. Advanced analytics and reporting

---

## 💡 **Pro Tips**

1. **Start with one tenant:** Test with your own Retell AI account first
2. **Use webhook logs:** Always log incoming webhooks for debugging
3. **Handle duplicates:** Calls might send multiple webhooks - use `retellCallId` as unique key
4. **Rate limiting:** Implement rate limits on webhook endpoints
5. **Async processing:** Use background jobs for heavy processing
6. **Error handling:** Retell AI will retry failed webhooks - return 200 even if you queue for later

---

## 📞 **Next Steps**

I can create the actual integration code for you:

1. **Retell AI webhook handler** - Receives and processes calls
2. **Retell AI client wrapper** - Fetch call details, agents, etc.
3. **API key management UI** - Let clients add their own API keys
4. **Sync dashboard** - Show integration status and logs
5. **Testing utilities** - Mock webhook generators

**Want me to implement any of these?** 🚀

