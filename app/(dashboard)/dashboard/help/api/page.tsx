import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Code, Key, Book, Zap, Shield, Globe } from 'lucide-react'
import Link from 'next/link'

export default async function APIDocumentationPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/contacts',
      description: 'Retrieve all contacts for your tenant',
      auth: 'Required',
    },
    {
      method: 'POST',
      endpoint: '/api/contacts',
      description: 'Create a new contact',
      auth: 'Required',
    },
    {
      method: 'GET',
      endpoint: '/api/contacts/:id',
      description: 'Get a specific contact by ID',
      auth: 'Required',
    },
    {
      method: 'PATCH',
      endpoint: '/api/contacts/:id',
      description: 'Update a contact',
      auth: 'Required',
    },
    {
      method: 'DELETE',
      endpoint: '/api/contacts/:id',
      description: 'Delete a contact',
      auth: 'Required',
    },
    {
      method: 'POST',
      endpoint: '/api/contacts/import',
      description: 'Bulk import contacts from CSV',
      auth: 'Required',
    },
    {
      method: 'GET',
      endpoint: '/api/deals',
      description: 'Retrieve all deals',
      auth: 'Required',
    },
    {
      method: 'POST',
      endpoint: '/api/deals',
      description: 'Create a new deal',
      auth: 'Required',
    },
    {
      method: 'POST',
      endpoint: '/api/webhooks/retell',
      description: 'Receive AI call data webhooks',
      auth: 'Webhook signature',
    },
  ]

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto">
      {/* Back Button */}
      <Link href="/dashboard/help">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Button>
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gradient-primary">
          API Documentation
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Integrate your CRM with external applications using our REST API
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950">
                <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">REST API</p>
                <p className="text-xs text-muted-foreground">JSON format</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-50 dark:bg-green-950">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">99.9%</p>
                <p className="text-xs text-muted-foreground">Uptime SLA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">OAuth 2.0</p>
                <p className="text-xs text-muted-foreground">Secure auth</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-orange-50 dark:bg-orange-950">
                <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">Global</p>
                <p className="text-xs text-muted-foreground">CDN delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950">
              <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">Getting Started</CardTitle>
              <CardDescription>Set up API access in 3 simple steps</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Generate API Key</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Go to Settings → API Keys and create a new API key for your application.
                </p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/settings">Generate Key</Link>
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Make Your First Request</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use your API key in the Authorization header to authenticate requests.
                </p>
                <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`curl -X GET https://crm-swart-ten-11.vercel.app/api/contacts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Handle the Response</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  All responses are returned in JSON format with standard HTTP status codes.
                </p>
                <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`{
  "success": true,
  "data": [
    {
      "id": "clx123abc",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "status": "QUALIFIED",
      "leadScore": 85
    }
  ]
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-green-50 dark:bg-green-950">
              <Book className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">API Endpoints</CardTitle>
              <CardDescription>Available REST API endpoints</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contacts">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-4 mt-6">
              {apiEndpoints.filter(e => e.endpoint.includes('/contacts')).map((endpoint) => (
                <div key={endpoint.endpoint} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      endpoint.method === 'GET' ? 'default' :
                      endpoint.method === 'POST' ? 'secondary' :
                      endpoint.method === 'PATCH' ? 'outline' :
                      'destructive'
                    }>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Auth: {endpoint.auth}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="deals" className="space-y-4 mt-6">
              {apiEndpoints.filter(e => e.endpoint.includes('/deals')).map((endpoint) => (
                <div key={endpoint.endpoint} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Auth: {endpoint.auth}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4 mt-6">
              <p className="text-muted-foreground">Task API endpoints coming soon...</p>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4 mt-6">
              {apiEndpoints.filter(e => e.endpoint.includes('/webhooks')).map((endpoint) => (
                <div key={endpoint.endpoint} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{endpoint.method}</Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Auth: {endpoint.auth}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
          <CardDescription>API usage limits by plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Standard Plan</p>
                <p className="text-sm text-muted-foreground">1,000 requests per hour</p>
              </div>
              <Badge>Current Plan</Badge>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg opacity-60">
              <div>
                <p className="font-semibold">Professional Plan</p>
                <p className="text-sm text-muted-foreground">5,000 requests per hour</p>
              </div>
              <Button size="sm" variant="outline">Upgrade</Button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg opacity-60">
              <div>
                <p className="font-semibold">Enterprise Plan</p>
                <p className="text-sm text-muted-foreground">Unlimited requests</p>
              </div>
              <Button size="sm" variant="outline">Contact Sales</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SDKs */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Official SDKs Coming Soon</CardTitle>
          <CardDescription className="text-indigo-100">
            We&apos;re building official client libraries for popular languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 rounded-lg text-center">
              <p className="font-semibold">JavaScript</p>
              <p className="text-xs text-indigo-100">Coming Q1 2025</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg text-center">
              <p className="font-semibold">Python</p>
              <p className="text-xs text-indigo-100">Coming Q1 2025</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg text-center">
              <p className="font-semibold">Ruby</p>
              <p className="text-xs text-indigo-100">Coming Q2 2025</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg text-center">
              <p className="font-semibold">PHP</p>
              <p className="text-xs text-indigo-100">Coming Q2 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

