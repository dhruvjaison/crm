import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function TasksPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const tasks = await prisma.task.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      contact: true,
      assignedTo: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { dueDate: 'asc' },
  })

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    overdue: tasks.filter(t => 
      t.status !== 'COMPLETED' && 
      t.dueDate && 
      new Date(t.dueDate) < new Date()
    ).length,
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return variants[priority] || variants.MEDIUM
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'TODO':
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const isOverdue = (task: typeof tasks[0]) => {
    return task.status !== 'COMPLETED' && task.dueDate && new Date(task.dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and activities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              To Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>{tasks.length} tasks in your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                    isOverdue(task) ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20' : ''
                  }`}
                >
                  <Checkbox 
                    checked={task.status === 'COMPLETED'}
                    className="h-5 w-5"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(task.status)}
                      <p className={`font-medium ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <Badge className={getPriorityBadge(task.priority)}>
                        {task.priority}
                      </Badge>
                      {isOverdue(task) && (
                        <Badge className="bg-red-100 text-red-800">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                      {task.contact && (
                        <Link 
                          href={`/dashboard/contacts/${task.contact.id}`}
                          className="hover:text-cyan-600"
                        >
                          👤 {task.contact.firstName} {task.contact.lastName}
                        </Link>
                      )}
                      {task.assignedTo && (
                        <span>
                          Assigned to: {task.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

