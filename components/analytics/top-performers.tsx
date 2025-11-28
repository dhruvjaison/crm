'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp } from 'lucide-react'

interface Performer {
  id: string
  name: string
  email: string
  dealsWon: number
  totalRevenue: number
}

export function TopPerformers() {
  const [performers, setPerformers] = useState<Performer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/analytics/top-performers')
        const json = await res.json()
        setPerformers(json.data || [])
      } catch (error) {
        console.error('Failed to load top performers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performers
          </CardTitle>
          <CardDescription>Highest revenue generators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (performers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performers
          </CardTitle>
          <CardDescription>Highest revenue generators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No performance data available yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Performers
        </CardTitle>
        <CardDescription>Highest revenue generators this period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performers.map((performer, index) => (
            <div
              key={performer.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className={
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-primary/10 text-primary'
                    }>
                      {getInitials(performer.name)}
                    </AvatarFallback>
                  </Avatar>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-background flex items-center justify-center">
                      <span className="text-xs">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{performer.name}</p>
                  <p className="text-sm text-muted-foreground">{performer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{formatCurrency(performer.totalRevenue)}</p>
                <div className="flex items-center gap-2 justify-end">
                  <Badge variant="secondary" className="text-xs">
                    {performer.dealsWon} deals
                  </Badge>
                  {index === 0 && (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

