import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { DealStatus } from '@prisma/client'

interface ImportRow {
  title: string
  value?: string
  contactEmail?: string
  contactPhone?: string
  stageName?: string
  status?: string
  expectedCloseDate?: string
  notes?: string
}

interface ImportResult {
  created: number
  updated: number
  skipped: number
  errors: Array<{ row: number; error: string }>
}

/**
 * POST /api/deals/import - Import deals from CSV
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { deals, updateExisting = false } = body as { deals: ImportRow[], updateExisting?: boolean }

    if (!Array.isArray(deals) || deals.length === 0) {
      return NextResponse.json(
        { error: 'No deals provided' },
        { status: 400 }
      )
    }

    const result: ImportResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    }

    // Get all pipeline stages for this tenant
    const stages = await prisma.pipelineStage.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { order: 'asc' },
    })

    if (stages.length === 0) {
      return NextResponse.json(
        { error: 'No pipeline stages found. Please create stages first.' },
        { status: 400 }
      )
    }

    const defaultStage = stages[0]

    // Process each deal
    for (let i = 0; i < deals.length; i++) {
      const row = deals[i]
      const rowNumber = i + 1

      try {
        // Validation
        if (!row.title) {
          result.errors.push({
            row: rowNumber,
            error: 'Title is required',
          })
          result.skipped++
          continue
        }

        // Find contact by email or phone
        let contact = null
        if (row.contactEmail) {
          contact = await prisma.contact.findFirst({
            where: {
              email: row.contactEmail.toLowerCase().trim(),
              tenantId: session.user.tenantId,
            },
          })
        }

        if (!contact && row.contactPhone) {
          contact = await prisma.contact.findFirst({
            where: {
              phone: row.contactPhone.trim(),
              tenantId: session.user.tenantId,
            },
          })
        }

        if (!contact) {
          result.errors.push({
            row: rowNumber,
            error: 'Contact not found. Please import contacts first.',
          })
          result.skipped++
          continue
        }

        // Find stage by name
        let stage = defaultStage
        if (row.stageName) {
          const foundStage = stages.find(s => 
            s.name.toLowerCase() === row.stageName!.toLowerCase().trim()
          )
          if (foundStage) {
            stage = foundStage
          }
        }

        // Parse status
        let status: DealStatus = DealStatus.OPEN
        if (row.status) {
          const upperStatus = row.status.toUpperCase() as DealStatus
          if (Object.values(DealStatus).includes(upperStatus)) {
            status = upperStatus
          }
        }

        // Parse value
        const value = row.value ? parseFloat(row.value.replace(/[$,]/g, '')) : null

        // Parse date
        let expectedCloseDate = null
        if (row.expectedCloseDate) {
          try {
            expectedCloseDate = new Date(row.expectedCloseDate)
            if (isNaN(expectedCloseDate.getTime())) {
              expectedCloseDate = null
            }
          } catch {
            expectedCloseDate = null
          }
        }

        // Check for existing deal
        const existingDeal = await prisma.deal.findFirst({
          where: {
            title: row.title.trim(),
            contactId: contact.id,
            tenantId: session.user.tenantId,
          },
        })

        if (existingDeal) {
          if (updateExisting) {
            // Update existing deal
            await prisma.deal.update({
              where: { id: existingDeal.id },
              data: {
                value: value !== null ? value : existingDeal.value,
                stageId: stage.id,
                status,
                expectedCloseDate: expectedCloseDate || existingDeal.expectedCloseDate,
                notes: row.notes ? `${existingDeal.notes || ''}\n\n${row.notes.trim()}` : existingDeal.notes,
              },
            })

            // Log activity
            await prisma.activity.create({
              data: {
                type: 'DEAL_STAGE_CHANGED',
                description: `Deal ${row.title} updated via CSV import`,
                tenantId: session.user.tenantId,
                dealId: existingDeal.id,
                userId: session.user.id,
              },
            })

            result.updated++
          } else {
            result.skipped++
          }
        } else {
          // Create new deal
          const deal = await prisma.deal.create({
            data: {
              title: row.title.trim(),
              value,
              stageId: stage.id,
              status,
              contactId: contact.id,
              expectedCloseDate,
              notes: row.notes?.trim() || null,
              tenantId: session.user.tenantId,
              ownerId: session.user.id,
            },
          })

          // Log activity
          await prisma.activity.create({
            data: {
              type: 'DEAL_CREATED',
              description: `Deal ${deal.title} created via CSV import`,
              tenantId: session.user.tenantId,
              dealId: deal.id,
              userId: session.user.id,
            },
          })

          result.created++
        }
      } catch (error) {
        console.error(`Error importing row ${rowNumber}:`, error)
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        result.skipped++
      }
    }

    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.error('[Deals Import] Error:', error)
    return NextResponse.json(
      { error: 'Failed to import deals' },
      { status: 500 }
    )
  }
}

