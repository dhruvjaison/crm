import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Clock, Users, Briefcase, Phone, TrendingUp, Mail, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function VideoTutorialsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const videoCategories = [
    {
      title: 'Getting Started',
      icon: Play,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      videos: [
        {
          title: 'Welcome to Your CRM - Platform Overview',
          duration: '5:30',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/welcome.jpg',
          description: 'Get a complete tour of your CRM and learn about all the key features.',
        },
        {
          title: 'Quick Start: Your First 15 Minutes',
          duration: '15:00',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/quickstart.jpg',
          description: 'Follow along as we set up your account and add your first contacts and deals.',
        },
        {
          title: 'Navigating the Dashboard',
          duration: '8:45',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/dashboard.jpg',
          description: 'Understand your dashboard metrics and how to customize your view.',
        },
      ]
    },
    {
      title: 'Contact Management',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      videos: [
        {
          title: 'Adding and Managing Contacts',
          duration: '10:20',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/contacts.jpg',
          description: 'Learn how to add contacts, update information, and organize with tags.',
        },
        {
          title: 'Importing Contacts from CSV',
          duration: '12:15',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/import-csv.jpg',
          description: 'Step-by-step guide to bulk importing contacts from spreadsheets.',
        },
        {
          title: 'Lead Scoring Best Practices',
          duration: '9:30',
          level: 'Advanced',
          thumbnail: '/videos/thumbnails/lead-scoring.jpg',
          description: 'Master lead scoring to prioritize your hottest prospects.',
        },
      ]
    },
    {
      title: 'Deals & Pipeline',
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      videos: [
        {
          title: 'Creating and Managing Deals',
          duration: '11:45',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/deals.jpg',
          description: 'Track sales opportunities from first contact to closed won.',
        },
        {
          title: 'Pipeline Management Strategies',
          duration: '14:30',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/pipeline.jpg',
          description: 'Optimize your sales pipeline for maximum conversion rates.',
        },
        {
          title: 'Revenue Forecasting',
          duration: '13:20',
          level: 'Advanced',
          thumbnail: '/videos/thumbnails/forecasting.jpg',
          description: 'Use deal data to accurately forecast revenue and plan growth.',
        },
      ]
    },
    {
      title: 'AI Voice & Calls',
      icon: Phone,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      videos: [
        {
          title: 'Understanding AI Call Analytics',
          duration: '16:00',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/call-analytics.jpg',
          description: 'Discover how AI analyzes every call to provide actionable insights.',
        },
        {
          title: 'Using Call Transcripts Effectively',
          duration: '10:45',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/transcripts.jpg',
          description: 'Learn to review transcripts and extract key information quickly.',
        },
        {
          title: 'Sentiment Analysis Deep Dive',
          duration: '12:30',
          level: 'Advanced',
          thumbnail: '/videos/thumbnails/sentiment.jpg',
          description: 'Master sentiment analysis to understand customer emotions and reactions.',
        },
      ]
    },
    {
      title: 'Analytics & Reporting',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      videos: [
        {
          title: 'Dashboard Metrics Explained',
          duration: '9:15',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/metrics.jpg',
          description: 'Understand every metric on your dashboard and what they mean.',
        },
        {
          title: 'Creating Custom Reports',
          duration: '15:45',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/reports.jpg',
          description: 'Build custom reports to track the metrics that matter to you.',
        },
        {
          title: 'Advanced Analytics Techniques',
          duration: '18:20',
          level: 'Advanced',
          thumbnail: '/videos/thumbnails/advanced-analytics.jpg',
          description: 'Use advanced analytics to uncover hidden insights in your data.',
        },
      ]
    },
    {
      title: 'Email & Automation',
      icon: Mail,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
      videos: [
        {
          title: 'Creating Email Templates',
          duration: '8:30',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/email-templates.jpg',
          description: 'Design professional email templates with personalization.',
        },
        {
          title: 'Setting Up Email Automation',
          duration: '13:45',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/automation.jpg',
          description: 'Automate your email campaigns to nurture leads on autopilot.',
        },
        {
          title: 'Advanced Personalization',
          duration: '11:20',
          level: 'Advanced',
          thumbnail: '/videos/thumbnails/personalization.jpg',
          description: 'Use dynamic variables and conditions for hyper-personalized emails.',
        },
      ]
    },
    {
      title: 'Settings & Configuration',
      icon: Settings,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      videos: [
        {
          title: 'Account Setup & Configuration',
          duration: '10:00',
          level: 'Beginner',
          thumbnail: '/videos/thumbnails/setup.jpg',
          description: 'Complete your account setup and configure preferences.',
        },
        {
          title: 'Team Management & Permissions',
          duration: '12:30',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/team.jpg',
          description: 'Add team members and manage roles and permissions.',
        },
        {
          title: 'Integration Setup Guide',
          duration: '14:45',
          level: 'Intermediate',
          thumbnail: '/videos/thumbnails/integrations.jpg',
          description: 'Connect Google Calendar, phone systems, and other tools.',
        },
      ]
    },
  ]

  return (
    <div className="space-y-8 p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
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
          Video Tutorials
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn by watching - step-by-step video guides for every feature
        </p>
      </div>

      {/* Video Categories */}
      <div className="space-y-8">
        {videoCategories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-md ${category.bgColor}`}>
                  <Icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.videos.map((video) => (
                  <Card key={video.title} className="premium-card-hover cursor-pointer group">
                    <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-lg overflow-hidden">
                      {/* Placeholder thumbnail */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-6 rounded-full bg-black/20 group-hover:bg-black/30 transition-colors">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-base leading-tight">{video.title}</CardTitle>
                        <Badge variant={
                          video.level === 'Beginner' ? 'default' : 
                          video.level === 'Intermediate' ? 'secondary' : 
                          'outline'
                        }>
                          {video.level}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {video.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full gap-2" variant="outline">
                        <Play className="h-4 w-4" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming Soon */}
      <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">More Videos Coming Soon!</CardTitle>
          <CardDescription className="text-blue-100">
            We&apos;re constantly adding new tutorials. Subscribe to get notified when new videos are released.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-white text-blue-600 hover:bg-gray-100">
            Subscribe for Updates
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

