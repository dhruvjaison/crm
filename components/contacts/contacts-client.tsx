'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import { ContactDialog } from './contact-dialog'
import { CSVImportDialog } from './csv-import-dialog'

export function AddContactButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    // Mark step as complete for onboarding
    localStorage.setItem('first_contact_added', 'true')
    router.refresh()
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        data-onboarding="add-contact-button"
        className="relative"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Contact
      </Button>
      <ContactDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export function ImportContactsButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>
      <CSVImportDialog
        open={open}
        onOpenChange={setOpen}
        onImportComplete={() => router.refresh()}
      />
    </>
  )
}

