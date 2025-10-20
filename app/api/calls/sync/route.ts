/**
 * Manual Call Sync API
 * 
 * Allows manual syncing of calls from Retell AI
 * Useful for:
 * - Initial setup/migration
 * - Backfilling old calls
 * - Testing integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { retellClient, syncCallFromRetell } from '@/lib/retell-client'

/**
 * POST /api/calls/sync
 * 
 * Sync a specific call by ID
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { callId } = await req.json()
    
    if (!callId) {
      return NextResponse.json(
        { error: 'callId is required' },
        { status: 400 }
      )
    }
    
    // Sync the call
    await syncCallFromRetell(callId, session.user.tenantId)
    
    return NextResponse.json({
      success: true,
      callId,
      message: 'Call synced successfully',
    })
    
  } catch (error) {
    console.error('[Call Sync] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync call' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/calls/sync
 * 
 * Bulk sync recent calls from Retell AI
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const days = parseInt(searchParams.get('days') || '7')
    
    // Calculate timestamp for X days ago
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - days)
    const afterTimestamp = Math.floor(daysAgo.getTime())
    
    // Fetch calls from Retell AI
    const response = await retellClient.listCalls({
      limit,
      sort_order: 'descending',
      filter_criteria: {
        after_start_timestamp: afterTimestamp,
      },
      tenantId: session.user.tenantId,
    })
    
    // Sync each call
    const results = {
      total: response.calls.length,
      synced: 0,
      failed: 0,
      errors: [] as string[],
    }
    
    for (const call of response.calls) {
      try {
        await syncCallFromRetell(call.call_id, session.user.tenantId)
        results.synced++
      } catch (error) {
        results.failed++
        results.errors.push(
          `${call.call_id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    }
    
    return NextResponse.json({
      success: true,
      ...results,
      message: `Synced ${results.synced} of ${results.total} calls`,
    })
    
  } catch (error) {
    console.error('[Bulk Call Sync] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync calls' },
      { status: 500 }
    )
  }
}

