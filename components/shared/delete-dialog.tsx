'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  entityType: 'contact' | 'deal' | 'task'
  entityId: string
  entityName: string
  onSuccess?: () => void
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  entityType,
  entityId,
  entityName,
  onSuccess,
}: DeleteDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const endpoints = {
        contact: `/api/contacts/${entityId}`,
        deal: `/api/deals/${entityId}`,
        task: `/api/tasks/${entityId}`,
      }

      const response = await fetch(endpoints[entityType], {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to delete ${entityType}`)
      }

      toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted`, {
        description: `${entityName} has been permanently deleted.`,
      })

      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error)
      toast.error(`Failed to delete ${entityType}`, {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

