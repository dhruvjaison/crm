import { CheckSquare, Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface NoTasksProps {
  onCreateTask?: () => void
}

export function NoTasks({ onCreateTask }: NoTasksProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <CheckSquare className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">No tasks yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Stay organized and never miss a follow-up. Create tasks to manage your daily workflow.
      </p>
      
      <Button size="lg" onClick={onCreateTask}>
        <Plus className="mr-2 h-5 w-5" />
        Create Your First Task
      </Button>
      
      <div className="mt-8 pt-8 border-t w-full">
        <h4 className="font-medium mb-3">Task Management Tips:</h4>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/60" />
            <div className="text-left">
              <span className="font-medium text-foreground">Set due dates</span>
              <p>Add deadlines to keep your work on track</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/60" />
            <div className="text-left">
              <span className="font-medium text-foreground">Link to contacts</span>
              <p>Associate tasks with deals and contacts</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

