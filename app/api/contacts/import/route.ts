import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ContactStatus } from '@prisma/client'

interface ImportRow {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  status?: string
  tags?: string
  notes?: string
}

interface ImportResult {
  created: number
  updated: number
  skipped: number
  errors: Array<{ row: number; error: string }>
}

/**
 * POST /api/contacts/import - Import contacts from CSV
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contacts, updateExisting = false } = body as { contacts: ImportRow[], updateExisting?: boolean }

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'No contacts provided' },
        { status: 400 }
      )
    }

    const result: ImportResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    }

    // Process each contact
    for (let i = 0; i < contacts.length; i++) {
      const row = contacts[i]
      const rowNumber = i + 1

      try {
        // Validation
        if (!row.firstName || !row.lastName) {
          result.errors.push({
            row: rowNumber,
            error: 'First name and last name are required',
          })
          result.skipped++
          continue
        }

        // Check for existing contact by email or phone
        let existingContact = null
        if (row.email) {
          existingContact = await prisma.contact.findFirst({
            where: {
              email: row.email.toLowerCase().trim(),
              tenantId: session.user.tenantId,
            },
          })
        }

        if (!existingContact && row.phone) {
          existingContact = await prisma.contact.findFirst({
            where: {
              phone: row.phone.trim(),
              tenantId: session.user.tenantId,
            },
          })
        }

        // Parse tags
        const tags = row.tags 
          ? row.tags.split(',').map(t => t.trim()).filter(Boolean)
          : []

        // Parse status
        let status: ContactStatus = ContactStatus.LEAD
        if (row.status) {
          const upperStatus = row.status.toUpperCase() as ContactStatus
          if (Object.values(ContactStatus).includes(upperStatus)) {
            status = upperStatus
          }
        }

        if (existingContact) {
          if (updateExisting) {
            // Update existing contact
            await prisma.contact.update({
              where: { id: existingContact.id },
              data: {
                firstName: row.firstName.trim(),
                lastName: row.lastName.trim(),
                email: row.email?.toLowerCase().trim() || existingContact.email,
                phone: row.phone?.trim() || existingContact.phone,
                company: row.company?.trim() || existingContact.company,
                jobTitle: row.jobTitle?.trim() || existingContact.jobTitle,
                status,
                tags,
                notes: row.notes ? `${existingContact.notes || ''}\n\n${row.notes.trim()}` : existingContact.notes,
              },
            })

            // Log activity
            await prisma.activity.create({
              data: {
                type: 'CONTACT_UPDATED',
                description: `Contact ${row.firstName} ${row.lastName} updated via CSV import`,
                tenantId: session.user.tenantId,
                contactId: existingContact.id,
                userId: session.user.id,
              },
            })

            result.updated++
          } else {
            result.skipped++
          }
        } else {
          // Create new contact
          const contact = await prisma.contact.create({
            data: {
              firstName: row.firstName.trim(),
              lastName: row.lastName.trim(),
              email: row.email?.toLowerCase().trim() || null,
              phone: row.phone?.trim() || null,
              company: row.company?.trim() || null,
              jobTitle: row.jobTitle?.trim() || null,
              status,
              tags,
              notes: row.notes?.trim() || null,
              tenantId: session.user.tenantId,
              leadScore: 0,
            },
          })

          // Log activity
          await prisma.activity.create({
            data: {
              type: 'CONTACT_CREATED',
              description: `Contact ${contact.firstName} ${contact.lastName} created via CSV import`,
              tenantId: session.user.tenantId,
              contactId: contact.id,
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
    console.error('[Contacts Import] Error:', error)
    return NextResponse.json(
      { error: 'Failed to import contacts' },
      { status: 500 }
    )
  }
}

