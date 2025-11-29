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

  // Additional articles to complete the help system
  'managing-contacts': {
    title: 'Managing Contact Information',
    description: 'Best practices for keeping contact data organized and up-to-date',
    lastUpdated: 'November 29, 2024',
    readTime: 6,
    content: `
      <h2>Managing Contact Information</h2>
      <p>Keeping your contact data organized and current is crucial for effective CRM usage.</p>
      
      <h3>Updating Contact Information</h3>
      <p>To update a contact's information:</p>
      <ol>
        <li>Navigate to the Contacts page</li>
        <li>Click on the contact's name</li>
        <li>Click the "Edit" button</li>
        <li>Make your changes</li>
        <li>Click "Save"</li>
      </ol>
      
      <h3>Organizing with Tags</h3>
      <p>Tags are powerful tools for segmentation:</p>
      <ul>
        <li><strong>Industry tags:</strong> Group by sector (Healthcare, Finance, Tech)</li>
        <li><strong>Source tags:</strong> Track where leads came from (Website, Referral, Event)</li>
        <li><strong>Interest tags:</strong> Note what they're interested in (Enterprise, Demo, Trial)</li>
        <li><strong>Status tags:</strong> Custom statuses beyond the default (VIP, At Risk, Champion)</li>
      </ul>
      
      <h3>Contact Hygiene Best Practices</h3>
      <ul>
        <li>Review and update contacts quarterly</li>
        <li>Remove duplicate entries immediately</li>
        <li>Verify email addresses before bulk campaigns</li>
        <li>Add notes after every interaction</li>
        <li>Keep phone numbers in consistent format</li>
      </ul>
      
      <h3>Bulk Actions</h3>
      <p>Save time with bulk operations:</p>
      <ul>
        <li>Select multiple contacts using checkboxes</li>
        <li>Apply tags to multiple contacts at once</li>
        <li>Update status for a group</li>
        <li>Export selected contacts to CSV</li>
      </ul>
      
      <h3>Data Privacy</h3>
      <p>Remember to:</p>
      <ul>
        <li>Only store information you have permission to keep</li>
        <li>Honor opt-out requests immediately</li>
        <li>Regularly audit for outdated information</li>
        <li>Follow GDPR/CCPA guidelines for data retention</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Adding Contacts', slug: 'adding-contacts' },
      { title: 'Understanding Lead Scores', slug: 'lead-scores' },
    ]
  },

  'lead-scores': {
    title: 'Understanding Lead Scores',
    description: 'How to use lead scoring to prioritize your best opportunities',
    lastUpdated: 'November 29, 2024',
    readTime: 7,
    content: `
      <h2>Understanding Lead Scores</h2>
      <p>Lead scoring helps you focus on the prospects most likely to convert.</p>
      
      <h3>What is Lead Scoring?</h3>
      <p>Lead scoring assigns a numerical value (0-100) to each contact based on their likelihood to become a customer. Higher scores indicate better-qualified leads.</p>
      
      <h3>Score Ranges</h3>
      <ul>
        <li><strong>80-100 (Hot):</strong> Ready to buy, high engagement, perfect fit</li>
        <li><strong>60-79 (Warm):</strong> Interested but needs nurturing, good fit</li>
        <li><strong>40-59 (Cool):</strong> Early interest, requires education</li>
        <li><strong>0-39 (Cold):</strong> Minimal engagement, poor fit, or unresponsive</li>
      </ul>
      
      <h3>Factors That Increase Score</h3>
      <ul>
        <li><strong>Engagement:</strong> Opens emails, clicks links, visits website</li>
        <li><strong>Demographics:</strong> Job title, company size, industry match</li>
        <li><strong>Behavior:</strong> Downloaded content, attended webinar, requested demo</li>
        <li><strong>Budget:</strong> Has budget authority or influence</li>
        <li><strong>Timeline:</strong> Looking to buy soon</li>
      </ul>
      
      <h3>Factors That Decrease Score</h3>
      <ul>
        <li>Unsubscribes from emails</li>
        <li>No engagement for 90+ days</li>
        <li>Wrong company size or industry</li>
        <li>Student or personal email address</li>
        <li>Competitor company</li>
      </ul>
      
      <h3>AI-Powered Scoring</h3>
      <p>Our AI automatically adjusts lead scores based on:</p>
      <ul>
        <li>Call sentiment and engagement</li>
        <li>Questions asked during calls</li>
        <li>Pain points mentioned</li>
        <li>Buying signals detected</li>
        <li>Objections raised</li>
      </ul>
      
      <h3>Using Scores Effectively</h3>
      <ol>
        <li><strong>Prioritize outreach:</strong> Call hot leads first</li>
        <li><strong>Segment campaigns:</strong> Different messages for different scores</li>
        <li><strong>Automate follow-ups:</strong> Trigger emails when score increases</li>
        <li><strong>Alert sales team:</strong> Notify when lead becomes hot</li>
      </ol>
    `,
    relatedArticles: [
      { title: 'Adding Contacts', slug: 'adding-contacts' },
      { title: 'Managing Contact Information', slug: 'managing-contacts' },
    ]
  },

  'pipeline-management': {
    title: 'Managing Your Pipeline',
    description: 'Strategies for optimizing your sales pipeline',
    lastUpdated: 'November 29, 2024',
    readTime: 9,
    content: `
      <h2>Managing Your Pipeline</h2>
      <p>A well-managed pipeline is the key to predictable revenue growth.</p>
      
      <h3>Pipeline Overview</h3>
      <p>Your pipeline visualizes all active deals and their stages. Use it to:</p>
      <ul>
        <li>See where deals are stuck</li>
        <li>Forecast revenue</li>
        <li>Identify bottlenecks</li>
        <li>Balance workload</li>
      </ul>
      
      <h3>Pipeline Metrics to Track</h3>
      <ul>
        <li><strong>Total Pipeline Value:</strong> Sum of all open deals</li>
        <li><strong>Weighted Pipeline:</strong> Adjusted by probability</li>
        <li><strong>Average Deal Size:</strong> Total value ÷ number of deals</li>
        <li><strong>Win Rate:</strong> Closed won ÷ total closed</li>
        <li><strong>Average Sales Cycle:</strong> Days from first contact to close</li>
        <li><strong>Conversion Rate by Stage:</strong> % moving to next stage</li>
      </ul>
      
      <h3>Pipeline Health Indicators</h3>
      <p><strong>Healthy Pipeline:</strong></p>
      <ul>
        <li>3-4x your quota in total value</li>
        <li>Even distribution across stages</li>
        <li>Deals moving consistently</li>
        <li>High conversion rates</li>
      </ul>
      
      <p><strong>Unhealthy Pipeline:</strong></p>
      <ul>
        <li>Too many deals in early stages</li>
        <li>Deals stuck for 30+ days</li>
        <li>Low conversion rates</li>
        <li>Insufficient new leads</li>
      </ul>
      
      <h3>Pipeline Management Best Practices</h3>
      <ol>
        <li><strong>Weekly Reviews:</strong> Review every deal, update stages</li>
        <li><strong>Qualify Ruthlessly:</strong> Remove bad-fit deals early</li>
        <li><strong>Set Next Steps:</strong> Every deal needs a clear next action</li>
        <li><strong>Use Probability:</strong> Be realistic about close likelihood</li>
        <li><strong>Clean Regularly:</strong> Archive stale deals monthly</li>
      </ol>
      
      <h3>Common Pipeline Mistakes</h3>
      <ul>
        <li>Keeping dead deals "just in case"</li>
        <li>Moving deals forward without buyer commitment</li>
        <li>Ignoring deals in early stages</li>
        <li>Not following up consistently</li>
        <li>Overestimating close probability</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Creating Deals', slug: 'creating-deals' },
      { title: 'Deal Stages Explained', slug: 'deal-stages' },
    ]
  },

  'deal-stages': {
    title: 'Deal Stages Explained',
    description: 'Understanding each stage of your sales pipeline',
    lastUpdated: 'November 29, 2024',
    readTime: 8,
    content: `
      <h2>Deal Stages Explained</h2>
      <p>Each stage represents a milestone in your sales process.</p>
      
      <h3>Stage 1: Discovery</h3>
      <p><strong>Goal:</strong> Understand the prospect's needs and challenges</p>
      <p><strong>Key Activities:</strong></p>
      <ul>
        <li>Initial conversation or demo</li>
        <li>Ask discovery questions</li>
        <li>Identify pain points</li>
        <li>Determine budget and timeline</li>
      </ul>
      <p><strong>Exit Criteria:</strong> Confirmed need and budget exists</p>
      
      <h3>Stage 2: Qualification</h3>
      <p><strong>Goal:</strong> Verify this is a good fit for both parties</p>
      <p><strong>Key Activities:</strong></p>
      <ul>
        <li>BANT qualification (Budget, Authority, Need, Timeline)</li>
        <li>Identify decision makers</li>
        <li>Understand buying process</li>
        <li>Assess competition</li>
      </ul>
      <p><strong>Exit Criteria:</strong> Confirmed fit, decision maker engaged</p>
      
      <h3>Stage 3: Proposal</h3>
      <p><strong>Goal:</strong> Present your solution and pricing</p>
      <p><strong>Key Activities:</strong></p>
      <ul>
        <li>Deliver formal proposal</li>
        <li>Present pricing options</li>
        <li>Address initial questions</li>
        <li>Set timeline for decision</li>
      </ul>
      <p><strong>Exit Criteria:</strong> Proposal accepted, ready to negotiate</p>
      
      <h3>Stage 4: Negotiation</h3>
      <p><strong>Goal:</strong> Finalize terms and get to yes</p>
      <p><strong>Key Activities:</strong></p>
      <ul>
        <li>Discuss terms and conditions</li>
        <li>Handle objections</li>
        <li>Adjust pricing if needed</li>
        <li>Prepare contract</li>
      </ul>
      <p><strong>Exit Criteria:</strong> Agreement on all terms</p>
      
      <h3>Stage 5: Closed Won</h3>
      <p><strong>Goal:</strong> Contract signed, deal won!</p>
      <p><strong>Key Activities:</strong></p>
      <ul>
        <li>Execute contract</li>
        <li>Celebrate the win</li>
        <li>Hand off to implementation</li>
        <li>Request referrals</li>
      </ul>
      
      <h3>Stage 6: Closed Lost</h3>
      <p><strong>Goal:</strong> Learn and maintain relationship</p>
      <p><strong>Key Activities:</strong></p>
      <ul>
        <li>Document why you lost</li>
        <li>Request feedback</li>
        <li>Set reminder to follow up later</li>
        <li>Stay connected on LinkedIn</li>
      </ul>
      
      <h3>Stage Progression Tips</h3>
      <ul>
        <li>Only move forward with buyer commitment</li>
        <li>Document what happened at each stage</li>
        <li>Set probability based on stage</li>
        <li>Don't skip stages</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Creating Deals', slug: 'creating-deals' },
      { title: 'Managing Your Pipeline', slug: 'pipeline-management' },
    ]
  },

  'revenue-forecasting': {
    title: 'Revenue Forecasting',
    description: 'Use your pipeline data to predict future revenue',
    lastUpdated: 'November 29, 2024',
    readTime: 10,
    content: `
      <h2>Revenue Forecasting</h2>
      <p>Accurate forecasting helps you plan for growth and hit your targets.</p>
      
      <h3>Forecasting Methods</h3>
      
      <h4>1. Pipeline-Based Forecasting</h4>
      <p>Multiply deal value by close probability:</p>
      <pre>Forecast = Σ (Deal Value × Probability)</pre>
      <p>Example: $100K deal at 50% = $50K forecasted</p>
      
      <h4>2. Stage-Based Forecasting</h4>
      <p>Assign probability by stage:</p>
      <ul>
        <li>Discovery: 10%</li>
        <li>Qualification: 25%</li>
        <li>Proposal: 50%</li>
        <li>Negotiation: 75%</li>
        <li>Closed Won: 100%</li>
      </ul>
      
      <h4>3. Historical Forecasting</h4>
      <p>Use past performance to predict future:</p>
      <ul>
        <li>Average monthly close rate</li>
        <li>Seasonal trends</li>
        <li>Win rate by source</li>
      </ul>
      
      <h3>Forecast Categories</h3>
      <ul>
        <li><strong>Commit:</strong> 90%+ likely to close this quarter</li>
        <li><strong>Best Case:</strong> 50-89% likely</li>
        <li><strong>Pipeline:</strong> All open opportunities</li>
      </ul>
      
      <h3>Improving Forecast Accuracy</h3>
      <ol>
        <li><strong>Update regularly:</strong> Review deals weekly</li>
        <li><strong>Be honest:</strong> Don't inflate probabilities</li>
        <li><strong>Use data:</strong> Base on historical win rates</li>
        <li><strong>Verify with buyers:</strong> Confirm timeline and budget</li>
        <li><strong>Track accuracy:</strong> Compare forecast to actual results</li>
      </ol>
      
      <h3>Red Flags in Forecasting</h3>
      <ul>
        <li>Deals stuck in same stage for 30+ days</li>
        <li>No recent activity or contact</li>
        <li>Buyer hasn't responded to follow-ups</li>
        <li>Timeline keeps slipping</li>
        <li>No access to decision maker</li>
      </ul>
      
      <h3>Using CRM Analytics</h3>
      <p>Your CRM provides forecasting tools:</p>
      <ul>
        <li>View forecast by month/quarter</li>
        <li>Compare forecast to quota</li>
        <li>See forecast by rep</li>
        <li>Track forecast vs. actual</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Managing Your Pipeline', slug: 'pipeline-management' },
      { title: 'Understanding Analytics', slug: 'analytics-guide' },
    ]
  },

  'call-transcripts': {
    title: 'Call Transcripts & Insights',
    description: 'How to use AI-generated call transcripts effectively',
    lastUpdated: 'November 29, 2024',
    readTime: 7,
    content: `
      <h2>Call Transcripts & Insights</h2>
      <p>Every call is automatically transcribed and analyzed by AI.</p>
      
      <h3>Accessing Transcripts</h3>
      <ol>
        <li>Go to the Calls page</li>
        <li>Click on any call to view details</li>
        <li>Scroll to see the full transcript</li>
      </ol>
      
      <h3>Transcript Features</h3>
      <ul>
        <li><strong>Timestamps:</strong> Jump to specific moments</li>
        <li><strong>Speaker labels:</strong> AI vs. Customer clearly marked</li>
        <li><strong>Highlights:</strong> Key moments automatically flagged</li>
        <li><strong>Search:</strong> Find specific keywords or topics</li>
      </ul>
      
      <h3>AI-Extracted Insights</h3>
      <p>Our AI automatically identifies:</p>
      <ul>
        <li><strong>Pain Points:</strong> Problems the customer mentioned</li>
        <li><strong>Buying Signals:</strong> Interest indicators</li>
        <li><strong>Objections:</strong> Concerns raised</li>
        <li><strong>Competitors:</strong> Other solutions mentioned</li>
        <li><strong>Next Steps:</strong> Commitments made</li>
        <li><strong>Budget Info:</strong> Pricing discussions</li>
      </ul>
      
      <h3>Using Transcripts for Follow-Up</h3>
      <ol>
        <li><strong>Review before calling back:</strong> Refresh your memory</li>
        <li><strong>Address objections:</strong> Prepare responses</li>
        <li><strong>Reference specifics:</strong> Show you were listening</li>
        <li><strong>Honor commitments:</strong> Do what you said you'd do</li>
      </ol>
      
      <h3>Coaching with Transcripts</h3>
      <p>Managers can use transcripts to:</p>
      <ul>
        <li>Review rep performance</li>
        <li>Identify training needs</li>
        <li>Share best practices</li>
        <li>Improve scripts</li>
      </ul>
      
      <h3>Privacy & Compliance</h3>
      <ul>
        <li>Calls are announced/disclosed</li>
        <li>Transcripts are encrypted</li>
        <li>Access is role-based</li>
        <li>Retention follows your policy</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Understanding AI Call Analytics', slug: 'call-analytics' },
      { title: 'Sentiment Analysis', slug: 'sentiment-analysis' },
    ]
  },

  'sentiment-analysis': {
    title: 'Sentiment Analysis',
    description: 'Understanding customer emotions through AI',
    lastUpdated: 'November 29, 2024',
    readTime: 6,
    content: `
      <h2>Sentiment Analysis</h2>
      <p>AI analyzes the emotional tone of every conversation.</p>
      
      <h3>What is Sentiment Analysis?</h3>
      <p>Sentiment analysis uses AI to detect emotions in speech:</p>
      <ul>
        <li><strong>Positive:</strong> Happy, excited, satisfied</li>
        <li><strong>Neutral:</strong> Informational, factual</li>
        <li><strong>Negative:</strong> Frustrated, concerned, angry</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our AI analyzes:</p>
      <ul>
        <li>Word choice and phrasing</li>
        <li>Tone of voice</li>
        <li>Speaking pace</li>
        <li>Interruptions</li>
        <li>Questions asked</li>
      </ul>
      
      <h3>Sentiment Over Time</h3>
      <p>View sentiment changes throughout the call:</p>
      <ul>
        <li>Green peaks = positive moments</li>
        <li>Red dips = concerns or frustrations</li>
        <li>Gray = neutral discussion</li>
      </ul>
      
      <h3>Key Patterns to Watch</h3>
      <ul>
        <li><strong>Starting negative, ending positive:</strong> You overcame objections</li>
        <li><strong>Starting positive, ending negative:</strong> Something went wrong</li>
        <li><strong>Consistently positive:</strong> Great fit, likely to close</li>
        <li><strong>Consistently negative:</strong> Not a good fit or timing</li>
      </ul>
      
      <h3>Using Sentiment for Follow-Up</h3>
      <ol>
        <li><strong>Address negative moments:</strong> Follow up on concerns</li>
        <li><strong>Build on positive moments:</strong> Reinforce what they liked</li>
        <li><strong>Adjust your approach:</strong> If sentiment declined, try different angle</li>
      </ol>
      
      <h3>Sentiment-Based Automation</h3>
      <p>Trigger actions based on sentiment:</p>
      <ul>
        <li>Alert manager if call ends negative</li>
        <li>Send satisfaction survey after positive calls</li>
        <li>Create follow-up task for neutral calls</li>
        <li>Prioritize positive-sentiment leads</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Understanding AI Call Analytics', slug: 'call-analytics' },
      { title: 'Call Transcripts & Insights', slug: 'call-transcripts' },
    ]
  },

  'phone-integration': {
    title: 'Connecting Your Phone System',
    description: 'Integrate your voice service with the CRM',
    lastUpdated: 'November 29, 2024',
    readTime: 8,
    content: `
      <h2>Connecting Your Phone System</h2>
      <p>Integrate your AI voice agent to automatically log and analyze calls.</p>
      
      <h3>Integration Benefits</h3>
      <ul>
        <li>Automatic call logging</li>
        <li>Real-time transcription</li>
        <li>AI-powered insights</li>
        <li>Contact auto-creation</li>
        <li>Deal updates</li>
      </ul>
      
      <h3>Setup Steps</h3>
      <ol>
        <li>Go to <strong>Integrations</strong> page</li>
        <li>Click <strong>"Connect Phone System"</strong></li>
        <li>Choose your provider</li>
        <li>Enter API credentials</li>
        <li>Configure webhook URL</li>
        <li>Test the connection</li>
      </ol>
      
      <h3>Webhook Configuration</h3>
      <p>Your webhook URL:</p>
      <pre>https://crm-swart-ten-11.vercel.app/api/webhooks/retell</pre>
      
      <p>Configure these events:</p>
      <ul>
        <li><code>call.started</code> - Call begins</li>
        <li><code>call.ended</code> - Call completes</li>
        <li><code>call.analyzed</code> - AI analysis ready</li>
      </ul>
      
      <h3>What Gets Synced</h3>
      <p>For each call, we capture:</p>
      <ul>
        <li>Phone number</li>
        <li>Duration</li>
        <li>Recording URL</li>
        <li>Transcript</li>
        <li>Sentiment score</li>
        <li>Key insights</li>
        <li>Cost</li>
      </ul>
      
      <h3>Troubleshooting</h3>
      <p><strong>Calls not appearing?</strong></p>
      <ul>
        <li>Verify webhook URL is correct</li>
        <li>Check API credentials</li>
        <li>Ensure events are enabled</li>
        <li>Review error logs</li>
      </ul>
      
      <p><strong>Transcripts missing?</strong></p>
      <ul>
        <li>Transcription may take 1-2 minutes</li>
        <li>Check call duration (too short = no transcript)</li>
        <li>Verify language settings</li>
      </ul>
      
      <h3>Advanced Features</h3>
      <ul>
        <li><strong>Call routing:</strong> Route to specific agents</li>
        <li><strong>IVR integration:</strong> Custom phone menus</li>
        <li><strong>Call recording:</strong> Automatic recording</li>
        <li><strong>Voicemail detection:</strong> Skip voicemails</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Understanding AI Call Analytics', slug: 'call-analytics' },
      { title: 'Available Integrations', slug: 'available-integrations' },
    ]
  },

  // Analytics & Reports articles
  'dashboard-overview': {
    title: 'Dashboard Overview',
    description: 'Understanding your CRM dashboard metrics',
    lastUpdated: 'November 29, 2024',
    readTime: 5,
    content: `
      <h2>Dashboard Overview</h2>
      <p>Your dashboard provides a real-time snapshot of your business performance.</p>
      
      <h3>Key Metrics</h3>
      <ul>
        <li><strong>Total Calls:</strong> All calls processed through your AI system</li>
        <li><strong>Contacts:</strong> Total contacts in your CRM</li>
        <li><strong>Active Deals:</strong> Open opportunities in your pipeline</li>
        <li><strong>Total Call Cost:</strong> Cumulative expense for all calls</li>
      </ul>
      
      <h3>Charts & Visualizations</h3>
      <ul>
        <li><strong>Call Volume:</strong> Trends over time</li>
        <li><strong>Sentiment Distribution:</strong> Positive vs negative calls</li>
        <li><strong>Revenue by Month:</strong> Closed deal value</li>
        <li><strong>Pipeline Funnel:</strong> Deals by stage</li>
      </ul>
      
      <h3>Quick Actions</h3>
      <p>From the dashboard, you can quickly:</p>
      <ul>
        <li>Add a new contact</li>
        <li>Create a deal</li>
        <li>View recent calls</li>
        <li>Check cost savings</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Understanding Analytics', slug: 'analytics-guide' },
    ]
  },

  'analytics-guide': {
    title: 'Understanding Analytics',
    description: 'Make data-driven decisions with CRM analytics',
    lastUpdated: 'November 29, 2024',
    readTime: 9,
    content: `
      <h2>Understanding Analytics</h2>
      <p>Use analytics to identify trends, optimize performance, and grow revenue.</p>
      
      <h3>Available Reports</h3>
      <ul>
        <li><strong>Revenue Analytics:</strong> Track closed deals and revenue trends</li>
        <li><strong>Pipeline Analytics:</strong> Visualize deal flow and conversion rates</li>
        <li><strong>Call Analytics:</strong> Analyze call volume, duration, and sentiment</li>
        <li><strong>Top Performers:</strong> See which reps are crushing it</li>
        <li><strong>Cost Analysis:</strong> Monitor AI call costs vs traditional methods</li>
      </ul>
      
      <h3>Key Metrics to Track</h3>
      <ul>
        <li>Win rate by stage</li>
        <li>Average deal size</li>
        <li>Sales cycle length</li>
        <li>Lead response time</li>
        <li>Call-to-deal conversion</li>
      </ul>
      
      <h3>Using Filters</h3>
      <p>Refine your analysis by:</p>
      <ul>
        <li>Date range</li>
        <li>Sales rep</li>
        <li>Deal stage</li>
        <li>Lead source</li>
        <li>Industry</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Dashboard Overview', slug: 'dashboard-overview' },
      { title: 'Custom Reports', slug: 'custom-reports' },
    ]
  },

  'custom-reports': {
    title: 'Custom Reports',
    description: 'Create reports tailored to your business needs',
    lastUpdated: 'November 29, 2024',
    readTime: 7,
    content: `
      <h2>Custom Reports</h2>
      <p>Build custom reports to track the metrics that matter most to you.</p>
      
      <h3>Creating a Custom Report</h3>
      <ol>
        <li>Go to Analytics page</li>
        <li>Click "Create Custom Report"</li>
        <li>Choose data source (Contacts, Deals, Calls, etc.)</li>
        <li>Select fields to include</li>
        <li>Add filters</li>
        <li>Choose visualization type</li>
        <li>Save and name your report</li>
      </ol>
      
      <h3>Report Types</h3>
      <ul>
        <li><strong>Table Reports:</strong> Detailed data in rows and columns</li>
        <li><strong>Chart Reports:</strong> Visual representations (bar, line, pie)</li>
        <li><strong>Summary Reports:</strong> High-level KPIs</li>
        <li><strong>Trend Reports:</strong> Changes over time</li>
      </ul>
      
      <h3>Scheduling Reports</h3>
      <p>Automate report delivery:</p>
      <ul>
        <li>Daily, weekly, or monthly schedule</li>
        <li>Email to team members</li>
        <li>Export as PDF or CSV</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Understanding Analytics', slug: 'analytics-guide' },
      { title: 'Exporting Data', slug: 'exporting-data' },
    ]
  },

  'exporting-data': {
    title: 'Exporting Data',
    description: 'Export your CRM data for external analysis',
    lastUpdated: 'November 29, 2024',
    readTime: 4,
    content: `
      <h2>Exporting Data</h2>
      <p>Export your data to CSV for use in spreadsheets or other tools.</p>
      
      <h3>What You Can Export</h3>
      <ul>
        <li>Contacts</li>
        <li>Deals</li>
        <li>Tasks</li>
        <li>Calls</li>
        <li>Analytics reports</li>
      </ul>
      
      <h3>How to Export</h3>
      <ol>
        <li>Navigate to the page you want to export (e.g., Contacts)</li>
        <li>Apply any filters you want</li>
        <li>Click "Export" button</li>
        <li>Choose format (CSV recommended)</li>
        <li>Download file</li>
      </ol>
      
      <h3>Export Tips</h3>
      <ul>
        <li>Filter before exporting to get only the data you need</li>
        <li>Exports are limited to 10,000 records at a time</li>
        <li>Large exports may take a few minutes</li>
        <li>Files are automatically deleted after 24 hours</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Custom Reports', slug: 'custom-reports' },
    ]
  },

  // Email & Automation articles
  'email-templates': {
    title: 'Creating Email Templates',
    description: 'Build reusable email templates for your campaigns',
    lastUpdated: 'November 29, 2024',
    readTime: 6,
    content: `
      <h2>Creating Email Templates</h2>
      <p>Save time with pre-written, personalized email templates.</p>
      
      <h3>Creating a Template</h3>
      <ol>
        <li>Go to Email page</li>
        <li>Click "New Template"</li>
        <li>Enter template name</li>
        <li>Write subject line</li>
        <li>Compose email body</li>
        <li>Add personalization variables</li>
        <li>Save template</li>
      </ol>
      
      <h3>Personalization Variables</h3>
      <p>Use these variables to personalize emails:</p>
      <ul>
        <li><code>{{firstName}}</code> - Contact's first name</li>
        <li><code>{{lastName}}</code> - Contact's last name</li>
        <li><code>{{company}}</code> - Company name</li>
        <li><code>{{jobTitle}}</code> - Job title</li>
      </ul>
      
      <h3>Template Best Practices</h3>
      <ul>
        <li>Keep subject lines under 50 characters</li>
        <li>Personalize the first line</li>
        <li>Include clear call-to-action</li>
        <li>Keep it concise (under 200 words)</li>
        <li>Test before sending to large lists</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Email Automation', slug: 'email-automation' },
      { title: 'Personalization Variables', slug: 'email-variables' },
    ]
  },

  'email-automation': {
    title: 'Email Automation',
    description: 'Set up automated email campaigns',
    lastUpdated: 'November 29, 2024',
    readTime: 8,
    content: `
      <h2>Email Automation</h2>
      <p>Automate your email outreach to nurture leads on autopilot.</p>
      
      <h3>Types of Automation</h3>
      <ul>
        <li><strong>Welcome Series:</strong> Onboard new contacts</li>
        <li><strong>Nurture Campaigns:</strong> Educate prospects over time</li>
        <li><strong>Re-engagement:</strong> Win back inactive contacts</li>
        <li><strong>Follow-up Sequences:</strong> After demos or meetings</li>
      </ul>
      
      <h3>Setting Up Automation</h3>
      <ol>
        <li>Define your goal</li>
        <li>Choose trigger (e.g., "Contact created")</li>
        <li>Add email steps</li>
        <li>Set delays between emails</li>
        <li>Add conditions (if/then logic)</li>
        <li>Activate automation</li>
      </ol>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Start with 3-5 emails max</li>
        <li>Space emails 3-7 days apart</li>
        <li>Provide value in every email</li>
        <li>Include unsubscribe link</li>
        <li>Monitor open and click rates</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Creating Email Templates', slug: 'email-templates' },
    ]
  },

  'email-variables': {
    title: 'Personalization Variables',
    description: 'Use dynamic variables to personalize emails at scale',
    lastUpdated: 'November 29, 2024',
    readTime: 5,
    content: `
      <h2>Personalization Variables</h2>
      <p>Make every email feel personal with dynamic variables.</p>
      
      <h3>Available Variables</h3>
      <ul>
        <li><code>{{firstName}}</code></li>
        <li><code>{{lastName}}</code></li>
        <li><code>{{email}}</code></li>
        <li><code>{{company}}</code></li>
        <li><code>{{jobTitle}}</code></li>
        <li><code>{{phone}}</code></li>
      </ul>
      
      <h3>Using Variables</h3>
      <p>Simply type the variable name in double curly braces:</p>
      <pre>Hi {{firstName}},

I noticed {{company}} is in the {{industry}} space...</pre>
      
      <h3>Fallback Values</h3>
      <p>Provide defaults if data is missing:</p>
      <pre>Hi {{firstName|there}},</pre>
      <p>If firstName is empty, it will say "Hi there,"</p>
    `,
    relatedArticles: [
      { title: 'Creating Email Templates', slug: 'email-templates' },
    ]
  },

  // Tasks & Productivity articles
  'creating-tasks': {
    title: 'Creating Tasks',
    description: 'Stay organized with task management',
    lastUpdated: 'November 29, 2024',
    readTime: 5,
    content: `
      <h2>Creating Tasks</h2>
      <p>Never miss a follow-up with task management.</p>
      
      <h3>Creating a Task</h3>
      <ol>
        <li>Go to Tasks page</li>
        <li>Click "Create Task"</li>
        <li>Enter task title</li>
        <li>Set due date</li>
        <li>Choose priority</li>
        <li>Link to contact or deal (optional)</li>
        <li>Save</li>
      </ol>
      
      <h3>Task Types</h3>
      <ul>
        <li><strong>Call:</strong> Schedule a phone call</li>
        <li><strong>Email:</strong> Send a follow-up email</li>
        <li><strong>Meeting:</strong> In-person or video meeting</li>
        <li><strong>To-Do:</strong> General task</li>
      </ul>
      
      <h3>Priority Levels</h3>
      <ul>
        <li><strong>High:</strong> Do today</li>
        <li><strong>Medium:</strong> Do this week</li>
        <li><strong>Low:</strong> Do when you can</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Task Management Best Practices', slug: 'task-best-practices' },
    ]
  },

  'task-best-practices': {
    title: 'Task Management Best Practices',
    description: 'Get the most out of task management',
    lastUpdated: 'November 29, 2024',
    readTime: 6,
    content: `
      <h2>Task Management Best Practices</h2>
      <p>Effective task management keeps deals moving forward.</p>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Create tasks immediately after calls or meetings</li>
        <li>Set specific due dates, not just "someday"</li>
        <li>Link tasks to contacts and deals</li>
        <li>Review tasks daily</li>
        <li>Complete or reschedule overdue tasks</li>
      </ul>
      
      <h3>Task Organization</h3>
      <ul>
        <li>Use priority levels consistently</li>
        <li>Group related tasks</li>
        <li>Set reminders for important tasks</li>
        <li>Archive completed tasks</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Creating Tasks', slug: 'creating-tasks' },
    ]
  },

  'task-reminders': {
    title: 'Setting Reminders',
    description: 'Get notified about important tasks',
    lastUpdated: 'November 29, 2024',
    readTime: 4,
    content: `
      <h2>Setting Reminders</h2>
      <p>Never forget an important task with reminders.</p>
      
      <h3>Setting a Reminder</h3>
      <ol>
        <li>Create or edit a task</li>
        <li>Click "Add Reminder"</li>
        <li>Choose when to be reminded</li>
        <li>Save</li>
      </ol>
      
      <h3>Reminder Options</h3>
      <ul>
        <li>15 minutes before</li>
        <li>1 hour before</li>
        <li>1 day before</li>
        <li>Custom time</li>
      </ul>
      
      <h3>Notification Methods</h3>
      <ul>
        <li>In-app notification</li>
        <li>Email notification</li>
        <li>Browser push notification</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Creating Tasks', slug: 'creating-tasks' },
    ]
  },

  // Integrations articles
  'available-integrations': {
    title: 'Available Integrations',
    description: 'Connect your CRM with other tools',
    lastUpdated: 'November 29, 2024',
    readTime: 7,
    content: `
      <h2>Available Integrations</h2>
      <p>Connect your CRM with the tools you already use.</p>
      
      <h3>Current Integrations</h3>
      <ul>
        <li><strong>Google Calendar:</strong> Sync meetings and calls</li>
        <li><strong>AI Voice Agent:</strong> Automatic call logging and analysis</li>
        <li><strong>Email:</strong> Send campaigns and track engagement</li>
      </ul>
      
      <h3>Coming Soon</h3>
      <ul>
        <li>Slack - Team notifications</li>
        <li>Zapier - Connect 5,000+ apps</li>
        <li>HubSpot - Data sync</li>
        <li>Salesforce - Migration tools</li>
      </ul>
      
      <h3>Integration Benefits</h3>
      <ul>
        <li>Eliminate manual data entry</li>
        <li>Keep data in sync</li>
        <li>Automate workflows</li>
        <li>Centralize information</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Connecting Google Calendar', slug: 'google-calendar' },
      { title: 'AI Voice Agent Setup', slug: 'voice-agent-setup' },
    ]
  },

  'google-calendar': {
    title: 'Connecting Google Calendar',
    description: 'Sync your calendar with the CRM',
    lastUpdated: 'November 29, 2024',
    readTime: 5,
    content: `
      <h2>Connecting Google Calendar</h2>
      <p>Sync meetings and calls between your CRM and Google Calendar.</p>
      
      <h3>Setup Steps</h3>
      <ol>
        <li>Go to Integrations page</li>
        <li>Click "Connect Google Calendar"</li>
        <li>Sign in with Google</li>
        <li>Grant permissions</li>
        <li>Choose calendars to sync</li>
      </ol>
      
      <h3>What Gets Synced</h3>
      <ul>
        <li>Meetings created in CRM appear in Google Calendar</li>
        <li>Calendar events sync to CRM</li>
        <li>Updates sync both ways</li>
        <li>Attendees are matched to contacts</li>
      </ul>
      
      <h3>Benefits</h3>
      <ul>
        <li>See all meetings in one place</li>
        <li>Automatic call logging</li>
        <li>Meeting reminders</li>
        <li>No double-booking</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Available Integrations', slug: 'available-integrations' },
    ]
  },

  'voice-agent-setup': {
    title: 'AI Voice Agent Setup',
    description: 'Configure your AI voice agent integration',
    lastUpdated: 'November 29, 2024',
    readTime: 10,
    content: `
      <h2>AI Voice Agent Setup</h2>
      <p>Connect your AI voice agent to automatically capture call data.</p>
      
      <h3>Prerequisites</h3>
      <ul>
        <li>Active AI voice agent account</li>
        <li>API key from your provider</li>
        <li>Webhook access</li>
      </ul>
      
      <h3>Setup Process</h3>
      <ol>
        <li>Go to Integrations</li>
        <li>Click "Connect AI Voice Agent"</li>
        <li>Enter API credentials</li>
        <li>Configure webhook URL</li>
        <li>Select data to sync</li>
        <li>Test connection</li>
        <li>Activate</li>
      </ol>
      
      <h3>Data Synced</h3>
      <ul>
        <li>Call recordings</li>
        <li>Transcripts</li>
        <li>Sentiment analysis</li>
        <li>Key insights</li>
        <li>Contact information</li>
        <li>Call costs</li>
      </ul>
      
      <h3>Automation Options</h3>
      <ul>
        <li>Auto-create contacts from calls</li>
        <li>Update lead scores based on sentiment</li>
        <li>Create follow-up tasks</li>
        <li>Trigger email sequences</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Connecting Your Phone System', slug: 'phone-integration' },
      { title: 'Webhook Configuration', slug: 'webhook-config' },
    ]
  },

  'webhook-config': {
    title: 'Webhook Configuration',
    description: 'Set up webhooks for real-time data sync',
    lastUpdated: 'November 29, 2024',
    readTime: 8,
    content: `
      <h2>Webhook Configuration</h2>
      <p>Webhooks enable real-time data synchronization.</p>
      
      <h3>What are Webhooks?</h3>
      <p>Webhooks send data to your CRM instantly when events occur in other systems.</p>
      
      <h3>Setting Up Webhooks</h3>
      <ol>
        <li>Get your webhook URL from Integrations page</li>
        <li>Add URL to your external system</li>
        <li>Choose which events to send</li>
        <li>Test with sample data</li>
        <li>Activate</li>
      </ol>
      
      <h3>Supported Events</h3>
      <ul>
        <li>Call started/ended</li>
        <li>Call analyzed</li>
        <li>Contact created/updated</li>
        <li>Deal stage changed</li>
        <li>Task completed</li>
      </ul>
      
      <h3>Webhook Security</h3>
      <ul>
        <li>All webhooks use HTTPS</li>
        <li>Signature verification available</li>
        <li>IP whitelisting supported</li>
        <li>Failed deliveries are retried</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'AI Voice Agent Setup', slug: 'voice-agent-setup' },
    ]
  },

  // Settings & Account articles
  'account-settings': {
    title: 'Account Settings',
    description: 'Manage your account preferences',
    lastUpdated: 'November 29, 2024',
    readTime: 5,
    content: `
      <h2>Account Settings</h2>
      <p>Customize your CRM experience.</p>
      
      <h3>Profile Settings</h3>
      <ul>
        <li>Update name and email</li>
        <li>Change password</li>
        <li>Upload profile photo</li>
        <li>Set timezone</li>
      </ul>
      
      <h3>Notification Preferences</h3>
      <ul>
        <li>Email notifications</li>
        <li>In-app alerts</li>
        <li>Task reminders</li>
        <li>Deal updates</li>
      </ul>
      
      <h3>Display Preferences</h3>
      <ul>
        <li>Dark mode</li>
        <li>Date format</li>
        <li>Number format</li>
        <li>Default views</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Security & Privacy', slug: 'security-privacy' },
    ]
  },

  'team-management': {
    title: 'Team Management',
    description: 'Add and manage team members',
    lastUpdated: 'November 29, 2024',
    readTime: 7,
    content: `
      <h2>Team Management</h2>
      <p>Collaborate effectively with your team.</p>
      
      <h3>Adding Team Members</h3>
      <ol>
        <li>Go to Settings → Team</li>
        <li>Click "Invite Member"</li>
        <li>Enter email address</li>
        <li>Choose role</li>
        <li>Send invitation</li>
      </ol>
      
      <h3>User Roles</h3>
      <ul>
        <li><strong>Admin:</strong> Full access, can manage team</li>
        <li><strong>User:</strong> Standard access, can't manage team</li>
        <li><strong>Viewer:</strong> Read-only access</li>
      </ul>
      
      <h3>Permissions</h3>
      <ul>
        <li>View contacts and deals</li>
        <li>Create and edit records</li>
        <li>Delete records</li>
        <li>Access reports</li>
        <li>Manage integrations</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Account Settings', slug: 'account-settings' },
    ]
  },

  'security-privacy': {
    title: 'Security & Privacy',
    description: 'Keep your data safe and secure',
    lastUpdated: 'November 29, 2024',
    readTime: 6,
    content: `
      <h2>Security & Privacy</h2>
      <p>Your data security is our top priority.</p>
      
      <h3>Security Features</h3>
      <ul>
        <li>256-bit encryption</li>
        <li>Two-factor authentication</li>
        <li>Role-based access control</li>
        <li>Audit logs</li>
        <li>Automatic backups</li>
      </ul>
      
      <h3>Data Privacy</h3>
      <ul>
        <li>GDPR compliant</li>
        <li>CCPA compliant</li>
        <li>SOC 2 certified</li>
        <li>Regular security audits</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Use strong passwords</li>
        <li>Enable 2FA</li>
        <li>Review access logs</li>
        <li>Limit user permissions</li>
        <li>Report suspicious activity</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Account Settings', slug: 'account-settings' },
    ]
  },

  'billing': {
    title: 'Billing & Subscription',
    description: 'Manage your subscription and billing',
    lastUpdated: 'November 29, 2024',
    readTime: 5,
    content: `
      <h2>Billing & Subscription</h2>
      <p>Manage your plan and payment information.</p>
      
      <h3>Current Plan</h3>
      <p>View your current subscription details:</p>
      <ul>
        <li>Plan name and features</li>
        <li>Monthly cost</li>
        <li>Renewal date</li>
        <li>Usage limits</li>
      </ul>
      
      <h3>Upgrading Your Plan</h3>
      <ol>
        <li>Go to Settings → Billing</li>
        <li>Click "Upgrade Plan"</li>
        <li>Choose new plan</li>
        <li>Confirm upgrade</li>
      </ol>
      
      <h3>Payment Methods</h3>
      <ul>
        <li>Credit/debit card</li>
        <li>ACH bank transfer</li>
        <li>Wire transfer (Enterprise)</li>
      </ul>
      
      <h3>Invoices</h3>
      <ul>
        <li>View past invoices</li>
        <li>Download as PDF</li>
        <li>Update billing email</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Account Settings', slug: 'account-settings' },
    ]
  },

  'account-setup': {
    title: 'Setting Up Your Account',
    description: 'Complete your account setup',
    lastUpdated: 'November 29, 2024',
    readTime: 8,
    content: `
      <h2>Setting Up Your Account</h2>
      <p>Get your CRM configured for success.</p>
      
      <h3>Initial Setup Checklist</h3>
      <ol>
        <li>Complete your profile</li>
        <li>Set up your company information</li>
        <li>Customize pipeline stages</li>
        <li>Import existing contacts</li>
        <li>Connect integrations</li>
        <li>Create email templates</li>
        <li>Invite team members</li>
      </ol>
      
      <h3>Company Settings</h3>
      <ul>
        <li>Company name and logo</li>
        <li>Industry and size</li>
        <li>Timezone and currency</li>
        <li>Business hours</li>
      </ul>
      
      <h3>Customization</h3>
      <ul>
        <li>Custom fields</li>
        <li>Pipeline stages</li>
        <li>Email templates</li>
        <li>Tags and categories</li>
      </ul>
    `,
    relatedArticles: [
      { title: 'Welcome to Your CRM', slug: 'welcome' },
      { title: 'Quick Start Guide', slug: 'quick-start' },
    ]
  },
}

