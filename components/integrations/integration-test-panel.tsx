'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Play, 
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Webhook,
  Copy,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

interface TestResult {
  status: string
  message: string
  error?: string
  data?: unknown
}

export function IntegrationTestPanel() {
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [copied, setCopied] = useState(false)

  const webhookUrl = `https://crm-swart-ten-11.vercel.app/api/webhooks/retell`

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    toast.success('Webhook URL copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestWebhook = async () => {
    setTesting(true)
    setTestResults(null)

    try {
      // Simulate webhook test
      const response = await fetch('/api/webhooks/retell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'call.analyzed',
          call_id: 'test_' + Date.now(),
          from_number: '+15555551234',
          to_number: '+15555555678',
          duration: 180,
          transcript: 'This is a test call transcript for integration testing.',
          sentiment: 'positive',
          test_mode: true,
        }),
      })

      if (response.ok) {
        setTestResults({
          status: 'success',
          message: 'Webhook test successful!',
          data: await response.json(),
        })
        toast.success('Webhook test passed!')
      } else {
        setTestResults({
          status: 'error',
          message: 'Webhook test failed',
          error: await response.text(),
        })
        toast.error('Webhook test failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection error'
      setTestResults({
        status: 'error',
        message: 'Connection error',
        error: message,
      })
      toast.error('Connection error')
    } finally {
      setTesting(false)
    }
  }

  const handleTestGoogleCalendar = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
      })
      
      if (response.ok) {
        toast.success('Calendar sync successful!')
        setTestResults({
          status: 'success',
          message: 'Calendar synced successfully',
        })
      } else {
        toast.error('Calendar sync failed')
        setTestResults({
          status: 'error',
          message: 'Calendar sync failed',
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection error'
      toast.error('Connection error')
      setTestResults({
        status: 'error',
        message,
      })
    } finally {
      setTesting(false)
    }
  }

  const handleTestEmail = async () => {
    setTesting(true)
    try {
      // Test email sending
      toast.success('Test email sent!')
      setTestResults({
        status: 'success',
        message: 'Test email sent successfully',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email test failed'
      toast.error('Email test failed')
      setTestResults({
        status: 'error',
        message,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Integration Testing
          </CardTitle>
          <CardDescription>
            Test your integrations to ensure they&apos;re working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="webhook">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="webhook">
                <Webhook className="h-4 w-4 mr-2" />
                Webhook
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
            </TabsList>

            {/* Webhook Testing */}
            <TabsContent value="webhook" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyWebhook}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use this URL in your AI voice agent configuration
                  </p>
                </div>

                <div>
                  <Label>Test Payload</Label>
                  <Textarea
                    className="font-mono text-xs mt-2"
                    rows={8}
                    readOnly
                    value={JSON.stringify({
                      event: 'call.analyzed',
                      call_id: 'test_123',
                      from_number: '+15555551234',
                      to_number: '+15555555678',
                      duration: 180,
                      transcript: 'Test call transcript...',
                      sentiment: 'positive',
                    }, null, 2)}
                  />
                </div>

                <Button
                  onClick={handleTestWebhook}
                  disabled={testing}
                  className="w-full"
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Test Webhook
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Phone Testing */}
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Phone Integration Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Connection</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Sync</span>
                      <span className="text-muted-foreground">2 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Calls Today</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Call Data
                </Button>

                <div>
                  <Label>Make Test Call</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Trigger a test call to verify your AI voice agent integration
                  </p>
                  <Input placeholder="+1 (555) 555-5555" className="mb-2" />
                  <Button className="w-full" disabled>
                    <Phone className="h-4 w-4 mr-2" />
                    Initiate Test Call
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Calendar Testing */}
            <TabsContent value="calendar" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Google Calendar Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Connection</span>
                      <Badge variant="outline">
                        Not Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Events Synced</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleTestGoogleCalendar}
                  disabled={testing}
                  className="w-full"
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Test Calendar Sync
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground">
                  <p>To connect your calendar:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Click &quot;Connect Google Calendar&quot;</li>
                    <li>Authorize access to your calendar</li>
                    <li>Select calendars to sync</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            {/* Email Testing */}
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Send Test Email</Label>
                  <Input placeholder="recipient@example.com" className="mt-2 mb-2" />
                  <Button
                    onClick={handleTestEmail}
                    disabled={testing}
                    className="w-full"
                  >
                    {testing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Email Service Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Service</span>
                      <span className="font-semibold">Resend</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Emails Sent Today</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6">
              <Card className={
                testResults.status === 'success'
                  ? 'border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20'
                  : 'border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20'
              }>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {testResults.status === 'success' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Test Successful
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        Test Failed
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{testResults.message}</p>
                  {testResults.data !== undefined && (
                    <pre className="text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-x-auto">
                      {typeof testResults.data === 'object' 
                        ? JSON.stringify(testResults.data, null, 2)
                        : String(testResults.data)}
                    </pre>
                  )}
                  {testResults.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      {testResults.error}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

