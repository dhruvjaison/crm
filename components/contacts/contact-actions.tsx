'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { ContactDialog } from './contact-dialog'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { ContactStatus } from '@prisma/client'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  company: string | null
  jobTitle: string | null
  status: ContactStatus
  leadScore: number
  tags: string[]
  notes: string | null
}

interface ContactActionsProps {
  contact: Contact
}

export function ContactActions({ contact }: ContactActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleSuccess = () => {
    router.push('/dashboard/contacts')
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => setEditOpen(true)}>
        <Edit className="h-4 w-4 mr-2" />
        Edit Contact
      </Button>
      <Button
        variant="outline"
        onClick={() => setDeleteOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <ContactDialog
        contact={{
          ...contact,
          email: contact.email || '',
          phone: contact.phone || '',
          company: contact.company || '',
          jobTitle: contact.jobTitle || '',
          notes: contact.notes || '',
        }}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => router.refresh()}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Contact"
        description={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone and will also delete all associated calls, deals, and tasks.`}
        entityType="contact"
        entityId={contact.id}
        entityName={`${contact.firstName} ${contact.lastName}`}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

