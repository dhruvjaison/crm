import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateCostSavings } from '@/lib/mock-data'
import { DollarSign, TrendingDown, Phone, Clock, Zap, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Cost Savings Analysis
            </h1>
              <p className="text-base text-muted-foreground mt-1">
              See how much you&apos;re saving with AI-powered voice solutions
            </p>
          </div>
        </div>
      </div>

      {/* Hero Stats - Redesigned */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950 dark:via-emerald-950 dark:to-green-950 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                  Total Savings
                </CardTitle>
                <CardDescription className="text-base mt-1">All-time cost reduction</CardDescription>
              </div>
              <Badge className="bg-green-600 text-white hover:bg-green-700">
                {savings.savingsPercentage.toFixed(1)}% saved
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-6xl font-bold text-green-600 dark:text-green-400 mb-4">
              ${savings.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg px-4 py-2 w-fit">
              <TrendingDown className="h-5 w-5" />
              <span className="text-lg font-semibold">
                vs Traditional Call Centers
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-sky-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  This Month
                </CardTitle>
                <CardDescription className="text-base mt-1">Current month performance</CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                {monthCalls.length} calls
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ${monthSavings.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg px-4 py-2 w-fit">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {monthSavings.savingsPercentage.toFixed(1)}% reduction
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Comparison - Premium Design */}
      <Card className="shadow-xl border-slate-200/60 dark:border-slate-700/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Side-by-Side Comparison</CardTitle>
              <CardDescription className="text-base mt-1">Traditional vs AI-Powered Solution</CardDescription>
            </div>
            <ArrowRight className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Traditional - Red Theme */}
            <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  Traditional Call Center
                </h3>
                <Badge variant="destructive" className="text-xs">Expensive</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-red-200 dark:border-red-900">
                  <span className="text-slate-700 dark:text-slate-300">Cost per minute</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">$1.25</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-red-200 dark:border-red-900">
                  <span className="text-slate-700 dark:text-slate-300">Avg cost per call</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">${savings.traditionalCostPerCall.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-red-200 dark:border-red-900">
                  <span className="text-slate-700 dark:text-slate-300">Total calls</span>
                  <span className="text-lg font-bold">{totalCalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 mt-4 bg-red-100 dark:bg-red-900/30 rounded-lg px-4">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Total Cost</span>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    ${savings.traditionalTotalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Solution - Green Theme */}
            <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  AI Voice Solution
                </h3>
                <Badge className="bg-green-600 text-white text-xs">Cost-Effective</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-green-200 dark:border-green-900">
                  <span className="text-slate-700 dark:text-slate-300">Cost per minute</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">$0.05</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-green-200 dark:border-green-900">
                  <span className="text-slate-700 dark:text-slate-300">Avg cost per call</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">${savings.costPerCall.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-green-200 dark:border-green-900">
                  <span className="text-slate-700 dark:text-slate-300">Total calls</span>
                  <span className="text-lg font-bold">{totalCalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 mt-4 bg-green-100 dark:bg-green-900/30 rounded-lg px-4">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Total Cost</span>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${savings.retellTotalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold opacity-90">You&apos;re Saving</p>
                <p className="text-4xl font-bold mt-1">${savings.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold opacity-90">Cost Reduction</p>
                <p className="text-4xl font-bold mt-1">{savings.savingsPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics - Premium Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="premium-card-hover group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Total Calls
              </CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              {totalCalls.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">All-time call volume</p>
          </CardContent>
        </Card>

        <Card className="premium-card-hover group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Avg Duration
              </CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              {Math.floor(avgDuration / 60)}:{String(Math.floor(avgDuration % 60)).padStart(2, '0')}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Minutes per call</p>
          </CardContent>
        </Card>

        <Card className="premium-card-hover group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Saved per Call
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              ${((savings.traditionalCostPerCall - savings.costPerCall)).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Average savings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

