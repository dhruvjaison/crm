import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Users, Briefcase, DollarSign } from 'lucide-react'

interface StatsCardsProps {
  tenantId: string
}

export async function StatsCards({ tenantId }: StatsCardsProps) {
  // Fetch stats from database
  const [
    totalCalls,
    totalContacts,
    openDeals,
    callsToday,
    totalCallCost,
  ] = await Promise.all([
    prisma.call.count({ where: { tenantId } }),
    prisma.contact.count({ where: { tenantId } }),
    prisma.deal.count({ where: { tenantId, status: 'OPEN' } }),
    prisma.call.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.call.aggregate({
      where: { tenantId },
      _sum: { totalCost: true },
    }),
  ])

  const dealsPipeline = await prisma.deal.aggregate({
    where: { tenantId, status: 'OPEN' },
    _sum: { value: true },
  })

  const stats = [
    {
      title: 'Total Calls',
      value: totalCalls.toLocaleString(),
      description: `${callsToday} today`,
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Contacts',
      value: totalContacts.toLocaleString(),
      description: 'Total contacts in CRM',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Active Deals',
      value: openDeals.toLocaleString(),
      description: `$${(dealsPipeline._sum.value || 0).toLocaleString()} in pipeline`,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Total Call Cost',
      value: `$${(totalCallCost._sum.totalCost || 0).toFixed(2)}`,
      description: 'All-time call expenses',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

