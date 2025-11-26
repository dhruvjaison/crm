import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'
import { AddDealButton } from '@/components/deals/deals-client'

export default async function DealsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const [deals, stages] = await Promise.all([
    prisma.deal.findMany({
      where: { tenantId: session.user.tenantId },
      include: {
        contact: true,
        stage: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pipelineStage.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { order: 'asc' },
    }),
  ])

  const stats = {
    total: deals.length,
    open: deals.filter(d => d.status === 'OPEN').length,
    won: deals.filter(d => d.status === 'WON').length,
    totalValue: deals.filter(d => d.status === 'OPEN').reduce((sum, d) => sum + (d.value || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deal Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your sales opportunities
          </p>
        </div>
        <AddDealButton />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              ${stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.won}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.open > 0 ? Math.round(stats.totalValue / stats.open).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stageId === stage.id && d.status === 'OPEN')
          const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0)

          return (
            <Card key={stage.id} className="border-t-4" style={{ borderTopColor: stage.color || '#gray' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  {stage.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {stageDeals.length} deals • ${stageValue.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {stageDeals.slice(0, 5).map((deal) => (
                  <div key={deal.id} className="p-3 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="font-medium text-sm truncate">{deal.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {deal.contact.firstName} {deal.contact.lastName}
                    </p>
                    <p className="text-sm font-semibold text-cyan-600 mt-1">
                      ${deal.value?.toLocaleString() || 0}
                    </p>
                  </div>
                ))}
                {stageDeals.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground">
                    +{stageDeals.length - 5} more
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* All Deals List */}
      <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
          <CardDescription>Complete deal list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{deal.title}</p>
                      <Badge>{deal.stage.name}</Badge>
                      {deal.status === 'WON' && (
                        <Badge className="bg-green-100 text-green-800">Won</Badge>
                      )}
                      {deal.status === 'LOST' && (
                        <Badge variant="secondary">Lost</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {deal.contact.firstName} {deal.contact.lastName} • {deal.contact.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-600">
                      ${deal.value?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {deal.expectedCloseDate 
                        ? new Date(deal.expectedCloseDate).toLocaleDateString()
                        : 'No close date'
                      }
                    </p>
                  </div>
                  <Link href={`/dashboard/deals/${deal.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

