import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function CallsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const calls = await prisma.call.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      contact: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const stats = {
    total: calls.length,
    inbound: calls.filter(c => c.direction === 'INBOUND').length,
    outbound: calls.filter(c => c.direction === 'OUTBOUND').length,
    totalCost: calls.reduce((sum, c) => sum + (c.totalCost || 0), 0),
    avgDuration: calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length || 0,
    positive: calls.filter(c => c.sentiment === 'POSITIVE').length,
  }

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return null
    
    const variants: Record<string, string> = {
      POSITIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      NEUTRAL: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      NEGATIVE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    
    return (
      <Badge className={variants[sentiment] || variants.NEUTRAL}>
        {sentiment.toLowerCase()}
      </Badge>
    )
  }

  const CallList = ({ calls: callList }: { calls: typeof calls }) => (
    <div className="space-y-2">
      {callList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Phone className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p>No calls found</p>
        </div>
      ) : (
        callList.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-3 rounded-lg ${
                call.direction === 'INBOUND' 
                  ? 'bg-blue-50 dark:bg-blue-950' 
                  : 'bg-purple-50 dark:bg-purple-950'
              }`}>
                {call.direction === 'INBOUND' ? (
                  <PhoneIncoming className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <PhoneOutgoing className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">
                    {call.contact 
                      ? `${call.contact.firstName} ${call.contact.lastName}`
                      : call.phoneNumber
                    }
                  </p>
                  {call.sentiment && getSentimentBadge(call.sentiment)}
                  {call.followUpNeeded && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      Follow-up needed
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate max-w-2xl">
                  {call.summary || call.detectedIntent || 'No summary available'}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${(call.totalCost || 0).toFixed(2)}
                  </span>
                  <span>{format(new Date(call.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/calls/${call.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Intelligence</h1>
        <p className="text-muted-foreground">
          AI-powered call analysis and insights from Retell AI
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inbound
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inbound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outbound
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.outbound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(stats.avgDuration / 60)}m
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              ${stats.totalCost.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calls Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>All Calls</CardTitle>
          <CardDescription>
            Complete call history with AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                All Calls ({calls.length})
              </TabsTrigger>
              <TabsTrigger value="inbound">
                Inbound ({stats.inbound})
              </TabsTrigger>
              <TabsTrigger value="outbound">
                Outbound ({stats.outbound})
              </TabsTrigger>
              <TabsTrigger value="positive">
                Positive ({stats.positive})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <CallList calls={calls} />
            </TabsContent>
            <TabsContent value="inbound" className="mt-4">
              <CallList calls={calls.filter(c => c.direction === 'INBOUND')} />
            </TabsContent>
            <TabsContent value="outbound" className="mt-4">
              <CallList calls={calls.filter(c => c.direction === 'OUTBOUND')} />
            </TabsContent>
            <TabsContent value="positive" className="mt-4">
              <CallList calls={calls.filter(c => c.sentiment === 'POSITIVE')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

