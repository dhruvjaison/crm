/**
 * Retell AI (Arnie AI) Webhook Handler
 * 
 * This endpoint receives webhooks from Retell AI for:
 * - call.started
 * - call.ended  
 * - call.analyzed
 * 
 * Documentation: https://docs.retellai.com/api-references/webhook
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncCallFromRetell } from '@/lib/retell-client'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

/**
 * Verify webhook signature from Retell AI
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}

/**
 * Retell AI Webhook Types
 */
interface RetellWebhookBase {
  event: string
  call: {
    call_id: string
    agent_id: string
    call_type: 'inbound' | 'outbound' | 'web_call'
    from_number?: string
    to_number?: string
    direction: 'inbound' | 'outbound'
    call_status: 'registered' | 'ongoing' | 'ended' | 'error'
    start_timestamp: number
    end_timestamp?: number
    metadata?: Record<string, unknown>
  }
}

interface CallStartedWebhook extends RetellWebhookBase {
  event: 'call_started'
}

interface CallEndedWebhook extends RetellWebhookBase {
  event: 'call_ended'
  call: RetellWebhookBase['call'] & {
    end_timestamp: number
    transcript: string
    recording_url?: string
    public_log_url?: string
    call_analysis?: {
      call_summary?: string
      in_voicemail?: boolean
      user_sentiment?: 'Negative' | 'Positive' | 'Neutral' | 'Unknown'
      call_successful?: boolean
    }
  }
}

interface CallAnalyzedWebhook {
  event: 'call_analyzed'
  call: {
    call_id: string
    call_analysis: {
      call_summary: string
      in_voicemail: boolean
      user_sentiment: 'Negative' | 'Positive' | 'Neutral' | 'Unknown'
      call_successful: boolean
      custom_analysis_data?: Record<string, unknown>
    }
  }
}

type RetellWebhook = CallStartedWebhook | CallEndedWebhook | CallAnalyzedWebhook

/**
 * POST /api/webhooks/retell
 * 
 * Receives webhooks from Retell AI
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const webhook: RetellWebhook = JSON.parse(payload)
    
    // Verify webhook signature (in production)
    if (process.env.RETELL_WEBHOOK_SECRET) {
      const signature = req.headers.get('x-retell-signature')
      
      if (!signature) {
        console.error('Missing webhook signature')
        return NextResponse.json(
          { error: 'Missing signature' },
          { status: 401 }
        )
      }
      
      const isValid = verifyWebhookSignature(
        payload,
        signature,
        process.env.RETELL_WEBHOOK_SECRET
      )
      
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }
    
    console.log(`[Retell Webhook] Event: ${webhook.event}, Call ID: ${webhook.call.call_id}`)
    
    // Determine tenant from metadata or agent_id
    const metadata = 'metadata' in webhook.call ? webhook.call.metadata : undefined
    const tenantId = (metadata?.tenant_id as string) || undefined
    
    if (!tenantId) {
      console.warn('No tenant_id in webhook metadata, cannot process')
      // Still return 200 to prevent Retell from retrying
      return NextResponse.json({ 
        received: true,
        warning: 'No tenant_id provided' 
      })
    }
    
    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    })
    
    if (!tenant) {
      console.error(`Tenant not found: ${tenantId}`)
      return NextResponse.json({ 
        received: true,
        warning: 'Tenant not found' 
      })
    }
    
    // Handle different webhook events
    switch (webhook.event) {
      case 'call_started':
        await handleCallStarted(webhook, tenantId)
        break
        
      case 'call_ended':
        await handleCallEnded(webhook, tenantId)
        break
        
      case 'call_analyzed':
        await handleCallAnalyzed(webhook)
        break
        
      default:
        console.log(`Unhandled webhook event: ${(webhook as RetellWebhook).event}`)
    }
    
    // Log webhook for debugging/monitoring
    const agentId = 'agent_id' in webhook.call ? webhook.call.agent_id : 'unknown'
    await prisma.activity.create({
      data: {
        tenantId,
        userId: 'system',
        type: 'CALL',
        description: `Received ${webhook.event} for call ${webhook.call.call_id}`,
        metadata: {
          event: webhook.event,
          callId: webhook.call.call_id,
          agentId,
        },
      },
    })
    
    // Always return 200 to prevent Retell from retrying
    return NextResponse.json({ 
      received: true,
      event: webhook.event,
      callId: webhook.call.call_id,
    })
    
  } catch (error) {
    console.error('[Retell Webhook] Error:', error)
    
    // Return 200 even on error to prevent infinite retries
    // Log the error for investigation
    return NextResponse.json({ 
      received: true,
      error: 'Internal error, logged for investigation' 
    })
  }
}

/**
 * Handle call_started event
 */
async function handleCallStarted(
  webhook: CallStartedWebhook,
  tenantId: string
): Promise<void> {
  console.log(`[Retell] Call started: ${webhook.call.call_id}`)
  
  // Create initial call record with minimal data
  const phoneNumber = webhook.call.direction === 'inbound'
    ? webhook.call.from_number || 'unknown'
    : webhook.call.to_number || 'unknown'
  
  // Try to find existing contact
  const contact = await prisma.contact.findFirst({
    where: {
      tenantId,
      phone: phoneNumber,
    },
  })
  
  // Create placeholder call record
  await prisma.call.upsert({
    where: {
      retellCallId: webhook.call.call_id,
    },
    create: {
      tenantId,
      contactId: contact?.id,
      direction: webhook.call.direction === 'inbound' ? 'INBOUND' : 'OUTBOUND',
      status: 'IN_PROGRESS',
      phoneNumber,
      retellCallId: webhook.call.call_id,
      agentId: webhook.call.agent_id,
      startedAt: new Date(webhook.call.start_timestamp),
    },
    update: {
      status: 'IN_PROGRESS',
    },
  })
}

/**
 * Handle call_ended event
 */
async function handleCallEnded(
  webhook: CallEndedWebhook,
  tenantId: string
): Promise<void> {
  console.log(`[Retell] Call ended: ${webhook.call.call_id}`)
  
  // Sync full call data from Retell AI
  try {
    await syncCallFromRetell(webhook.call.call_id, tenantId)
    console.log(`[Retell] Successfully synced call: ${webhook.call.call_id}`)
  } catch (error) {
    console.error(`[Retell] Error syncing call ${webhook.call.call_id}:`, error)
    throw error
  }
}

/**
 * Handle call_analyzed event
 */
async function handleCallAnalyzed(
  webhook: CallAnalyzedWebhook
): Promise<void> {
  console.log(`[Retell] Call analyzed: ${webhook.call.call_id}`)
  
  // Update call with analysis data
  const sentiment = webhook.call.call_analysis.user_sentiment
  const sentimentMap: Record<string, 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'> = {
    'Positive': 'POSITIVE',
    'Neutral': 'NEUTRAL',
    'Negative': 'NEGATIVE',
    'Unknown': 'NEUTRAL',
  }
  
  await prisma.call.update({
    where: {
      retellCallId: webhook.call.call_id,
    },
    data: {
      summary: webhook.call.call_analysis.call_summary,
      sentiment: sentimentMap[sentiment],
      detectedIntent: webhook.call.call_analysis.call_successful 
        ? 'successful' 
        : 'unsuccessful',
    },
  })
}

/**
 * GET /api/webhooks/retell
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'Retell AI Webhook Handler',
    timestamp: new Date().toISOString(),
  })
}

