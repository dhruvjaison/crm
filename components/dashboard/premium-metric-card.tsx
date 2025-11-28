'use client'

import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PremiumMetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
}

export function PremiumMetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50',
  trend = 'neutral',
  loading = false,
}: PremiumMetricCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }

  if (loading) {
    return (
      <Card className="premium-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded loading-shimmer" />
          <div className="h-10 w-10 bg-muted rounded-lg loading-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded loading-shimmer" />
          <div className="h-3 w-20 bg-muted rounded loading-shimmer" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="premium-card-hover p-6 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold tracking-tight transition-smooth group-hover:text-primary">
              {value}
            </p>
            {change && (
              <div className="flex items-center gap-1">
                <span className={cn('text-xs font-semibold', trendColors[trend])}>
                  {change.value > 0 && '+'}
                  {change.value}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {change.label}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(
          'p-3 rounded-xl transition-smooth group-hover:scale-110',
          iconBgColor
        )}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
      
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  )
}

