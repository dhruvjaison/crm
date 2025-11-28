export interface HelpArticle {
  title: string
  description: string
  content: string
  lastUpdated: string
  readTime: number
  relatedArticles?: { title: string; slug: string }[]
}

export const helpArticles: Record<string, HelpArticle> = {
  'welcome': {
    title: 'Welcome to Your CRM',
    description: 'Get started with your new CRM platform and learn the basics',
    lastUpdated: 'November 28, 2024',
    readTime: 5,
    content: `
      <h2>Welcome to Your CRM Platform!</h2>
      <p>Thank you for choosing our CRM solution. This guide will help you get started and make the most of your new platform.</p>
      
      <h3>What is a CRM?</h3>
      <p>A Customer Relationship Management (CRM) system helps you manage all your customer interactions, sales opportunities, and business relationships in one place.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li><strong>Contact Management:</strong> Store and organize all your customer information</li>
        <li><strong>Deal Pipeline:</strong> Track sales opportunities from lead to close</li>
        <li><strong>AI Voice Analytics:</strong> Get insights from every customer call</li>
        <li><strong>Task Management:</strong> Never miss a follow-up or deadline</li>
        <li><strong>Email Automation:</strong> Send personalized emails at scale</li>
        <li><strong>Analytics & Reports:</strong> Make data-driven decisions</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>Here's what we recommend you do first:</p>
      <ol>
        <li>Complete your account setup in Settings</li>
        <li>Import your existing contacts (or add them manually)</li>
        <li>Set up your deal pipeline stages</li>
        <li>Connect your integrations (Google Calendar, phone system, etc.)</li>
        <li>Create your first email template</li>
      </ol>
      
      <h3>Need Help?</h3>
      <p>Our support team is available 24/7. You can reach us through the chat widget or by emailing support@clarostrategy.com</p>
    `,
    relatedArticles: [
      { title: 'Quick Start Guide', slug: 'quick-start' },
      { title: 'Setting Up Your Account', slug: 'account-setup' },
    ]
  },
  
  'quick-start': {
    title: 'Quick Start Guide',
    description: 'Get up and running in 10 minutes',
    lastUpdated: 'November 28, 2024',
    readTime: 10,
    content: `
      <h2>Quick Start Guide</h2>
      <p>Follow these steps to get your CRM up and running quickly.</p>
      
      <h3>Step 1: Complete Your Profile</h3>
      <p>Go to <strong>Settings → Account</strong> and fill in your company information. This helps personalize your experience.</p>
      
      <h3>Step 2: Add Your First Contact</h3>
      <p>Navigate to <strong>Contacts</strong> and click the <strong>"Add Contact"</strong> button. Fill in the contact details:</p>
      <ul>
        <li>Name (required)</li>
        <li>Email and phone number</li>
        <li>Company and job title</li>
        <li>Lead score (how qualified they are)</li>
        <li>Any relevant notes</li>
      </ul>
      
      <h3>Step 3: Create Your First Deal</h3>
      <p>Go to <strong>Deals</strong> and click <strong>"Create Deal"</strong>. Link it to a contact and set:</p>
      <ul>
        <li>Deal value</li>
        <li>Expected close date</li>
        <li>Current stage in your pipeline</li>
      </ul>
      
      <h3>Step 4: Import Existing Data (Optional)</h3>
      <p>If you have existing contacts or deals in a spreadsheet:</p>
      <ol>
        <li>Go to Contacts or Deals page</li>
        <li>Click <strong>"Import CSV"</strong></li>
        <li>Upload your file and map the columns</li>
        <li>Review and confirm the import</li>
      </ol>
      
      <h3>Step 5: Connect Your Integrations</h3>
      <p>Visit <strong>Integrations</strong> to connect:</p>
      <ul>
        <li><strong>Google Calendar:</strong> Sync your meetings and calls</li>
        <li><strong>AI Voice Agent:</strong> Automatically log and analyze calls</li>
        <li><strong>Email:</strong> Send automated campaigns</li>
      </ul>
      
      <h3>You're All Set!</h3>
      <p>Your CRM is now ready to use. Explore the dashboard to see your metrics and start managing your customer relationships.</p>
    `,
    relatedArticles: [
      { title: 'Adding Contacts', slug: 'adding-contacts' },
      { title: 'Creating Deals', slug: 'creating-deals' },
    ]
  },
  
  'adding-contacts': {
    title: 'Adding Contacts',
    description: 'Learn how to add and manage contacts in your CRM',
    lastUpdated: 'November 28, 2024',
    readTime: 7,
    content: `
      <h2>Adding Contacts to Your CRM</h2>
      <p>Contacts are the foundation of your CRM. Here's everything you need to know about adding and managing them.</p>
      
      <h3>Adding a Single Contact</h3>
      <ol>
        <li>Navigate to the <strong>Contacts</strong> page</li>
        <li>Click the <strong>"Add Contact"</strong> button in the top right</li>
        <li>Fill in the contact information:
          <ul>
            <li><strong>First Name & Last Name:</strong> Required fields</li>
            <li><strong>Email:</strong> Primary contact method</li>
            <li><strong>Phone:</strong> For calls and SMS</li>
            <li><strong>Company:</strong> Their organization</li>
            <li><strong>Job Title:</strong> Their role</li>
            <li><strong>Status:</strong> Lead, Qualified, Customer, or Inactive</li>
            <li><strong>Lead Score:</strong> Rate from 0-100 based on qualification</li>
            <li><strong>Tags:</strong> Add custom tags for organization</li>
            <li><strong>Notes:</strong> Any additional information</li>
          </ul>
        </li>
        <li>Click <strong>"Save"</strong></li>
      </ol>
      
      <h3>Understanding Lead Scores</h3>
      <p>Lead scores help you prioritize which contacts to focus on:</p>
      <ul>
        <li><strong>80-100:</strong> Hot leads - ready to buy</li>
        <li><strong>60-79:</strong> Warm leads - interested but need nurturing</li>
        <li><strong>40-59:</strong> Cool leads - early stage interest</li>
        <li><strong>0-39:</strong> Cold leads - minimal engagement</li>
      </ul>
      
      <h3>Contact Statuses</h3>
      <ul>
        <li><strong>Lead:</strong> New prospect, not yet qualified</li>
        <li><strong>Qualified:</strong> Vetted and meets your criteria</li>
        <li><strong>Customer:</strong> Active paying customer</li>
        <li><strong>Inactive:</strong> No longer engaged</li>
      </ul>
      
      <h3>Using Tags</h3>
      <p>Tags help you organize and filter contacts. Examples:</p>
      <ul>
        <li>Industry tags: "Healthcare", "Finance", "Tech"</li>
        <li>Source tags: "Website", "Referral", "Trade Show"</li>
        <li>Interest tags: "Enterprise Plan", "Demo Requested"</li>
      </ul>
      
      <h3>Editing Contacts</h3>
      <p>To edit a contact:</p>
      <ol>
        <li>Click on the contact's name in the list</li>
        <li>Click the <strong>"Edit"</strong> button</li>
        <li>Make your changes</li>
        <li>Click <strong>"Save"</strong></li>
      </ol>
      
      <h3>Deleting Contacts</h3>
      <p><strong>Warning:</strong> Deleting a contact is permanent and will remove all associated data.</p>
      <ol>
        <li>Click on the contact</li>
        <li>Click the <strong>"Delete"</strong> button</li>
        <li>Confirm the deletion</li>
      </ol>
    `,
    relatedArticles: [
      { title: 'Importing Contacts from CSV', slug: 'import-contacts-csv' },
      { title: 'Understanding Lead Scores', slug: 'lead-scores' },
    ]
  },
  
  'import-contacts-csv': {
    title: 'Importing Contacts from CSV',
    description: 'Bulk import your contacts from a spreadsheet',
    lastUpdated: 'November 28, 2024',
    readTime: 8,
    content: `
      <h2>Importing Contacts from CSV</h2>
      <p>Save time by importing multiple contacts at once from a CSV file.</p>
      
      <h3>Preparing Your CSV File</h3>
      <p>Your CSV file should have these columns (column names must match exactly):</p>
      <ul>
        <li><code>firstName</code> - Required</li>
        <li><code>lastName</code> - Required</li>
        <li><code>email</code> - Required</li>
        <li><code>phone</code> - Optional</li>
        <li><code>company</code> - Optional</li>
        <li><code>jobTitle</code> - Optional</li>
        <li><code>status</code> - Optional (LEAD, QUALIFIED, CUSTOMER, or INACTIVE)</li>
        <li><code>leadScore</code> - Optional (number 0-100)</li>
        <li><code>tags</code> - Optional (comma-separated)</li>
        <li><code>notes</code> - Optional</li>
      </ul>
      
      <h3>Example CSV Format</h3>
      <pre><code>firstName,lastName,email,phone,company,jobTitle,status,leadScore,tags,notes
John,Doe,john@example.com,555-0100,Acme Corp,CEO,QUALIFIED,85,"vip,enterprise","Met at conference"
Jane,Smith,jane@example.com,555-0101,Tech Inc,CTO,LEAD,60,"tech,demo-requested","Interested in API"</code></pre>
      
      <h3>Importing Your File</h3>
      <ol>
        <li>Go to the <strong>Contacts</strong> page</li>
        <li>Click <strong>"Import CSV"</strong></li>
        <li>Click <strong>"Choose File"</strong> and select your CSV</li>
        <li>Review the column mapping:
          <ul>
            <li>The system will automatically match columns</li>
            <li>Verify each field is mapped correctly</li>
            <li>Unmapped columns will be ignored</li>
          </ul>
        </li>
        <li>Choose duplicate handling:
          <ul>
            <li><strong>Skip:</strong> Don't import duplicates</li>
            <li><strong>Update:</strong> Update existing contacts</li>
          </ul>
        </li>
        <li>Click <strong>"Import"</strong></li>
      </ol>
      
      <h3>After Import</h3>
      <p>You'll see a summary showing:</p>
      <ul>
        <li>Number of contacts imported successfully</li>
        <li>Number of duplicates skipped/updated</li>
        <li>Any errors that occurred</li>
      </ul>
      
      <h3>Common Issues</h3>
      <p><strong>Invalid email addresses:</strong> Contacts with invalid emails will be skipped.</p>
      <p><strong>Missing required fields:</strong> firstName, lastName, and email are required.</p>
      <p><strong>Invalid status values:</strong> Status must be LEAD, QUALIFIED, CUSTOMER, or INACTIVE.</p>
      <p><strong>Lead score out of range:</strong> Must be between 0 and 100.</p>
      
      <h3>Tips for Success</h3>
      <ul>
        <li>Test with a small file first (5-10 contacts)</li>
        <li>Clean your data before importing (remove duplicates, fix formatting)</li>
        <li>Use UTF-8 encoding for special characters</li>
        <li>Keep file size under 5MB for best performance</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Adding Contacts', slug: 'adding-contacts' },
      { title: 'Managing Contact Information', slug: 'managing-contacts' },
    ]
  },
  
  'creating-deals': {
    title: 'Creating Deals',
    description: 'Track sales opportunities from lead to close',
    lastUpdated: 'November 28, 2024',
    readTime: 6,
    content: `
      <h2>Creating and Managing Deals</h2>
      <p>Deals represent sales opportunities in your pipeline. Here's how to create and manage them effectively.</p>
      
      <h3>Creating a New Deal</h3>
      <ol>
        <li>Navigate to the <strong>Deals</strong> page</li>
        <li>Click <strong>"Create Deal"</strong></li>
        <li>Fill in the deal information:
          <ul>
            <li><strong>Title:</strong> Name of the opportunity (e.g., "Acme Corp - Enterprise Plan")</li>
            <li><strong>Contact:</strong> Link to the primary contact (required)</li>
            <li><strong>Value:</strong> Expected revenue from this deal</li>
            <li><strong>Stage:</strong> Current position in your pipeline</li>
            <li><strong>Expected Close Date:</strong> When you expect to close</li>
            <li><strong>Probability:</strong> Likelihood of closing (0-100%)</li>
          </ul>
        </li>
        <li>Click <strong>"Create"</strong></li>
      </ol>
      
      <h3>Deal Stages</h3>
      <p>Your pipeline has these default stages:</p>
      <ol>
        <li><strong>Discovery:</strong> Initial contact and qualification</li>
        <li><strong>Qualification:</strong> Determining fit and budget</li>
        <li><strong>Proposal:</strong> Presenting your solution</li>
        <li><strong>Negotiation:</strong> Discussing terms and pricing</li>
        <li><strong>Closed Won:</strong> Deal successfully closed</li>
        <li><strong>Closed Lost:</strong> Deal didn't work out</li>
      </ol>
      
      <h3>Moving Deals Through Stages</h3>
      <p>To update a deal's stage:</p>
      <ol>
        <li>Click on the deal to view details</li>
        <li>Click <strong>"Edit"</strong></li>
        <li>Select the new stage</li>
        <li>Update probability if needed</li>
        <li>Click <strong>"Save"</strong></li>
      </ol>
      
      <h3>Best Practices</h3>
      <ul>
        <li><strong>Be realistic with values:</strong> Base deal values on actual quotes or estimates</li>
        <li><strong>Update regularly:</strong> Keep stages and probabilities current</li>
        <li><strong>Set close dates:</strong> Helps with forecasting and follow-ups</li>
        <li><strong>Link to contacts:</strong> Always associate deals with the right contact</li>
        <li><strong>Add notes:</strong> Document important conversations and decisions</li>
      </ul>
      
      <h3>Winning a Deal</h3>
      <p>When you close a deal successfully:</p>
      <ol>
        <li>Move it to <strong>"Closed Won"</strong> stage</li>
        <li>Verify the final deal value</li>
        <li>Update the contact status to "Customer"</li>
        <li>Create follow-up tasks for onboarding</li>
      </ol>
      
      <h3>Losing a Deal</h3>
      <p>If a deal doesn't work out:</p>
      <ol>
        <li>Move it to <strong>"Closed Lost"</strong> stage</li>
        <li>Add notes explaining why (helps improve future deals)</li>
        <li>Set a reminder to follow up in 3-6 months</li>
      </ol>
    `,
    relatedArticles: [
      { title: 'Managing Your Pipeline', slug: 'pipeline-management' },
      { title: 'Deal Stages Explained', slug: 'deal-stages' },
    ]
  },
  
  'call-analytics': {
    title: 'Understanding AI Call Analytics',
    description: 'Get insights from every customer conversation',
    lastUpdated: 'November 28, 2024',
    readTime: 8,
    content: `
      <h2>AI Call Analytics</h2>
      <p>Your CRM automatically analyzes every call to provide actionable insights.</p>
      
      <h3>What Gets Analyzed</h3>
      <p>For every call, our AI captures:</p>
      <ul>
        <li><strong>Full Transcript:</strong> Word-for-word conversation</li>
        <li><strong>Sentiment:</strong> Positive, neutral, or negative tone</li>
        <li><strong>Key Topics:</strong> Main discussion points</li>
        <li><strong>Action Items:</strong> Follow-ups and commitments</li>
        <li><strong>Pain Points:</strong> Customer challenges mentioned</li>
        <li><strong>Buying Signals:</strong> Interest indicators</li>
        <li><strong>Objections:</strong> Concerns raised</li>
      </ul>
      
      <h3>Viewing Call Details</h3>
      <ol>
        <li>Go to <strong>Calls</strong> page</li>
        <li>Click on any call to see:
          <ul>
            <li>Full transcript with timestamps</li>
            <li>Sentiment analysis graph</li>
            <li>Key moments highlighted</li>
            <li>Suggested follow-up actions</li>
          </ul>
        </li>
      </ol>
      
      <h3>Sentiment Analysis</h3>
      <p>Sentiment is measured throughout the call:</p>
      <ul>
        <li><strong>Positive (Green):</strong> Customer is happy, engaged, interested</li>
        <li><strong>Neutral (Gray):</strong> Informational, factual discussion</li>
        <li><strong>Negative (Red):</strong> Frustrated, concerned, or unhappy</li>
      </ul>
      <p>Watch for sentiment changes - a shift from positive to negative may indicate an objection or concern that needs addressing.</p>
      
      <h3>Automatic CRM Updates</h3>
      <p>After each call, the system automatically:</p>
      <ul>
        <li>Updates contact lead score based on engagement</li>
        <li>Logs pain points and interests</li>
        <li>Creates follow-up tasks if needed</li>
        <li>Updates deal probability if applicable</li>
        <li>Flags hot leads for immediate attention</li>
      </ul>
      
      <h3>Using Insights to Close Deals</h3>
      <p><strong>Review transcripts before follow-ups:</strong> Refresh your memory on what was discussed.</p>
      <p><strong>Address objections:</strong> Prepare responses to concerns raised.</p>
      <p><strong>Focus on pain points:</strong> Tailor your pitch to their specific challenges.</p>
      <p><strong>Follow up on action items:</strong> Show you're reliable and attentive.</p>
      
      <h3>Call Metrics</h3>
      <p>Track these key metrics on your dashboard:</p>
      <ul>
        <li><strong>Call Volume:</strong> Total calls over time</li>
        <li><strong>Average Duration:</strong> How long calls typically last</li>
        <li><strong>Sentiment Distribution:</strong> Percentage of positive/neutral/negative calls</li>
        <li><strong>Conversion Rate:</strong> Calls that lead to deals</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Call Transcripts & Insights', slug: 'call-transcripts' },
      { title: 'Sentiment Analysis', slug: 'sentiment-analysis' },
    ]
  },
  
  'understanding-roi': {
    title: 'Understanding ROI',
    description: 'See how much you\'re saving with AI voice automation',
    lastUpdated: 'November 28, 2024',
    readTime: 6,
    content: `
      <h2>Understanding Your ROI</h2>
      <p>Your CRM automatically calculates cost savings compared to traditional call centers.</p>
      
      <h3>How Savings Are Calculated</h3>
      <p>We compare two scenarios:</p>
      
      <h4>Traditional Call Center</h4>
      <ul>
        <li>Average cost: $1.25 per minute</li>
        <li>Includes: Agent salaries, benefits, training, infrastructure, management</li>
        <li>Fixed costs regardless of call volume</li>
      </ul>
      
      <h4>AI Voice Solution</h4>
      <ul>
        <li>Average cost: $0.05 per minute</li>
        <li>Includes: AI processing, phone system, platform fees</li>
        <li>Scales with usage</li>
      </ul>
      
      <h3>Your Savings Dashboard</h3>
      <p>Go to <strong>Cost Savings</strong> to see:</p>
      <ul>
        <li><strong>Total Savings:</strong> All-time cost reduction</li>
        <li><strong>Monthly Savings:</strong> Current month performance</li>
        <li><strong>Cost Per Call:</strong> Average expense per conversation</li>
        <li><strong>Savings Percentage:</strong> How much you're reducing costs</li>
      </ul>
      
      <h3>Additional Benefits</h3>
      <p>Beyond direct cost savings, you also gain:</p>
      <ul>
        <li><strong>24/7 Availability:</strong> No overtime or night shift costs</li>
        <li><strong>Instant Scaling:</strong> Handle call spikes without hiring</li>
        <li><strong>Consistent Quality:</strong> Every call follows best practices</li>
        <li><strong>Perfect Memory:</strong> Never forget customer details</li>
        <li><strong>Instant Analysis:</strong> Insights available immediately</li>
      </ul>
      
      <h3>Maximizing Your ROI</h3>
      <p>To get the most value:</p>
      <ol>
        <li><strong>Use AI for high-volume tasks:</strong> Qualification, scheduling, follow-ups</li>
        <li><strong>Reserve humans for complex sales:</strong> Let AI handle the rest</li>
        <li><strong>Act on insights quickly:</strong> Use AI analysis to close deals faster</li>
        <li><strong>Automate follow-ups:</strong> Let the system handle routine tasks</li>
      </ol>
      
      <h3>Reporting ROI to Stakeholders</h3>
      <p>Use these talking points:</p>
      <ul>
        <li>"We've saved $X this month compared to traditional call centers"</li>
        <li>"Our cost per call is 96% lower than industry average"</li>
        <li>"We can now handle 10x more calls with the same budget"</li>
        <li>"Call quality and consistency has improved significantly"</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Cost Comparison Analysis', slug: 'cost-comparison' },
      { title: 'Maximizing Savings', slug: 'maximizing-savings' },
    ]
  },
}

