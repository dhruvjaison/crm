# 🚀 Quick Start: Chloe AI Integration

## ⚡ 3-Step Setup

### Step 1: Import N8N Workflow (2 minutes)
1. Open your Railway N8N instance
2. Click **Workflows** → **Import from File**
3. Select `n8n-workflow-chloe-enhanced.json`
4. Activate the workflow

### Step 2: Configure Retell AI Webhook (2 minutes)
1. Go to **Retell AI Dashboard** → **Settings** → **Webhooks**
2. Add webhook:
   - **URL**: `https://your-railway-n8n.railway.app/webhook/retell-webhook`
   - **Event**: `call.analyzed`
3. Save

### Step 3: Test (5 minutes)
1. Make a test call to Chloe
2. Mention:
   - Your industry ("I run an HVAC business")
   - Lead volume ("We get about 50 leads per week")
   - Pain point ("We're losing leads due to slow follow-up")
   - Revenue impact ("Probably losing $6,000 a month")
3. Book a call when Chloe offers
4. Check CRM:
   - New contact should appear with all insights
   - New deal should be created (if booked)
   - Lead score should be calculated

---

## 📊 What Gets Captured

From every Chloe call:
- ✅ Contact info (name, phone, email, business)
- ✅ Industry/business type
- ✅ Lead volume
- ✅ Pain points
- ✅ Estimated revenue loss
- ✅ Booking status
- ✅ Lead score (0-100)
- ✅ Full transcript
- ✅ Call sentiment

If call is booked:
- ✅ Automatic deal creation
- ✅ Deal value = annual revenue loss
- ✅ Expected close date = 30 days

---

## 🎯 Lead Scoring

**Base Score: 50**

**Increases:**
- 100+ leads/week: +20
- $10k+/month loss: +20
- Positive sentiment: +10
- Booked call: +20

**Decreases:**
- Negative sentiment: -10
- Disqualified: -20

**Score Range: 0-100**

---

## 🔧 Customization

### Change Lead Scoring Weights
Edit **"Extract Chloe Insights"** node in N8N:

```javascript
// Find this section:
if (volume > 100) leadScore += 20;

// Change to:
if (volume > 100) leadScore += 30; // Higher weight
```

### Add New Extraction Patterns
```javascript
// Add to industry patterns:
/(?:solar|roofing|landscaping)/i,
```

### Modify Deal Creation Logic
```javascript
// Change deal value calculation:
const dealValue = revenueLoss ? parseInt(revenueLoss.replace(/,/g, '')) * 24 : null; // 2-year value instead of 1-year
```

---

## 🐛 Troubleshooting

### Contact Not Created?
- Check N8N execution logs
- Verify phone number format (must be E.164: +12345678900)
- Ensure CRM API is accessible

### Deal Not Created?
- Check if `bookingStatus === 'booked'`
- Verify pipeline stages exist in CRM
- Check N8N logs for errors

### Low Lead Scores?
- Review Chloe's script - ensure she asks qualifying questions
- Adjust scoring weights in N8N
- Check sentiment analysis

---

## 📈 Best Practices

### Optimize Chloe's Questions
Ensure she asks:
- "How many leads do you get per week?"
- "What's your biggest challenge?"
- "Have you calculated the revenue impact?"
- "What industry are you in?"

### Monitor & Adjust
- Review lead scores weekly
- Track conversion rates by score range
- Update extraction patterns as needed
- Analyze common pain points

### Follow Up Fast
- Set notifications for 80+ scores
- Create tasks for booked calls
- Use CRM task management

---

## 📞 Test Script

Use this to test your integration:

**Call Chloe and say:**

> "Hi, I'm John from ABC HVAC. We're getting about 50 leads per week, but we're losing a lot of them because our follow-up is too slow. I think we're probably losing around $6,000 a month in revenue. I'd love to learn more about how you can help."

**Expected Results:**
- ✅ Contact created: John, ABC HVAC
- ✅ Industry: HVAC
- ✅ Lead Volume: 50 per week
- ✅ Pain Point: slow follow-up
- ✅ Revenue Loss: $6,000/month
- ✅ Lead Score: ~75-85
- ✅ Deal created (if you book)

---

## 🎉 Success!

Once you see the contact and deal in your CRM, you're ready to scale!

**Next:**
- [ ] Test with 10 real calls
- [ ] Review and adjust lead scoring
- [ ] Set up notifications for hot leads
- [ ] Build custom reports

**Full Guide:** See `CHLOE-INTEGRATION-GUIDE.md` for advanced features

---

**Questions?** Check the full integration guide or Vercel logs.

