import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { Palette } from 'lucide-react'
import { OrganizationSettings } from '@/components/settings/organization-settings'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { TeamManagement } from '@/components/settings/team-management'

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  })

  const users = await prisma.user.findMany({
    where: { tenantId: session.user.tenantId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  })

  const canEditOrg = session.user.role === 'SUPER_ADMIN' || session.user.role === 'CLIENT_ADMIN'
  const canManageTeam = session.user.role === 'SUPER_ADMIN' || session.user.role === 'CLIENT_ADMIN'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Organization Info */}
      {tenant && (
        <OrganizationSettings
          tenant={{
            id: tenant.id,
            name: tenant.name,
            planTier: tenant.planTier,
            maxUsers: tenant.maxUsers,
            slug: tenant.slug,
          }}
          canEdit={canEditOrg}
        />
      )}

      {/* User Profile */}
      <ProfileSettings
        user={{
          name: session.user.name || '',
          email: session.user.email || '',
          role: session.user.role,
        }}
      />

      {/* Team Members (for admins) */}
      {canManageTeam && (
        <TeamManagement
          users={users.map(u => ({
            id: u.id,
            name: u.name || '',
            email: u.email || '',
            role: u.role,
            isActive: u.isActive,
          }))}
          canManage={canManageTeam}
        />
      )}

      {/* Branding (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Branding
          </CardTitle>
          <CardDescription>Customize your CRM appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Branding customization features are being developed. You&apos;ll be able to upload your logo and customize colors.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

