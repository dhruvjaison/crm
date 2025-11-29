import { 
  CallDirection, 
  CallStatus, 
  SentimentType, 
  ContactStatus,
  DealStatus,
  TaskStatus,
  TaskPriority 
} from '@prisma/client'

// Mock call transcripts
const mockTranscripts = [
  {
    transcript: `Agent: Good morning! Thank you for calling ABC Medical. This is Sarah, your AI assistant. How can I help you today?
    
Customer: Hi Sarah, I'd like to schedule an appointment for a check-up.

Agent: I'd be happy to help you schedule that appointment. May I have your name and date of birth please?

Customer: Yes, it's John Smith, born March 15th, 1985.

Agent: Thank you, Mr. Smith. I see you're an existing patient. We have availability this Thursday at 2 PM or Friday at 10 AM. Which works better for you?

Customer: Thursday at 2 PM would be perfect.

Agent: Excellent! I've scheduled your check-up for this Thursday, March 21st at 2:00 PM with Dr. Johnson. You'll receive a confirmation text shortly. Is there anything else I can help you with?

Customer: No, that's all. Thank you!

Agent: You're welcome! We look forward to seeing you Thursday. Have a great day!`,
    sentiment: SentimentType.POSITIVE,
    sentimentScore: 0.85,
    summary: 'Customer successfully scheduled check-up appointment for Thursday at 2 PM. Positive interaction, all needs met.',
    detectedIntent: 'schedule_appointment',
    keywords: ['appointment', 'check-up', 'schedule', 'Thursday'],
    followUpNeeded: false,
  },
  {
    transcript: `Agent: Hello! Thanks for calling XYZ Legal Services. I'm Alex, how may I assist you today?

Customer: Hi, I received your call earlier but I'm not sure what it was about.

Agent: Of course, let me check. I see we reached out regarding your consultation request for estate planning. Is this still something you're interested in discussing?

Customer: Oh yes! I completely forgot about that. What's the next step?

Agent: Great! I can connect you with one of our estate planning attorneys. We have a free 30-minute consultation available. Would next Tuesday at 3 PM work for you?

Customer: Actually, I need to check my calendar first. Can I call back?

Agent: Absolutely! Take your time. You can reach us at this number anytime, or schedule directly through our website. Is there anything else I can help with right now?

Customer: No, that's it. Thank you!

Agent: Perfect! We look forward to hearing from you soon. Have a wonderful day!`,
    sentiment: SentimentType.NEUTRAL,
    sentimentScore: 0.3,
    summary: 'Customer inquired about estate planning consultation. Needs to check calendar before confirming. Will call back.',
    detectedIntent: 'consultation_inquiry',
    keywords: ['consultation', 'estate planning', 'attorney', 'calendar'],
    followUpNeeded: true,
    followUpNotes: 'Customer needs to check calendar. Follow up in 48 hours if no response.',
  },
  {
    transcript: `Agent: Good afternoon, this is Real Estate Pro calling. Am I speaking with Mrs. Anderson?

Customer: Yes, this is she.

Agent: Hi Mrs. Anderson! I'm calling regarding the property inquiry you submitted on our website for the downtown condo listing. Do you have a few minutes to discuss?

Customer: I'm actually not interested anymore. I already found something.

Agent: I understand! Congratulations on finding a place. Just for future reference, are you still looking to invest in real estate, or was this your primary residence?

Customer: It was for my daughter, and we're all set now. Please remove me from your list.

Agent: Absolutely, I'll remove you from our contact list right away. I apologize for any inconvenience. Have a great day!

Customer: Thank you, you too.`,
    sentiment: SentimentType.NEGATIVE,
    sentimentScore: -0.4,
    summary: 'Customer no longer interested, already found property. Requested removal from contact list.',
    detectedIntent: 'opt_out',
    keywords: ['not interested', 'remove', 'found something', 'unsubscribe'],
    followUpNeeded: false,
  },
  {
    transcript: `Agent: Hello! Thanks for calling Tech Solutions Support. This is Jamie, your AI assistant. How can I help you today?

Customer: Hi, I'm calling about your premium software package. I saw the demo and I'm really impressed.

Agent: That's wonderful to hear! I'd love to help you get started. Can you tell me a bit about your business and what you're looking to achieve?

Customer: We're a growing marketing agency with about 25 employees. We need better project management and client communication tools.

Agent: Perfect! Our premium package is ideal for agencies your size. It includes unlimited projects, client portals, and team collaboration features. The investment is $299 per month for up to 30 users.

Customer: That sounds reasonable. What's the implementation process like?

Agent: We make it very easy! You'll get dedicated onboarding support, we can migrate your existing data, and most clients are up and running within a week. We also include free training sessions for your team.

Customer: This sounds great. Can someone from sales call me to finalize the details?

Agent: Absolutely! I'll have one of our account executives reach out within the next hour. Can I confirm your best contact number?

Customer: Yes, it's 555-0123.

Agent: Perfect! They'll call you at 555-0123 shortly. Is there anything else I can help with right now?

Customer: No, that's all. Thanks!

Agent: Wonderful! We're excited to work with you. Have a great day!`,
    sentiment: SentimentType.POSITIVE,
    sentimentScore: 0.92,
    summary: 'Hot lead for premium package. Customer is very interested and ready to buy. Expects call back from sales within the hour.',
    detectedIntent: 'purchase_intent',
    keywords: ['premium package', 'interested', 'impressed', 'sales call', 'ready to buy'],
    followUpNeeded: true,
    followUpNotes: 'HIGH PRIORITY: Sales team needs to call within 1 hour. Customer is ready to purchase premium package at $299/month.',
  },
]

const firstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Emily', 'Robert', 'Jessica', 'William', 'Amanda', 'Richard', 'Jennifer', 'Thomas']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson']
const companies = ['TechCorp', 'HealthPlus', 'Legal Solutions', 'Real Estate Pro', 'Marketing Masters', 'Finance Group', 'Retail Innovations', 'Manufacturing Co', 'Consulting Partners', 'Education First']
const jobTitles = ['CEO', 'Director', 'Manager', 'VP of Sales', 'Operations Manager', 'HR Director', 'Marketing Lead', 'Product Manager', 'Business Owner', 'Executive Assistant']

export function generateRandomContact() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const company = companies[Math.floor(Math.random() * companies.length)]
  const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)]
  
  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    company,
    jobTitle,
    status: Object.values(ContactStatus)[Math.floor(Math.random() * Object.values(ContactStatus).length)],
    leadScore: Math.floor(Math.random() * 100),
    tags: ['demo', 'web'],
  }
}

export function generateRandomCall(contactId: string, tenantId: string) {
  const mockData = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
  const durationMinutes = Math.floor(Math.random() * 15) + 2 // 2-17 minutes
  const durationSeconds = durationMinutes * 60
  const costPerMinute = 0.05
  const totalCost = durationMinutes * costPerMinute
  
  const startedAt = new Date()
  startedAt.setDate(startedAt.getDate() - Math.floor(Math.random() * 30)) // Random date in last 30 days
  startedAt.setHours(Math.floor(Math.random() * 9) + 9) // 9 AM to 5 PM
  
  const endedAt = new Date(startedAt)
  endedAt.setSeconds(endedAt.getSeconds() + durationSeconds)
  
  return {
    direction: Math.random() > 0.5 ? CallDirection.INBOUND : CallDirection.OUTBOUND,
    status: CallStatus.COMPLETED,
    duration: durationSeconds,
    contactId,
    phoneNumber: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    retellCallId: `call_${Math.random().toString(36).substring(7)}`,
    agentId: `agent_${Math.floor(Math.random() * 5) + 1}`,
    transcript: mockData.transcript,
    summary: mockData.summary,
    sentiment: mockData.sentiment,
    sentimentScore: mockData.sentimentScore,
    keyMoments: [
      { timestamp: '00:45', label: 'Intent Detected', description: mockData.detectedIntent },
      { timestamp: `${Math.floor(durationMinutes / 2)}:30`, label: 'Key Discussion', description: 'Main topic discussed' },
    ],
    detectedIntent: mockData.detectedIntent,
    topics: mockData.keywords.slice(0, 3),
    keywords: mockData.keywords,
    followUpNeeded: mockData.followUpNeeded,
    followUpNotes: mockData.followUpNotes,
    costPerMinute,
    totalCost,
    tenantId,
    startedAt,
    endedAt,
  }
}

export function generateRandomDeal(contactId: string, tenantId: string, stageId: string) {
  const dealValues = [5000, 10000, 15000, 25000, 50000, 75000, 100000, 250000]
  const dealTitles = [
    'Premium Package Deal',
    'Enterprise Solution',
    'Annual Contract',
    'Consulting Services',
    'Software License',
    'Professional Services',
    'Implementation Project',
  ]
  
  return {
    title: dealTitles[Math.floor(Math.random() * dealTitles.length)],
    value: dealValues[Math.floor(Math.random() * dealValues.length)],
    currency: 'USD',
    status: DealStatus.OPEN,
    stageId,
    contactId,
    expectedCloseDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within 90 days
    tenantId,
  }
}

export function generateRandomTask(contactId: string, tenantId: string, assignedToId?: string) {
  const taskTitles = [
    'Follow up on call',
    'Send proposal',
    'Schedule demo',
    'Review contract',
    'Prepare presentation',
    'Send thank you email',
    'Update CRM notes',
    'Check in with customer',
  ]
  
  return {
    title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
    description: 'Auto-generated task from call intelligence',
    priority: Object.values(TaskPriority)[Math.floor(Math.random() * Object.values(TaskPriority).length)],
    status: TaskStatus.TODO,
    contactId,
    assignedToId,
    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within 14 days
    tenantId,
  }
}

// Calculate cost savings compared to traditional call center
export function calculateCostSavings(callCount: number, avgDurationSeconds: number) {
  const avgDurationMinutes = avgDurationSeconds / 60
  
    // Modern voice solution costs
    const modernCostPerMinute = 0.05
    const modernTotalCost = callCount * avgDurationMinutes * modernCostPerMinute
  
  // Traditional call center costs (industry average: $1.00-$1.50 per minute)
  const traditionalCostPerMinute = 1.25
  const traditionalTotalCost = callCount * avgDurationMinutes * traditionalCostPerMinute
  
    const savings = traditionalTotalCost - modernTotalCost
    // Handle division by zero - if no calls, show 0% instead of NaN
    const savingsPercentage = traditionalTotalCost > 0 
      ? (savings / traditionalTotalCost) * 100 
      : 0

    return {
      retellTotalCost: modernTotalCost, // Keep field name for compatibility
      traditionalTotalCost,
      savings,
      savingsPercentage,
      costPerCall: avgDurationMinutes * modernCostPerMinute,
      traditionalCostPerCall: avgDurationMinutes * traditionalCostPerMinute,
    }
}

