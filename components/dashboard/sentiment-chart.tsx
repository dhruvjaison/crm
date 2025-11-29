'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Smile, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SentimentChartProps {
  tenantId: string
}

const COLORS = {
  POSITIVE: '#10b981', // green
  NEUTRAL: '#f59e0b',  // amber
  NEGATIVE: '#ef4444', // red
}

export function SentimentChart({ tenantId }: SentimentChartProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['sentiment-analysis', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/sentiment?tenantId=${tenantId}`)
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Call sentiment distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasData = chartData && chartData.length > 0 && chartData.some((d: { value: number }) => d.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Distribution of call sentiments</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <Smile className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No sentiment data yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                AI-powered sentiment analysis will appear here after your voice agents complete calls.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/calls">
                <MessageSquare className="h-4 w-4 mr-2" />
                View Call Analytics
              </Link>
            </Button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(chartData || []).map((entry: { name: keyof typeof COLORS; value: number }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))' 
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

