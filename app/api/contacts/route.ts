import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ContactStatus, Prisma } from '@prisma/client'

/**
 * GET /api/contacts - List all contacts for tenant
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: Prisma.ContactWhereInput = {
      tenantId: session.user.tenantId,
    }

    // Search by name or email
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filter by status
    if (status && status !== 'all') {
      where.status = status as ContactStatus
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            calls: true,
            deals: true,
          },
        },
      },
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('[Contacts GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/contacts - Create new contact
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      status,
      notes,
      tags,
      leadScore,
      // Chloe AI Insights
      leadVolume,
      industry,
      painPoint,
      estimatedRevenueLoss,
      bookingStatus,
    } = body

    // Validation
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Check for duplicate phone in same tenant (if phone provided)
    if (phone) {
      const existingContact = await prisma.contact.findFirst({
        where: {
          phone: phone.trim(),
          tenantId: session.user.tenantId,
        },
      })

      if (existingContact) {
        // Update existing contact instead of creating duplicate
        const updatedContact = await prisma.contact.update({
          where: { id: existingContact.id },
          data: {
            firstName: firstName?.trim() || existingContact.firstName,
            lastName: lastName?.trim() || existingContact.lastName,
            email: email?.toLowerCase().trim() || existingContact.email,
            company: company?.trim() || existingContact.company,
            jobTitle: jobTitle?.trim() || existingContact.jobTitle,
            status: (status as ContactStatus) || existingContact.status,
            notes: notes ? `${existingContact.notes || ''}\n\n${notes.trim()}` : existingContact.notes,
            tags: tags || existingContact.tags,
            leadScore: leadScore !== undefined ? leadScore : existingContact.leadScore,
            // Update Chloe insights
            leadVolume: leadVolume || existingContact.leadVolume,
            industry: industry || existingContact.industry,
            painPoint: painPoint || existingContact.painPoint,
            estimatedRevenueLoss: estimatedRevenueLoss || existingContact.estimatedRevenueLoss,
            bookingStatus: bookingStatus || existingContact.bookingStatus,
          },
        })

        // Log activity
        await prisma.activity.create({
          data: {
            type: 'CONTACT_UPDATED',
            description: `Contact ${updatedContact.firstName} ${updatedContact.lastName} was updated via Chloe AI`,
            tenantId: session.user.tenantId,
            contactId: updatedContact.id,
            userId: session.user.id,
          },
        })

        return NextResponse.json({ contact: updatedContact, updated: true }, { status: 200 })
      }
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email?.toLowerCase().trim() || null,
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        jobTitle: jobTitle?.trim() || null,
        status: (status as ContactStatus) || ContactStatus.LEAD,
        notes: notes?.trim() || null,
        tags: tags || [],
        tenantId: session.user.tenantId,
        leadScore: leadScore !== undefined ? leadScore : 0,
        // Chloe AI Insights
        leadVolume: leadVolume?.trim() || null,
        industry: industry?.trim() || null,
        painPoint: painPoint?.trim() || null,
        estimatedRevenueLoss: estimatedRevenueLoss?.trim() || null,
        bookingStatus: bookingStatus?.trim() || null,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CONTACT_CREATED',
        description: `Contact ${contact.firstName} ${contact.lastName} was created`,
        tenantId: session.user.tenantId,
        contactId: contact.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error) {
    console.error('[Contacts POST] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}

