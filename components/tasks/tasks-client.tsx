'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskDialog } from './task-dialog'

export function AddTaskButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    // Mark step as complete for onboarding
    localStorage.setItem('first_task_created', 'true')
    router.refresh()
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        data-onboarding="create-task-button"
        className="relative"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}

