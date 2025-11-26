import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ContactStatus } from '@prisma/client'

/**
 * GET /api/contacts/[id] - Get single contact
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const contact = await prisma.contact.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
      include: {
        calls: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        deals: {
          include: {
            stage: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: { dueDate: 'asc' },
          take: 5,
        },
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('[Contact GET] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/contacts/[id] - Update contact
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    // Check contact exists and belongs to tenant
    const existingContact = await prisma.contact.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // If email is being changed, check for duplicates
    if (email && existingContact.email && email.toLowerCase() !== existingContact.email.toLowerCase()) {
      const duplicate = await prisma.contact.findFirst({
        where: {
          email: email.toLowerCase(),
          tenantId: session.user.tenantId,
          NOT: { id },
        },
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'A contact with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Update contact
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(firstName && { firstName: firstName.trim() }),
        ...(lastName && { lastName: lastName.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(company !== undefined && { company: company.trim() }),
        ...(jobTitle !== undefined && { jobTitle: jobTitle.trim() }),
        ...(status && { status: status as ContactStatus }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        ...(tags !== undefined && { tags }),
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CONTACT_UPDATED',
        description: `Contact ${contact.firstName} ${contact.lastName} was updated`,
        tenantId: session.user.tenantId,
        contactId: contact.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('[Contact PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/contacts/[id] - Delete contact
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check contact exists and belongs to tenant
    const contact = await prisma.contact.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Delete contact (cascade will handle related records)
    await prisma.contact.delete({
      where: { id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'CONTACT_UPDATED',
        description: `Contact ${contact.firstName} ${contact.lastName} was deleted`,
        tenantId: session.user.tenantId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('[Contact DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}

