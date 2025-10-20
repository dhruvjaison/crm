import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare } from 'lucide-react'

export default async function TasksPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">Manage your tasks and activities</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Task management features are being developed. You&apos;ll be able to create, assign, and track tasks here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

