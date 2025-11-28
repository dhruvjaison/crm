import { Rocket, UserPlus, TrendingUp, Phone, CheckSquare, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function WelcomeDashboard({ userName }: { userName?: string }) {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto rounded-full bg-primary/10 p-4 w-fit mb-4">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">
            Welcome{userName ? `, ${userName}` : ' to your CRM'}! 🎉
          </CardTitle>
          <CardDescription className="text-base">
            Let&apos;s get you set up. Start by adding your first contacts and deals.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Contacts */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-fit mb-2">
              <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Add Contacts</CardTitle>
            <CardDescription>
              Build your customer database by adding contacts manually or importing from CSV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/contacts">
                Get Started
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Create Deals */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-fit mb-2">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">Create Deals</CardTitle>
            <CardDescription>
              Track sales opportunities and manage your pipeline from lead to close.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/deals">
                View Pipeline
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Connect Phone */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 w-fit mb-2">
              <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Connect Phone System</CardTitle>
            <CardDescription>
              Link your voice service to automatically track and analyze calls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/integrations">
                Setup Integrations
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Manage Tasks */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3 w-fit mb-2">
              <CheckSquare className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-lg">Manage Tasks</CardTitle>
            <CardDescription>
              Create to-dos and reminders to stay on top of your follow-ups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/tasks">
                Create Task
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Configure Settings */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 w-fit mb-2">
              <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <CardTitle className="text-lg">Configure Settings</CardTitle>
            <CardDescription>
              Customize your CRM, manage team members, and set preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/settings">
                Open Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="hover:shadow-md transition-shadow border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>
              Check out our guides and documentation to get the most out of your CRM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="ghost">
              <Link href="/dashboard/help">
                View Documentation
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

