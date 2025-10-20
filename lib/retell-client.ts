/**
 * Retell AI (Arnie AI) Client Wrapper
 * 
 * This module provides a wrapper around the Retell AI API for:
 * - Fetching call details and transcripts
 * - Managing agents
 * - Retrieving phone numbers
 * - Multi-tenant API key support
 */

import { prisma } from './db'

// Retell AI API Base URL
const RETELL_API_BASE = 'https://api.retellai.com/v1'

/**
 * Types for Retell AI responses
 */
export interface RetellCall {
  call_id: string
  agent_id: string
  call_type: 'inbound' | 'outbound'
  from_number: string
  to_number: string
  direction: 'inbound' | 'outbound'
  call_status: 'registered' | 'ongoing' | 'ended' | 'error'
  start_timestamp: number
  end_timestamp?: number
  transcript: string
  transcript_object: Array<{
    role: 'agent' | 'user'
    content: string
    timestamp: number
  }>
  recording_url?: string
  public_log_url?: string
  // AI Analysis
  call_analysis?: {
    call_summary?: string
    in_voicemail?: boolean
    user_sentiment?: 'Negative' | 'Positive' | 'Neutral' | 'Unknown'
    call_successful?: boolean
  }
  // Metadata
  metadata?: Record<string, unknown>
  retell_llm_dynamic_variables?: Record<string, unknown>
}

export interface RetellAgent {
  agent_id: string
  agent_name: string
  voice_id: string
  voice_temperature: number
  voice_speed: number
  responsiveness: number
  interruption_sensitivity: number
  llm_websocket_url?: string
  agent_type: 'retell-llm' | 'custom-llm'
}

/**
 * Get API key for a tenant
 * Falls back to super admin key if tenant doesn't have one
 */
async function getApiKey(_tenantId?: string): Promise<string> {
  // TODO: Implement per-tenant API key support
  // Add retellApiKey field to Tenant model in schema.prisma
  // Uncomment the code below when ready:
  //
  // if (tenantId) {
  //   const tenant = await prisma.tenant.findUnique({
  //     where: { id: tenantId },
  //     select: { retellApiKey: true },
  //   })
  //   
  //   if (tenant?.retellApiKey) {
  //     return tenant.retellApiKey
  //   }
  // }
  
  // For now, use super admin key from env
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) {
    throw new Error('Retell AI API key not configured. Add RETELL_API_KEY to your environment variables.')
  }
  
  return apiKey
}

/**
 * Make authenticated request to Retell AI API
 */
async function retellFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  tenantId?: string
): Promise<T> {
  const apiKey = await getApiKey(tenantId)
  
  const response = await fetch(`${RETELL_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Retell AI API error: ${response.status} - ${error}`)
  }
  
  return response.json()
}

/**
 * Retell AI Client
 */
export const retellClient = {
  /**
   * Get call details by call ID
   */
  async getCall(callId: string, tenantId?: string): Promise<RetellCall> {
    return retellFetch<RetellCall>(`/get-call/${callId}`, {}, tenantId)
  },
  
  /**
   * List all calls (paginated)
   */
  async listCalls(options: {
    limit?: number
    sort_order?: 'ascending' | 'descending'
    filter_criteria?: {
      agent_id?: string[]
      before_start_timestamp?: number
      after_start_timestamp?: number
      before_end_timestamp?: number
      after_end_timestamp?: number
    }
    tenantId?: string
  } = {}): Promise<{ calls: RetellCall[] }> {
    const params = new URLSearchParams()
    
    if (options.limit) params.append('limit', options.limit.toString())
    if (options.sort_order) params.append('sort_order', options.sort_order)
    if (options.filter_criteria) {
      params.append('filter_criteria', JSON.stringify(options.filter_criteria))
    }
    
    return retellFetch<{ calls: RetellCall[] }>(
      `/list-calls?${params.toString()}`,
      {},
      options.tenantId
    )
  },
  
  /**
   * Get agent details
   */
  async getAgent(agentId: string, tenantId?: string): Promise<RetellAgent> {
    return retellFetch<RetellAgent>(`/get-agent/${agentId}`, {}, tenantId)
  },
  
  /**
   * List all agents
   */
  async listAgents(tenantId?: string): Promise<{ agents: RetellAgent[] }> {
    return retellFetch<{ agents: RetellAgent[] }>('/list-agents', {}, tenantId)
  },
  
  /**
   * Create a phone call (for outbound)
   */
  async createPhoneCall(options: {
    from_number: string
    to_number: string
    agent_id: string
    metadata?: Record<string, unknown>
    retell_llm_dynamic_variables?: Record<string, unknown>
    tenantId?: string
  }): Promise<{ call_id: string }> {
    const { tenantId, ...body } = options
    return retellFetch<{ call_id: string }>(
      '/create-phone-call',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      tenantId
    )
  },
  
  /**
   * Register a phone call (for web/app calls)
   */
  async registerPhoneCall(options: {
    agent_id: string
    audio_websocket_protocol?: 'web' | 'twilio'
    audio_encoding?: 's16le' | 'mulaw'
    sample_rate?: 24000 | 8000 | 16000
    metadata?: Record<string, unknown>
    tenantId?: string
  }): Promise<{
    call_id: string
    access_token: string
    sample_rate: number
  }> {
    const { tenantId, ...body } = options
    return retellFetch(
      '/register-phone-call',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      tenantId
    )
  },
}

/**
 * Sync a call from Retell AI to local database
 */
export async function syncCallFromRetell(
  callId: string,
  tenantId: string
): Promise<void> {
  // Fetch call from Retell AI
  const retellCall = await retellClient.getCall(callId, tenantId)
  
  // Find or create contact based on phone number
  const phoneNumber = retellCall.direction === 'inbound' 
    ? retellCall.from_number 
    : retellCall.to_number
  
  let contact = await prisma.contact.findFirst({
    where: {
      tenantId,
      phone: phoneNumber,
    },
  })
  
  // Create contact if doesn't exist
  if (!contact) {
    contact = await prisma.contact.create({
      data: {
        tenantId,
        firstName: 'Unknown',
        lastName: 'Contact',
        phone: phoneNumber,
        email: `unknown-${Date.now()}@temporary.com`, // Temporary
        status: 'LEAD',
        leadScore: 50,
      },
    })
  }
  
  // Map sentiment
  const sentiment = retellCall.call_analysis?.user_sentiment
  const sentimentMap: Record<string, 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'> = {
    'Positive': 'POSITIVE',
    'Neutral': 'NEUTRAL',
    'Negative': 'NEGATIVE',
    'Unknown': 'NEUTRAL',
  }
  
  // Calculate duration
  const duration = retellCall.end_timestamp && retellCall.start_timestamp
    ? Math.floor((retellCall.end_timestamp - retellCall.start_timestamp) / 1000)
    : 0
  
  // Calculate cost (adjust rate as needed)
  const costPerMinute = 0.05
  const totalCost = (duration / 60) * costPerMinute
  
  // Upsert call in database
  await prisma.call.upsert({
    where: {
      retellCallId: retellCall.call_id,
    },
    create: {
      tenantId,
      contactId: contact.id,
      direction: retellCall.direction === 'inbound' ? 'INBOUND' : 'OUTBOUND',
      status: retellCall.call_status === 'ended' ? 'COMPLETED' : 'FAILED',
      phoneNumber,
      retellCallId: retellCall.call_id,
      agentId: retellCall.agent_id,
      transcript: retellCall.transcript,
      summary: retellCall.call_analysis?.call_summary,
      sentiment: sentiment ? sentimentMap[sentiment] : null,
      duration,
      totalCost,
      startedAt: new Date(retellCall.start_timestamp),
      endedAt: retellCall.end_timestamp ? new Date(retellCall.end_timestamp) : null,
    },
    update: {
      transcript: retellCall.transcript,
      summary: retellCall.call_analysis?.call_summary,
      sentiment: sentiment ? sentimentMap[sentiment] : null,
      duration,
      totalCost,
      endedAt: retellCall.end_timestamp ? new Date(retellCall.end_timestamp) : null,
      status: retellCall.call_status === 'ended' ? 'COMPLETED' : 'FAILED',
    },
  })
}

