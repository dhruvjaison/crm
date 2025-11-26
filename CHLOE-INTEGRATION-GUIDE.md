# 🎯 Chloe AI → CRM Integration Guide

## Overview

This guide explains how to integrate your **Chloe AI Voice Agent** (powered by Retell AI) with your CRM to automatically capture leads, extract insights, and create deals from phone conversations.

---

## 🏗️ Architecture

```
Retell AI (Chloe) → Webhook → Railway (N8N) → Parse & Extract → CRM API
```

### Components:
1. **Retell AI**: Your Chloe voice agent handles inbound/outbound calls
2. **Railway + N8N**: Middleware that receives webhooks, parses transcripts, extracts insights
3. **CRM API**: Receives structured data and creates/updates contacts and deals

---

## 📋 Prerequisites

- ✅ Retell AI account with Chloe agent configured
- ✅ Railway account with N8N deployed
- ✅ CRM deployed on Vercel (https://crm-swart-ten-11.vercel.app)
- ✅ Chloe agent prompt configured (see your existing prompt)

---

## 🚀 Step-by-Step Setup

### Step 1: Import N8N Workflow

1. **Open your N8N instance** on Railway
2. Click **"Workflows"** → **"Import from File"**
3. Upload `n8n-workflow-chloe-enhanced.json`
4. The workflow will be created with all nodes pre-configured

### Step 2: Configure Webhook in Retell AI

1. Go to **Retell AI Dashboard** → **Settings** → **Webhooks**
2. Add a new webhook with:
   - **URL**: `https://your-railway-n8n-url.railway.app/webhook/retell-webhook`
   - **Events**: Select `call.analyzed` (this fires after call ends and transcript is analyzed)
   - **Secret**: (optional, for security)
3. Save the webhook

### Step 3: Test the Integration

1. **Make a test call** to your Chloe agent
2. Have a conversation that includes:
   - Business type/industry
   - Lead volume
   - Pain points
   - Revenue loss estimate
   - Booking intent
3. **After the call ends**, check:
   - N8N execution log (should show successful run)
   - CRM Contacts page (new contact should appear)
   - CRM Deals page (if call was booked, deal should appear)

---

## 📊 What Data Gets Captured

### From Call Transcript:
- **Lead Volume**: "We get about 50 leads per week"
- **Industry**: "HVAC contractor", "dental clinic", etc.
- **Pain Point**: "slow follow-up", "missed calls", etc.
- **Revenue Loss**: "$6,000/month", "$10,000/month", etc.
- **Booking Status**: `booked`, `deferred`, `disqualified`, `not_booked`

### Calculated Fields:
- **Lead Score** (0-100): Based on lead volume, revenue loss, sentiment, and booking status
- **Deal Value**: Annual revenue loss (monthly × 12)
- **Tags**: Auto-generated from industry, pain point, and booking status

---

## 🧠 How Lead Scoring Works

```javascript
Base Score: 50

+ Lead Volume:
  - 100+ leads/week: +20
  - 50-99 leads/week: +15
  - 20-49 leads/week: +10

+ Revenue Loss:
  - $10,000+/month: +20
  - $5,000-$9,999/month: +15
  - $2,000-$4,999/month: +10

+ Sentiment:
  - Positive: +10
  - Negative: -10

+ Booking Status:
  - Booked: +20
  - Disqualified: -20

Final Score: 0-100 (capped)
```

---

## 🔄 Workflow Logic

### 1. Webhook Trigger
- Receives `call.analyzed` event from Retell AI
- Contains full call data, transcript, and analysis

### 2. Filter
- Only processes `call.analyzed` events
- Ignores other event types

### 3. Extract Insights (JavaScript)
- Parses transcript using regex patterns
- Extracts structured data
- Calculates lead score
- Determines booking status

### 4. Create/Update Contact
- **If phone number exists**: Updates existing contact, appends notes
- **If new**: Creates new contact with all insights
- Returns contact ID for next step

### 5. Check Booking Status
- **If booked**: Proceeds to create deal
- **If not booked**: Skips deal creation

### 6. Get Pipeline Stages
- Fetches available pipeline stages from CRM
- Uses first stage (typically "New Lead")

### 7. Create Deal (if booked)
- Creates deal with:
  - Title: "Strategy Call - [Industry/Business]"
  - Value: Annual revenue loss
  - Contact: Linked to contact from step 4
  - Stage: First pipeline stage
  - Expected close: 30 days from now

### 8. Webhook Response
- Returns success message to Retell AI
- Includes lead score and booking status

---

## 🎨 Customization

### Modify Extraction Patterns

Edit the **"Extract Chloe Insights"** node in N8N:

```javascript
// Example: Add new industry pattern
const industry = extractValue(transcript, [
  /(?:I run|I have|I own)\s+(?:a|an)?\s+([\w\s]+?)(?:business|company|practice|clinic)/i,
  /(?:we're|we are)\s+(?:a|an)?\s+([\w\s]+?)(?:business|company|contractor)/i,
  // ADD YOUR PATTERN HERE
  /(?:roofing|solar|landscaping)/i,
])
```

### Adjust Lead Scoring

```javascript
// Example: Increase weight for high revenue loss
if (loss > 20000) leadScore += 30; // Instead of +20
```

### Change Deal Stage

```javascript
// In "Create Deal in CRM" node, change stageId:
"stageId": "{{$json.stages[1].id}}", // Use second stage instead of first
```

---

## 🐛 Troubleshooting

### Contact Not Created
- **Check N8N logs**: Look for errors in execution
- **Verify API URL**: Ensure `https://crm-swart-ten-11.vercel.app/api/contacts` is correct
- **Check phone format**: Phone number must be in E.164 format (e.g., +12345678900)

### Deal Not Created
- **Check booking status**: Deal only created if `bookingStatus === 'booked'`
- **Verify contact ID**: Contact must be created successfully first
- **Check pipeline stages**: Ensure at least one stage exists in CRM

### Low Lead Scores
- **Review transcript**: Ensure Chloe is asking qualifying questions
- **Adjust scoring logic**: Modify weights in "Extract Chloe Insights" node
- **Check sentiment**: Negative sentiment reduces score

### Duplicate Contacts
- **Phone matching**: System matches on phone number, not email
- **Update logic**: Existing contacts are updated, not duplicated
- **Check tenant isolation**: Contacts are isolated per tenant

---

## 📈 Best Practices

### 1. Optimize Chloe's Script
Ensure Chloe asks these key questions:
- "How many leads do you typically get per week/month?"
- "What's your biggest challenge with lead follow-up?"
- "Have you calculated how much revenue you might be losing?"
- "What industry are you in?"

### 2. Monitor Lead Quality
- Review lead scores weekly
- Adjust scoring weights based on conversion rates
- Update extraction patterns as conversation styles evolve

### 3. Follow Up Quickly
- Set up notifications for high-score leads (80+)
- Create tasks automatically for booked calls
- Use CRM's task management to track follow-ups

### 4. Analyze Trends
- Track common pain points
- Identify high-converting industries
- Optimize Chloe's pitch based on successful calls

---

## 🔐 Security Considerations

### Webhook Security
- Use webhook secrets in Retell AI
- Validate signatures in N8N
- Restrict N8N webhook to Retell AI IPs

### Data Privacy
- Transcripts contain PII (Personally Identifiable Information)
- Ensure compliance with GDPR/CCPA
- Consider data retention policies

### API Authentication
- Use API keys for CRM endpoints (future enhancement)
- Implement rate limiting
- Log all API calls for audit trail

---

## 🎯 Next Steps

### Immediate (Week 1):
- [ ] Import N8N workflow
- [ ] Configure Retell AI webhook
- [ ] Test with 5-10 calls
- [ ] Review lead scores and adjust

### Short-term (Month 1):
- [ ] Add email extraction and validation
- [ ] Create automatic follow-up tasks
- [ ] Set up notifications for hot leads
- [ ] Build custom dashboard for Chloe insights

### Long-term (Quarter 1):
- [ ] Integrate with Google Calendar for automatic booking
- [ ] Add SMS follow-up automation
- [ ] Build AI-powered lead nurturing sequences
- [ ] Create custom reports for ROI analysis

---

## 📞 Support

### Need Help?
- **N8N Issues**: Check Railway logs and N8N community forum
- **Retell AI Issues**: Contact Retell AI support
- **CRM Issues**: Check `/TESTING-GUIDE.md` and Vercel logs

### Resources:
- [Retell AI Documentation](https://docs.retellai.com)
- [N8N Documentation](https://docs.n8n.io)
- [CRM Testing Guide](/TESTING-GUIDE.md)
- [Integration Roadmap](/FUTURE-INTEGRATIONS.md)

---

## 🎉 Success Metrics

Track these KPIs to measure integration success:

- **Call → Contact Conversion**: % of calls that create contacts
- **Call → Deal Conversion**: % of calls that create deals
- **Average Lead Score**: Trending up indicates better qualification
- **Time to Follow-Up**: Should decrease with automation
- **Deal Close Rate**: Compare Chloe-sourced vs. manual leads

---

**Ready to scale your lead generation with Chloe AI? 🚀**

