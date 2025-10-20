import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground">Deep insights into your business performance</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Advanced analytics dashboards are being developed. You&apos;ll get detailed insights on agent performance, customer behavior, and revenue forecasting.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

