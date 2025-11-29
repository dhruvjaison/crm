import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GuidedWalkthrough } from '@/components/help/guided-walkthrough'
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  Phone, 
  TrendingUp, 
  Mail, 
  CheckSquare, 
  Settings,
  Plug,
  DollarSign,
  Search,
  FileText,
  MessageCircle,
  PlayCircle
} from 'lucide-react'
import Link from 'next/link'

export default async function HelpPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      articles: [
        { title: 'Welcome to Your CRM', slug: 'welcome' },
        { title: 'Quick Start Guide', slug: 'quick-start' },
        { title: 'Setting Up Your Account', slug: 'account-setup' },
        { title: 'Importing Your Data', slug: 'importing-data' },
      ]
    },
    {
      title: 'Contacts Management',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      articles: [
        { title: 'Adding Contacts', slug: 'adding-contacts' },
        { title: 'Importing Contacts from CSV', slug: 'import-contacts-csv' },
        { title: 'Managing Contact Information', slug: 'managing-contacts' },
        { title: 'Understanding Lead Scores', slug: 'lead-scores' },
      ]
    },
    {
      title: 'Deals & Pipeline',
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      articles: [
        { title: 'Creating Deals', slug: 'creating-deals' },
        { title: 'Managing Your Pipeline', slug: 'pipeline-management' },
        { title: 'Deal Stages Explained', slug: 'deal-stages' },
        { title: 'Forecasting Revenue', slug: 'revenue-forecasting' },
      ]
    },
    {
      title: 'AI Voice Calls',
      icon: Phone,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      articles: [
        { title: 'Understanding AI Call Analytics', slug: 'call-analytics' },
        { title: 'Call Transcripts & Insights', slug: 'call-transcripts' },
        { title: 'Sentiment Analysis', slug: 'sentiment-analysis' },
        { title: 'Connecting Your Phone System', slug: 'phone-integration' },
      ]
    },
    {
      title: 'Analytics & Reports',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      articles: [
        { title: 'Dashboard Overview', slug: 'dashboard-overview' },
        { title: 'Understanding Analytics', slug: 'analytics-guide' },
        { title: 'Custom Reports', slug: 'custom-reports' },
        { title: 'Exporting Data', slug: 'exporting-data' },
      ]
    },
    {
      title: 'Cost Savings',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      articles: [
        { title: 'Understanding ROI', slug: 'understanding-roi' },
        { title: 'Cost Comparison Analysis', slug: 'cost-comparison' },
        { title: 'Maximizing Savings', slug: 'maximizing-savings' },
      ]
    },
    {
      title: 'Email & Automation',
      icon: Mail,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      articles: [
        { title: 'Creating Email Templates', slug: 'email-templates' },
        { title: 'Email Automation', slug: 'email-automation' },
        { title: 'Personalization Variables', slug: 'email-variables' },
      ]
    },
    {
      title: 'Tasks & Productivity',
      icon: CheckSquare,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      articles: [
        { title: 'Creating Tasks', slug: 'creating-tasks' },
        { title: 'Task Management Best Practices', slug: 'task-best-practices' },
        { title: 'Setting Reminders', slug: 'task-reminders' },
      ]
    },
    {
      title: 'Integrations',
      icon: Plug,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950',
      articles: [
        { title: 'Available Integrations', slug: 'available-integrations' },
        { title: 'Connecting Google Calendar', slug: 'google-calendar' },
        { title: 'AI Voice Agent Setup', slug: 'voice-agent-setup' },
        { title: 'Webhook Configuration', slug: 'webhook-config' },
      ]
    },
    {
      title: 'Settings & Account',
      icon: Settings,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      articles: [
        { title: 'Account Settings', slug: 'account-settings' },
        { title: 'Team Management', slug: 'team-management' },
        { title: 'Security & Privacy', slug: 'security-privacy' },
        { title: 'Billing & Subscription', slug: 'billing' },
      ]
    },
  ]

  const quickLinks = [
    { title: 'API Documentation', icon: FileText, href: '/dashboard/help/api' },
    { title: 'Contact Support', icon: MessageCircle, href: '/dashboard/help/support' },
  ]

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gradient-primary">
          Help & Documentation
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Everything you need to know about using your CRM
        </p>
      </div>

      {/* Search Bar */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search help articles..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Walkthrough */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <PlayCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Interactive Walkthrough</CardTitle>
              <CardDescription className="text-base">
                Take a guided tour through all CRM features. Navigate at your own pace.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                ✓ 10 sections
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                ✓ Self-paced
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                ✓ No screen blocking
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                ✓ Jump to any section
              </span>
            </div>
            <GuidedWalkthrough />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href}>
              <Card className="premium-card-hover cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">Learn more →</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Help Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.title} className="premium-card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-md ${category.bgColor}`}>
                      <Icon className={`h-5 w-5 ${category.color}`} />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/dashboard/help/articles/${article.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Need More Help */}
      <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Still need help?</CardTitle>
          <CardDescription className="text-blue-100">
            Our support team is here to assist you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/help/support">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
            </Link>
            <Link href="/dashboard/help/videos">
              <button className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Watch Tutorials
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

