import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, ArrowRight, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface RecentCallsProps {
  tenantId: string
}

export async function RecentCalls({ tenantId }: RecentCallsProps) {
  const recentCalls = await prisma.call.findMany({
    where: { tenantId },
    include: {
      contact: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return null
    
    const variants: Record<string, any> = {
      POSITIVE: { variant: 'default' as const, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      NEUTRAL: { variant: 'secondary' as const, className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
      NEGATIVE: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    }
    
    const config = variants[sentiment] || variants.NEUTRAL
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {sentiment.toLowerCase()}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>Latest call activity with AI analysis</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/calls">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCalls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No calls yet. Start making calls to see them here!</p>
            </div>
          ) : (
            recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${
                    call.direction === 'INBOUND' 
                      ? 'bg-blue-50 dark:bg-blue-950' 
                      : 'bg-purple-50 dark:bg-purple-950'
                  }`}>
                    {call.direction === 'INBOUND' ? (
                      <PhoneIncoming className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <PhoneOutgoing className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">
                        {call.contact 
                          ? `${call.contact.firstName} ${call.contact.lastName}`
                          : call.phoneNumber
                        }
                      </p>
                      {call.sentiment && getSentimentBadge(call.sentiment)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {call.summary || 'No summary available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-sm font-medium">
                      {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(call.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/calls/${call.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

