'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Upload } from 'lucide-react'
import { DealDialog } from './deal-dialog'
import { CSVImportDealsDialog } from './csv-import-deals-dialog'

export function AddDealButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Deal
      </Button>
      <DealDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

export function ImportDealsButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>
      <CSVImportDealsDialog
        open={open}
        onOpenChange={setOpen}
        onImportComplete={() => router.refresh()}
      />
    </>
  )
}

