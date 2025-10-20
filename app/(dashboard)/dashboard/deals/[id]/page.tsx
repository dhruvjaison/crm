import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, DollarSign, Calendar, User, Building, TrendingUp, PhoneCall } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  const deal = await prisma.deal.findFirst({
    where: { 
      id,
      tenantId: session.user.tenantId 
    },
    include: {
      contact: {
        include: {
          calls: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      },
      stage: true,
    },
  })

  if (!deal) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      WON: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      LOST: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    }
    return colors[status] || colors.OPEN
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/deals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{deal.title}</h1>
          <p className="text-muted-foreground">Deal Details</p>
        </div>
        <Button>Edit Deal</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Deal Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Deal Value
                  </label>
                  <p className="text-3xl font-bold text-cyan-600 mt-1">
                    ${deal.value?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(deal.status)}>{deal.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stage</label>
                  <div className="mt-1">
                    <Badge 
                      style={{ 
                        backgroundColor: deal.stage.color || '#3b82f6',
                        color: 'white'
                      }}
                    >
                      {deal.stage.name}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Probability
                  </label>
                  <p className="text-2xl font-bold mt-1">{deal.stage.probability}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expected Close
                  </label>
                  <p className="mt-1">
                    {deal.expectedCloseDate 
                      ? format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')
                      : 'Not set'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created
                  </label>
                  <p className="mt-1">{format(new Date(deal.createdAt), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {deal.notes && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{deal.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href={`/dashboard/contacts/${deal.contact.id}`}
                className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold text-lg">
                    {deal.contact.firstName[0]}{deal.contact.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {deal.contact.firstName} {deal.contact.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {deal.contact.company || 'No company'}
                    </p>
                    <p className="text-sm text-muted-foreground">{deal.contact.email}</p>
                  </div>
                  <Button variant="outline">View Contact</Button>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity (calls from contact) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deal.contact.calls.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent activity</p>
              ) : (
                <div className="space-y-2">
                  {deal.contact.calls.map((call) => (
                    <Link 
                      key={call.id} 
                      href={`/dashboard/calls/${call.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {call.direction === 'INBOUND' ? '📞 Inbound call' : '📱 Outbound call'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {call.summary || 'No summary'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(call.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        {call.sentiment && (
                          <Badge className={
                            call.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                            call.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {call.sentiment.toLowerCase()}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Move Stage</Button>
              <Button className="w-full" variant="outline">Update Status</Button>
              <Button className="w-full" variant="outline">Add Note</Button>
              <Button className="w-full" variant="outline">Schedule Task</Button>
            </CardContent>
          </Card>

          {/* Expected Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expected Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Weighted by Probability</p>
                <p className="text-3xl font-bold text-cyan-600">
                  ${deal.value && deal.stage.probability 
                    ? Math.round((deal.value * deal.stage.probability) / 100).toLocaleString()
                    : 0
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ${deal.value?.toLocaleString() || 0} × {deal.stage.probability}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{format(new Date(deal.createdAt), 'MMM d, yyyy')}</p>
              </div>
              {deal.expectedCloseDate && (
                <div>
                  <p className="text-muted-foreground">Expected Close</p>
                  <p className="font-medium">
                    {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.ceil((new Date(deal.expectedCloseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(new Date(deal.updatedAt), 'MMM d, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

