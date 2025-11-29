'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, Phone, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function IntegrationActions() {
  const [syncing, setSyncing] = useState(false)

  const handleSyncNow = async () => {
    setSyncing(true)
    toast.loading('Syncing data...', { id: 'sync' })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Data synced successfully!', { id: 'sync' })
    } catch (error) {
      toast.error('Failed to sync data', { id: 'sync' })
    } finally {
      setSyncing(false)
    }
  }

  const handleViewCallLogs = () => {
    toast.info('Redirecting to call logs...')
    window.location.href = '/dashboard/calls'
  }

  const handleContactSupport = () => {
    toast.info('Opening support page...')
    window.location.href = '/dashboard/help/support'
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSyncNow}
        disabled={syncing}
      >
        {syncing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        Sync Now
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleViewCallLogs}
      >
        <Phone className="h-4 w-4 mr-2" />
        View Call Logs
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleContactSupport}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Contact Support
      </Button>
    </div>
  )
}

