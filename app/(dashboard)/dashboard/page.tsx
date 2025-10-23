import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { CallVolumeChart } from '@/components/dashboard/call-volume-chart'
import { SentimentChart } from '@/components/dashboard/sentiment-chart'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { CostSavingsWidget } from '@/components/dashboard/cost-savings-widget'

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
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

