# 🔗 Retell AI + N8N Integration Guide

## 🎯 **Goal**
Automatically populate your CRM with data from Retell AI calls using N8N on Railway.

---

## 📊 **How Data Flows**

```
Retell AI Call → Retell Webhook → N8N (Railway) → Your CRM API → Database
```

### **What Gets Populated:**
1. **Contacts** - Auto-created from call participants
2. **Calls** - Full call records with transcripts
3. **Deals** - Created based on call outcomes
4. **Tasks** - Follow-ups based on AI analysis
5. **Activities** - Timeline of all interactions

---

## 🔧 **Integration Options**

### **Option 1: Direct Webhook (Simple)**
Retell AI → Your CRM Webhook Endpoint

**Pros:**
- Direct connection
- No middleman
- Fastest

**Cons:**
- Less flexibility
- Harder to modify logic
- No visual workflow

### **Option 2: N8N Workflow (Recommended)**
Retell AI → N8N → Your CRM API

**Pros:**
- Visual workflow builder
- Easy to modify
- Can add logic (routing, filtering, enrichment)
- Can connect to other tools
- Error handling & retries

**Cons:**
- Extra hop (minimal delay)
- Need to maintain N8N

---

## 🚀 **Setup: N8N Integration**

### **Step 1: Your CRM Already Has Webhook Endpoint**

✅ **Endpoint:** `https://crm-swart-ten-11.vercel.app/api/webhooks/retell`

This endpoint already handles:
- `call.started` - Call begins
- `call.ended` - Call completes
- `call.analyzed` - AI analysis ready

### **Step 2: Create N8N Workflow**

1. **Login to N8N on Railway**
2. **Create New Workflow**
3. **Add Webhook Trigger Node**
   - Method: POST
   - Path: `/retell-webhook`
   - Authentication: None (or add header auth)

4. **Add HTTP Request Node**
   - Method: POST
   - URL: `https://crm-swart-ten-11.vercel.app/api/webhooks/retell`
   - Headers:
     ```json
     {
       "Content-Type": "application/json",
       "x-retell-signature": "{{$node["Webhook"].json["headers"]["x-retell-signature"]}}"
     }
     ```
   - Body: `{{$json}}`

5. **Activate Workflow**

### **Step 3: Configure Retell AI**

1. Go to Retell AI Dashboard
2. Settings → Webhooks
3. Add Webhook URL: `https://your-n8n-railway.up.railway.app/webhook/retell-webhook`
4. Select Events:
   - ✅ call.started
   - ✅ call.ended
   - ✅ call.analyzed
5. Save

---

## 📝 **N8N Workflow Example (Advanced)**

```
┌─────────────┐
│  Webhook    │ ← Retell AI sends data here
│  Trigger    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Switch    │ ← Route based on event type
│   Node      │
└──────┬──────┘
       │
       ├─── call.started ───► Create Contact (if new)
       │
       ├─── call.ended ─────► Create Call Record
       │                      └─► Update Contact
       │                      └─► Create Activity
       │
       └─── call.analyzed ──► Create Deal (if qualified)
                              └─► Create Task (follow-up)
                              └─► Send to CRM API
```

---

## 🔑 **API Endpoints You Can Use**

### **1. Create Contact**
```http
POST /api/contacts
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+15551234567",
  "company": "Acme Corp",
  "status": "LEAD",
  "leadScore": 50
}
```

### **2. Create Deal**
```http
POST /api/deals
Content-Type: application/json

{
  "title": "Q4 Enterprise Deal",
  "value": 50000,
  "contactId": "contact-id-here",
  "stageId": "stage-id-here",
  "expectedCloseDate": "2024-12-31"
}
```

### **3. Create Task**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Follow up with John Doe",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2024-12-01",
  "description": "Discuss pricing options"
}
```

### **4. Webhook (Existing)**
```http
POST /api/webhooks/retell
Content-Type: application/json
x-retell-signature: signature-here

{
  "event": "call.ended",
  "call": { ... }
}
```

---

## 🎨 **N8N Workflow Features You Can Add**

### **1. Contact Enrichment**
```
Retell Call → Extract Email → Clearbit API → Enrich Contact → CRM
```

### **2. Lead Scoring**
```
Call Data → AI Analysis → Calculate Score → Update Contact
```

### **3. Slack Notifications**
```
High-Value Deal → Slack Webhook → Notify Sales Team
```

### **4. Email Follow-up**
```
Call Ended → Send Email → Track Response → Update CRM
```

### **5. Multi-CRM Sync**
```
Retell Call → Your CRM
              └─► HubSpot
              └─► Salesforce
```

---

## 🔐 **Security Best Practices**

### **1. Webhook Signature Verification**
Already implemented in `/api/webhooks/retell/route.ts`:
```typescript
const signature = request.headers.get('x-retell-signature')
// Verify signature matches
```

### **2. API Key Authentication**
Add to N8N HTTP Request headers:
```json
{
  "Authorization": "Bearer your-api-key-here"
}
```

### **3. IP Whitelist**
Restrict webhook endpoint to:
- Retell AI IPs
- N8N Railway IPs

---

## 📊 **Data Mapping: Retell → CRM**

### **Call Data**
```javascript
// Retell AI Webhook
{
  "call_id": "abc123",
  "from_number": "+15551234567",
  "to_number": "+15559876543",
  "duration": 180,
  "transcript": "...",
  "sentiment": "positive"
}

// Maps to CRM
{
  "retellCallId": "abc123",
  "direction": "inbound",
  "fromNumber": "+15551234567",
  "toNumber": "+15559876543",
  "duration": 180,
  "transcript": "...",
  "sentiment": "POSITIVE",
  "status": "COMPLETED"
}
```

### **Auto-Create Contact**
```javascript
// Extract from call
const contact = {
  firstName: extractFromTranscript(transcript, 'first_name'),
  lastName: extractFromTranscript(transcript, 'last_name'),
  phone: call.from_number,
  email: extractFromTranscript(transcript, 'email'),
  leadScore: calculateScore(sentiment, duration)
}
```

---

## 🧪 **Testing the Integration**

### **1. Test N8N Webhook**
```bash
curl -X POST https://your-n8n.railway.app/webhook/retell-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "call.ended",
    "call": {
      "call_id": "test123",
      "from_number": "+15551234567",
      "duration": 120
    }
  }'
```

### **2. Check CRM**
- Go to Contacts → Should see new contact
- Go to Calls → Should see call record
- Go to Activities → Should see activity log

### **3. Monitor N8N**
- Check execution history
- View logs
- Debug errors

---

## 🚀 **Quick Start Template**

### **N8N Workflow JSON** (Import this)
```json
{
  "name": "Retell AI to CRM",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "retell-webhook",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://crm-swart-ten-11.vercel.app/api/webhooks/retell",
        "method": "POST",
        "jsonParameters": true,
        "options": {}
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "HTTP Request", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## 📈 **Next Steps**

1. ✅ **Demo data cleared** - Your CRM is empty and ready
2. 🔄 **Setup N8N workflow** - Use template above
3. 🔗 **Connect Retell AI** - Add webhook URL
4. 🧪 **Test with real call** - Make a call, see data flow
5. 🎨 **Customize workflow** - Add enrichment, routing, etc.

---

## 💡 **Pro Tips**

### **1. Use N8N for Business Logic**
Don't put complex logic in your CRM. Use N8N to:
- Filter spam calls
- Route to different pipelines
- Enrich contact data
- Trigger automations

### **2. Error Handling**
Add error nodes in N8N:
- Retry failed requests
- Log errors to Slack
- Fallback to manual review

### **3. Rate Limiting**
If you get many calls:
- Add queue node
- Batch requests
- Use async processing

---

## 🆘 **Troubleshooting**

### **Webhook not receiving data**
- Check Retell AI webhook settings
- Verify N8N URL is correct
- Check N8N is running on Railway
- Test with curl

### **Data not appearing in CRM**
- Check N8N execution logs
- Verify API endpoint URL
- Check authentication headers
- Look at CRM API logs (Vercel)

### **Duplicate contacts**
- Add deduplication logic in N8N
- Check by phone/email before creating
- Use upsert instead of create

---

## 📞 **Need Help?**

Let me know:
- Which N8N nodes you need help with
- What data you want to capture
- What automations you want to add

I can create custom N8N workflows for your specific use case!

---

**Your CRM is now ready for Retell AI integration! 🚀**

Refresh your browser and you'll see empty states. Data will populate automatically once you connect Retell AI!

