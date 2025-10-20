import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

export default async function IntegrationsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  // Available integrations
  const integrations = [
    {
      id: 'retell',
      name: 'Arnie AI (Retell AI)',
      description: 'AI voice agents for inbound and outbound calls',
      icon: Phone,
      status: 'configured', // 'configured', 'not_configured', 'error'
      category: 'Voice',
      setupUrl: '/dashboard/integrations/retell',
      docsUrl: 'https://docs.retellai.com',
    },
    {
      id: 'resend',
      name: 'Resend',
      description: 'Email automation and transactional emails',
      icon: Mail,
      status: 'not_configured',
      category: 'Email',
      setupUrl: '/dashboard/integrations/resend',
      docsUrl: 'https://resend.com/docs',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'SMS and WhatsApp messaging',
      icon: MessageSquare,
      status: 'not_configured',
      category: 'SMS',
      setupUrl: '/dashboard/integrations/twilio',
      docsUrl: 'https://www.twilio.com/docs',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Schedule meetings and follow-ups',
      icon: Calendar,
      status: 'not_configured',
      category: 'Calendar',
      setupUrl: '/dashboard/integrations/google-calendar',
      docsUrl: 'https://developers.google.com/calendar',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect to 5,000+ apps',
      icon: Zap,
      status: 'not_configured',
      category: 'Automation',
      setupUrl: '/dashboard/integrations/zapier',
      docsUrl: 'https://zapier.com/apps/crm/integrations',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your CRM with external services
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.status === 'configured').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(integrations.map(i => i.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arnie AI Quick Actions (if configured) */}
      {integrations.find(i => i.id === 'retell')?.status === 'configured' && (
        <Card className="border-cyan-200 dark:border-cyan-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-cyan-600" />
              Arnie AI Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your Arnie AI integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Recent Calls
              </Button>
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                View Agents
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Retell Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const Icon = integration.icon
          return (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{integration.category}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={integration.status === 'configured' ? 'outline' : 'default'}
                    className="flex-1"
                  >
                    {integration.status === 'configured' ? 'Configure' : 'Connect'}
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a 
                      href={integration.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Documentation Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Check out our integration guides and API documentation to get started.
          </p>
          <Button variant="outline" asChild>
            <a href="/INTEGRATION-GUIDE.md" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Integration Guide
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

