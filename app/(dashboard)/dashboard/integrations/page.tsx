import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IntegrationTestPanel } from '@/components/integrations/integration-test-panel'
import { IntegrationActions } from '@/components/integrations/integration-actions'
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

  // Available integrations - Managed by your service provider
  const integrations = [
    {
      id: 'voice-ai',
      name: 'AI Voice Agents',
      description: 'Intelligent voice agents for inbound and outbound calls with real-time analytics',
      icon: Phone,
      status: 'managed', // 'managed' = provided by you, 'available' = customer can enable
      category: 'Voice & Communication',
      managed: true,
      setupUrl: null,
      docsUrl: null,
    },
    {
      id: 'email',
      name: 'Email Automation',
      description: 'Automated email campaigns, sequences, and transactional emails',
      icon: Mail,
      status: 'available',
      category: 'Marketing & Sales',
      managed: false,
      setupUrl: '/dashboard/integrations/email',
      docsUrl: null,
    },
    {
      id: 'sms',
      name: 'SMS & WhatsApp',
      description: 'Text messaging and WhatsApp business messaging',
      icon: MessageSquare,
      status: 'available',
      category: 'Marketing & Sales',
      managed: false,
      setupUrl: '/dashboard/integrations/sms',
      docsUrl: null,
    },
    {
      id: 'calendar',
      name: 'Calendar Sync',
      description: 'Sync with Google Calendar, Outlook, and other calendar services',
      icon: Calendar,
      status: 'available',
      category: 'Productivity',
      managed: false,
      setupUrl: '/dashboard/calendar',
      docsUrl: null,
    },
    {
      id: 'automation',
      name: 'Workflow Automation',
      description: 'Custom workflows and automation rules for your business processes',
      icon: Zap,
      status: 'managed',
      category: 'Automation',
      managed: true,
      setupUrl: null,
      docsUrl: null,
    },
  ]

  const getStatusBadge = (status: string, managed: boolean) => {
    if (managed) {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Managed For You
        </Badge>
      )
    }
    
    switch (status) {
      case 'configured':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
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
            Available
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
          Powerful integrations managed by your service provider
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Managed Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {integrations.filter(i => i.managed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Included in your plan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Add-ons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => !i.managed).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Optional features
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrations.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Growing library
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Managed Services Info */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Managed Services
          </CardTitle>
          <CardDescription>
            These integrations are fully managed by your service provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your AI voice agents and workflow automation are configured, optimized, and maintained for you. 
            Data flows automatically into your CRM with no setup required.
          </p>
          <IntegrationActions />
        </CardContent>
      </Card>

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
                  {getStatusBadge(integration.status, integration.managed)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
                {integration.managed ? (
                  <div className="space-y-2">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      ✓ Included in your plan
                    </p>
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      Managed by Provider
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={integration.status === 'configured' ? 'outline' : 'default'}
                      className="flex-1"
                      disabled={!integration.setupUrl}
                    >
                      {integration.status === 'configured' ? 'Configure' : 'Request Access'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Integration Testing Panel */}
      <IntegrationTestPanel userId={session.user.id} tenantId={session.user.tenantId} />

      {/* Support & Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need Additional Integrations?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Want to enable additional features or request a custom integration? 
            Contact your service provider to discuss your needs.
          </p>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

