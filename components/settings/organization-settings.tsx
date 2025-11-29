'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Building, Pencil, Loader2, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface OrganizationSettingsProps {
  tenant: {
    id: string
    name: string
    planTier: string
    maxUsers: number
    slug: string
  }
  canEdit: boolean
}

export function OrganizationSettings({ tenant, canEdit }: OrganizationSettingsProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(tenant.name)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Organization name is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/settings/organization', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update organization')
      }

      toast.success('Organization updated successfully')
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating organization:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update organization')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setName(tenant.name)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <CardTitle>Organization</CardTitle>
          </div>
          {canEdit && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>Your organization details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Acme Inc."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} size="sm">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
              <p className="text-lg font-semibold">{tenant.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plan</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">{tenant.planTier}</Badge>
                <span className="text-sm text-muted-foreground">
                  Up to {tenant.maxUsers} users
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tenant ID</label>
              <p className="text-sm font-mono">{tenant.slug}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

