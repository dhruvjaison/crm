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
    } = body

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    // Check for duplicate email in same tenant
    const existingContact = await prisma.contact.findFirst({
      where: {
        email: email.toLowerCase(),
        tenantId: session.user.tenantId,
      },
    })

    if (existingContact) {
      return NextResponse.json(
        { error: 'A contact with this email already exists' },
        { status: 409 }
      )
    }

    // Create contact
    const contact = await prisma.contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || '',
        company: company?.trim() || '',
        jobTitle: jobTitle?.trim() || '',
        status: (status as ContactStatus) || ContactStatus.LEAD,
        notes: notes?.trim() || null,
        tags: tags || [],
        tenantId: session.user.tenantId,
        leadScore: 0,
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

