import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateCostSavings } from '@/lib/mock-data'
import { DollarSign, TrendingDown, Phone, Clock } from 'lucide-react'

export default async function CostSavingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const calls = await prisma.call.findMany({
    where: { tenantId: session.user.tenantId },
    select: { duration: true, totalCost: true, createdAt: true },
  })

  const totalCalls = calls.length
  const avgDuration = totalCalls > 0
    ? calls.reduce((sum, call) => sum + (call.duration || 0), 0) / totalCalls
    : 0

  const savings = calculateCostSavings(totalCalls, avgDuration)

  // Monthly breakdown
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const monthCalls = calls.filter(c => new Date(c.createdAt) >= thisMonth)
  const monthAvgDuration = monthCalls.length > 0
    ? monthCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / monthCalls.length
    : 0
  const monthSavings = calculateCostSavings(monthCalls.length, monthAvgDuration)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cost Savings Calculator</h1>
        <p className="text-muted-foreground">
          ROI analysis: Retell AI vs Traditional Call Centers
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-cyan-200 dark:border-cyan-900 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="text-2xl">💰 Total Savings</CardTitle>
            <CardDescription>All-time cost savings with Retell AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
              ${savings.savings.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <TrendingDown className="h-5 w-5" />
              <span className="text-xl font-semibold">
                {savings.savingsPercentage.toFixed(1)}% reduction
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardHeader>
            <CardTitle className="text-2xl">📈 This Month</CardTitle>
            <CardDescription>Current month savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
              ${monthSavings.savings.toFixed(2)}
            </div>
            <div className="text-muted-foreground">
              From {monthCalls.length} calls
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison</CardTitle>
          <CardDescription>Detailed breakdown of costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                Traditional Call Center
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Cost per minute</span>
                  <span className="font-semibold">$1.25</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Average cost per call</span>
                  <span className="font-semibold">${savings.traditionalCostPerCall.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Total calls</span>
                  <span className="font-semibold">{totalCalls}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-red-200">
                  <span className="font-bold">Total Cost</span>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ${savings.traditionalTotalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">
                Retell AI Solution
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Cost per minute</span>
                  <span className="font-semibold">$0.05</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Average cost per call</span>
                  <span className="font-semibold">${savings.costPerCall.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Total calls</span>
                  <span className="font-semibold">{totalCalls}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-cyan-200">
                  <span className="font-bold">Total Cost</span>
                  <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    ${savings.retellTotalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCalls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Call Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor(avgDuration / 60)}m {Math.floor(avgDuration % 60)}s
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Money Saved per Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${((savings.traditionalCostPerCall - savings.costPerCall)).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

