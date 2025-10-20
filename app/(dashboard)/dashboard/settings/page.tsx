import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'
import { User, Building, Palette } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization
          </CardTitle>
          <CardDescription>Your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
            <p className="text-lg font-semibold">{tenant?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Plan</label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">{tenant?.planTier}</Badge>
              <span className="text-sm text-muted-foreground">
                Up to {tenant?.maxUsers} users
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tenant ID</label>
            <p className="text-sm font-mono">{tenant?.slug}</p>
          </div>
        </CardContent>
      </Card>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-lg">{session.user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{session.user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <Badge className="mt-1">{session.user.role.replace('_', ' ')}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Team Members (for admins) */}
      {(session.user.role === 'SUPER_ADMIN' || session.user.role === 'CLIENT_ADMIN') && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>{users.length} users in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{user.role.replace('_', ' ')}</Badge>
                    {user.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

