'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Distribution of call sentiments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData || []}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
      </CardContent>
    </Card>
  )
}

