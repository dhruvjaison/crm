'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CallVolumeChartProps {
  tenantId: string
}

export function CallVolumeChart({ tenantId }: CallVolumeChartProps) {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['call-volume', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/call-volume?tenantId=${tenantId}`)
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Call Volume</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
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
        <CardTitle>Call Volume</CardTitle>
        <CardDescription>Inbound and outbound calls over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData || []}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))' 
              }} 
            />
            <Legend />
            <Bar dataKey="inbound" fill="#06b6d4" name="Inbound" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outbound" fill="#8b5cf6" name="Outbound" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

