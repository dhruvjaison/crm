import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateCostSavings } from '@/lib/mock-data'
import { TrendingDown } from 'lucide-react'

interface CostSavingsWidgetProps {
  tenantId: string
}

export async function CostSavingsWidget({ tenantId }: CostSavingsWidgetProps) {
  // Get call stats for this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const monthCalls = await prisma.call.findMany({
    where: {
      tenantId,
      createdAt: {
        gte: startOfMonth,
      },
    },
    select: {
      duration: true,
    },
  })

  const totalCalls = monthCalls.length
  const avgDuration = totalCalls > 0
    ? monthCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / totalCalls
    : 0

  const savings = calculateCostSavings(totalCalls, avgDuration)

  return (
    <Card className="border-2 border-cyan-200 dark:border-cyan-900 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">💰 Cost Savings This Month</CardTitle>
            <CardDescription className="mt-1">
              Compared to traditional call centers
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400">
            <TrendingDown className="h-3 w-3 mr-1" />
            {savings.savingsPercentage.toFixed(0)}% saved
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Traditional Cost
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${savings.traditionalTotalCost.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              @ ${savings.traditionalCostPerCall.toFixed(2)}/call avg
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Arnie AI Cost
            </div>
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              ${savings.retellTotalCost.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              @ ${savings.costPerCall.toFixed(2)}/call avg
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              💵 You Saved
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${savings.savings.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalCalls} calls this month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

