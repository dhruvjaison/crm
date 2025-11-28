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
    <div className="space-y-8">
      {/* Premium Page Header with Gradient */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Welcome back, {session.user.name?.split(' ')[0] || 'there'}! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Cards with Premium Spacing */}
      <StatsCards tenantId={session.user.tenantId} />

      {/* Cost Savings Highlight */}
      <CostSavingsWidget tenantId={session.user.tenantId} />

      {/* Charts Row with Better Gap */}
      <div className="grid gap-8 md:grid-cols-2">
        <CallVolumeChart tenantId={session.user.tenantId} />
        <SentimentChart tenantId={session.user.tenantId} />
      </div>

      {/* Recent Calls */}
      <RecentCalls tenantId={session.user.tenantId} />
    </div>
  )
}

