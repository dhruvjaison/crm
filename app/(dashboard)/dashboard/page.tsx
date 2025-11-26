import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { CallVolumeChart } from '@/components/dashboard/call-volume-chart'
import { SentimentChart } from '@/components/dashboard/sentiment-chart'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { CostSavingsWidget } from '@/components/dashboard/cost-savings-widget'
import { WelcomeDashboard } from '@/components/empty-states'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check if user has any data
  const [contactsCount, dealsCount, tasksCount] = await Promise.all([
    prisma.contact.count({ where: { tenantId: session.user.tenantId } }),
    prisma.deal.count({ where: { tenantId: session.user.tenantId } }),
    prisma.task.count({ where: { tenantId: session.user.tenantId } }),
  ])

  const hasData = contactsCount > 0 || dealsCount > 0 || tasksCount > 0

  if (!hasData) {
    return <WelcomeDashboard />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance and customer insights
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards tenantId={session.user.tenantId} />

      {/* Cost Savings Highlight */}
      <CostSavingsWidget tenantId={session.user.tenantId} />

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CallVolumeChart tenantId={session.user.tenantId} />
        <SentimentChart tenantId={session.user.tenantId} />
      </div>

      {/* Recent Calls */}
      <RecentCalls tenantId={session.user.tenantId} />
    </div>
  )
}

