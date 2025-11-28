import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Mail, MessageCircle, Phone, Clock, Zap } from 'lucide-react'
import Link from 'next/link'

export default async function SupportPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      responseTime: 'Avg. 2 min response',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      action: 'Start Chat',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'support@clarostrategy.com',
      responseTime: 'Avg. 4 hour response',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      action: 'Send Email',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with a support specialist',
      availability: 'Mon-Fri, 9am-6pm EST',
      responseTime: '1-800-CLARO-AI',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      action: 'Call Now',
    },
  ]

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 max-w-[1200px] mx-auto">
      {/* Back Button */}
      <Link href="/dashboard/help">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Button>
      </Link>

      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gradient-primary mb-4">
          Contact Support
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our team is here to help. Choose your preferred way to reach us or submit a support ticket below.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid gap-6 md:grid-cols-3">
        {supportChannels.map((channel) => {
          const Icon = channel.icon
          return (
            <Card key={channel.title} className="premium-card-hover text-center">
              <CardHeader>
                <div className={`mx-auto p-4 rounded-full ${channel.bgColor} w-fit mb-4`}>
                  <Icon className={`h-8 w-8 ${channel.color}`} />
                </div>
                <CardTitle className="text-xl">{channel.title}</CardTitle>
                <CardDescription className="text-sm">
                  {channel.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{channel.availability}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
                    <Zap className="h-4 w-4" />
                    <span>{channel.responseTime}</span>
                  </div>
                </div>
                <Button className="w-full">{channel.action}</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Support Ticket Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Support Ticket</CardTitle>
          <CardDescription>
            Fill out the form below and we&apos;ll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  defaultValue={session.user.name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  defaultValue={session.user.email || ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Issue Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="integration">Integration Help</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General question</SelectItem>
                  <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                  <SelectItem value="high">High - Blocking critical work</SelectItem>
                  <SelectItem value="urgent">Urgent - System down</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible about your issue..."
                rows={8}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Submit Ticket
              </Button>
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
          <CardDescription>
            Check if your question has already been answered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Link href="/dashboard/help/articles/quick-start" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">How do I get started with the CRM?</p>
              <p className="text-sm text-muted-foreground">Learn the basics in 10 minutes</p>
            </Link>
            <Link href="/dashboard/help/articles/import-contacts-csv" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">How do I import my existing contacts?</p>
              <p className="text-sm text-muted-foreground">Bulk import from CSV files</p>
            </Link>
            <Link href="/dashboard/help/articles/phone-integration" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">How do I connect my phone system?</p>
              <p className="text-sm text-muted-foreground">Integration setup guide</p>
            </Link>
            <Link href="/dashboard/help/articles/understanding-roi" className="block p-3 rounded-lg hover:bg-accent transition-colors">
              <p className="font-medium">How are cost savings calculated?</p>
              <p className="text-sm text-muted-foreground">Understanding your ROI</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Support */}
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Need Enterprise Support?</CardTitle>
          <CardDescription className="text-purple-100">
            Get dedicated support, custom training, and priority assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>24/7 priority support</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>Custom onboarding and training</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>Direct phone line to support team</span>
            </li>
          </ul>
          <Button className="bg-white text-purple-600 hover:bg-gray-100">
            Learn About Enterprise Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

