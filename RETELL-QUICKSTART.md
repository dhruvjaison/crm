# 🚀 Retell AI (Arnie AI) Integration - Quick Start

Get your first call from Retell AI into your CRM in **10 minutes**.

---

## ✅ **Prerequisites**

- Your CRM is deployed on Vercel
- You have a Retell AI account ([Sign up here](https://www.retellai.com/))
- You have at least one AI agent configured in Retell AI

---

## 📝 **Step-by-Step Guide**

### **Step 1: Get Your Retell AI Credentials**

1. Log in to [Retell AI Dashboard](https://beta.retellai.com/dashboard)
2. Go to **API Keys** section
3. Copy your **API Key** (starts with `re_...`)
4. Go to **Webhooks** section  
5. Copy your **Webhook Secret**

### **Step 2: Add Environment Variables**

In your **Vercel Dashboard**:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

```env
RETELL_API_KEY=re_your_api_key_here
RETELL_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

3. Click **Save**
4. **Redeploy** your application (Deployments → "..." → Redeploy)

### **Step 3: Configure Webhook in Retell AI**

1. Go to Retell AI Dashboard → **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Enter your webhook URL:
   ```
   https://your-crm.vercel.app/api/webhooks/retell
   ```
4. Select events to receive:
   - ✅ `call.started`
   - ✅ `call.ended`
   - ✅ `call.analyzed`
5. Click **Save**

### **Step 4: Add Tenant ID to Your Agent**

For each AI agent you want to track:

1. Go to **Agents** in Retell AI dashboard
2. Click on your agent
3. Scroll to **Metadata** section
4. Add this metadata field:
   ```json
   {
     "tenant_id": "your-tenant-id-from-crm"
   }
   ```
5. Save the agent

**To find your tenant ID:**
- Log in to your CRM
- Go to Settings page
- Copy the "Tenant ID" value (shows as slug like `abc-healthcare`)

### **Step 5: Make a Test Call**

1. In Retell AI dashboard, go to **Agents**
2. Click your configured agent
3. Click **Test in Browser** or make a real call
4. Complete the call (or hang up)
5. Wait ~30 seconds for webhook processing

### **Step 6: Verify in Your CRM**

1. Open your CRM
2. Go to **Call Intelligence** page
3. You should see your call appear!
4. Click **View** to see:
   - Full transcript
   - AI sentiment analysis
   - Call duration and cost
   - Associated contact (auto-created)

---

## 🎯 **What Happens Automatically**

When a call completes on Retell AI:

1. **Webhook fires** → Your CRM receives the event
2. **Contact lookup** → CRM finds or creates contact by phone number
3. **Call saved** → Full transcript, sentiment, and analysis stored
4. **Cost calculated** → Automatic cost tracking
5. **Dashboard updated** → Call appears in real-time

---

## 🔍 **Troubleshooting**

### **Call not appearing in CRM?**

**Check webhook logs:**
1. Go to your CRM → **Integrations** page
2. Look for recent webhook events
3. Check for errors

**Common issues:**
- ❌ **Missing tenant_id** - Add metadata to agent
- ❌ **Wrong webhook URL** - Verify URL in Retell dashboard
- ❌ **API key expired** - Generate new key in Retell AI
- ❌ **Webhook secret mismatch** - Update in Vercel env vars

### **Test webhook locally:**

```bash
# 1. Start your dev server
npm run dev

# 2. In another terminal, use ngrok
ngrok http 3000

# 3. Copy the ngrok URL (https://xxx.ngrok.io)

# 4. Update Retell AI webhook to:
https://xxx.ngrok.io/api/webhooks/retell

# 5. Make a test call

# 6. Watch your terminal for logs
```

### **Manual sync calls:**

If webhooks aren't working, you can manually sync:

```bash
# Sync specific call
curl -X POST https://your-crm.vercel.app/api/calls/sync \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"callId":"call_xxx"}'

# Sync last 7 days of calls
curl https://your-crm.vercel.app/api/calls/sync?days=7&limit=50
```

---

## 📊 **Understanding Your Data**

### **What gets synced:**

| Retell AI Field | CRM Field | Notes |
|---|---|---|
| `call_id` | `retellCallId` | Unique identifier |
| `transcript` | `transcript` | Full conversation |
| `call_analysis.call_summary` | `summary` | AI-generated summary |
| `call_analysis.user_sentiment` | `sentiment` | POSITIVE/NEUTRAL/NEGATIVE |
| `direction` | `direction` | INBOUND/OUTBOUND |
| `duration` | `duration` | Seconds |
| `from_number` / `to_number` | `phoneNumber` | Contact phone |

### **Cost calculation:**

```javascript
// Default rate: $0.05 per minute
const costPerMinute = 0.05
const durationMinutes = duration / 60
const totalCost = durationMinutes * costPerMinute
```

You can adjust the rate in `lib/retell-client.ts`

---

## 🔐 **Multi-Tenant Setup (Advanced)**

If you're managing multiple clients, each with their own Retell AI account:

### **Option 1: Update database schema**

```prisma
model Tenant {
  // Add to schema.prisma
  retellApiKey      String?  @db.Text
  retellAgentIds    String[]
  webhookSecret     String?
}
```

Then run:
```bash
npx prisma db push
```

### **Option 2: Let clients add their own keys**

Create a settings page where clients can input:
- Their Retell AI API key
- Their agent IDs
- Their phone numbers

The integration will automatically use per-tenant keys when available.

---

## 🚀 **Next Steps**

### **Enhance your integration:**

1. **📧 Auto-followups** - Send emails after calls
2. **📋 Auto-tasks** - Create tasks from call insights
3. **📊 Custom analytics** - Build custom reports
4. **🔔 Real-time alerts** - Notify on important calls
5. **🤖 AI insights** - Extract action items from transcripts

### **Add more integrations:**

- **Email** (Resend) - Automated follow-ups
- **SMS** (Twilio) - Text reminders
- **Calendar** (Google) - Schedule callbacks
- **WhatsApp** - Message customers

See `INTEGRATION-GUIDE.md` for details.

---

## 💡 **Pro Tips**

1. **Use metadata extensively:**
   ```json
   {
     "tenant_id": "abc-healthcare",
     "campaign_id": "summer-2025",
     "source": "website-form"
   }
   ```

2. **Test with small batches** before going live

3. **Monitor webhook logs** in your CRM

4. **Set up alerting** for failed webhooks

5. **Regularly sync** to catch any missed calls:
   ```bash
   # Cron job to sync daily
   0 2 * * * curl https://your-crm.vercel.app/api/calls/sync?days=1
   ```

---

## 📞 **Need Help?**

- 📚 [Retell AI Docs](https://docs.retellai.com)
- 📧 [Retell AI Support](mailto:support@retellai.com)
- 📖 Full Integration Guide: `INTEGRATION-GUIDE.md`

---

## ✅ **Checklist**

- [ ] Retell AI account created
- [ ] API key obtained
- [ ] Webhook secret obtained
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Webhook configured in Retell AI
- [ ] Tenant ID added to agent metadata
- [ ] Test call completed
- [ ] Call appears in CRM

**Once all checked, you're live! 🎉**

