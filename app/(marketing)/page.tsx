'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Users, 
  TrendingUp, 
  Zap, 
  Shield, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Building2,
  Clock,
  DollarSign,
  Bot,
  MessageSquare,
  Calendar,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Target,
  Headphones,
  PieChart,
  LineChart,
  Workflow
} from 'lucide-react'

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Bot,
      title: 'AI Voice Agents',
      description: 'Intelligent voice agents that handle calls 24/7, qualify leads, and book appointments automatically.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Contact Management',
      description: 'Organize your entire customer database with smart lead scoring, tags, and automated segmentation.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Deal Pipeline',
      description: 'Visual pipeline management to track every opportunity from first contact to closed deal.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards showing call metrics, revenue trends, and AI performance insights.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: MessageSquare,
      title: 'Call Intelligence',
      description: 'AI-powered transcripts, sentiment analysis, and actionable insights from every conversation.',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Track your ROI with real-time cost comparisons vs traditional call centers. Save up to 95%.',
      gradient: 'from-amber-500 to-yellow-500',
    },
  ]

  const useCases = [
    {
      industry: 'Healthcare',
      title: 'Patient Scheduling & Follow-ups',
      description: 'HIPAA-compliant AI agents that handle appointment scheduling, reminders, and patient inquiries 24/7.',
      results: ['60% reduction in no-shows', '24/7 availability', '90% patient satisfaction'],
      icon: Headphones,
    },
    {
      industry: 'Real Estate',
      title: 'Lead Qualification & Tours',
      description: 'AI agents that qualify buyers, answer property questions, and schedule showings instantly.',
      results: ['3x more qualified leads', '50% faster response time', '40% more tours booked'],
      icon: Building2,
    },
    {
      industry: 'Insurance',
      title: 'Quote Requests & Claims',
      description: 'Handle policy inquiries, collect quote information, and process claims efficiently.',
      results: ['75% cost reduction', '2x quote completion', 'Instant claim filing'],
      icon: Shield,
    },
    {
      industry: 'Home Services',
      title: 'Service Booking & Dispatch',
      description: 'Book service appointments, dispatch technicians, and handle emergency calls round the clock.',
      results: ['Never miss a call', '35% more bookings', '24/7 emergency support'],
      icon: Workflow,
    },
  ]

  const stats = [
    { value: '95%', label: 'Cost Savings vs Call Centers' },
    { value: '24/7', label: 'AI Agent Availability' },
    { value: '< 1s', label: 'Average Response Time' },
    { value: '10x', label: 'ROI for Clients' },
  ]

  const testimonials = [
    {
      quote: "Claro Strategy transformed our lead handling. We went from missing 40% of calls to capturing every single opportunity.",
      author: "Sarah Chen",
      role: "VP of Sales, TechFlow Inc",
      rating: 5,
    },
    {
      quote: "The AI voice agents are indistinguishable from human agents. Our patients love the instant responses.",
      author: "Dr. Michael Roberts",
      role: "Practice Manager, Wellness Medical",
      rating: 5,
    },
    {
      quote: "We cut our call center costs by 85% while actually improving customer satisfaction. Game changer.",
      author: "James Wilson",
      role: "CEO, Premier Insurance Group",
      rating: 5,
    },
  ]

  const pricingFeatures = [
    'AI Voice Agents (Managed)',
    'Unlimited Contacts',
    'Deal Pipeline Management',
    'Call Transcripts & Analytics',
    'Sentiment Analysis',
    'Cost Savings Dashboard',
    'Email Templates',
    'Task Management',
    'Team Collaboration',
    'Priority Support',
    'Custom Integrations',
    'Dedicated Account Manager',
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/95 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/clarostrategy crop.png"
                alt="Claro Strategy"
                width={180}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#use-cases" className="text-sm text-slate-300 hover:text-white transition-colors">
                Use Cases
              </a>
              <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm text-slate-300 hover:text-white transition-colors">
                Testimonials
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-white">Features</a>
              <a href="#use-cases" className="block text-slate-300 hover:text-white">Use Cases</a>
              <a href="#pricing" className="block text-slate-300 hover:text-white">Pricing</a>
              <a href="#testimonials" className="block text-slate-300 hover:text-white">Testimonials</a>
              <div className="pt-4 space-y-3">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-white/20">Sign In</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered CRM for Modern Businesses
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Your AI Sales Team</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                That Never Sleeps
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Claro Strategy combines intelligent AI voice agents with powerful CRM tools to help you 
              capture every lead, close more deals, and save up to 95% on call center costs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-6 text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>24/7 AI Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Setup in Minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
                <div className="bg-slate-900 p-1">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-xs text-slate-500">crm.clarostrategy.com/dashboard</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 aspect-video flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                    {/* Mock Dashboard Cards */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                      <div className="text-slate-400 text-xs mb-2">Total Contacts</div>
                      <div className="text-2xl font-bold text-white">2,847</div>
                      <div className="text-green-400 text-xs mt-1">↑ 12% this month</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                      <div className="text-slate-400 text-xs mb-2">Active Deals</div>
                      <div className="text-2xl font-bold text-white">$1.2M</div>
                      <div className="text-green-400 text-xs mt-1">↑ 8% this month</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                      <div className="text-slate-400 text-xs mb-2">Cost Savings</div>
                      <div className="text-2xl font-bold text-cyan-400">$45,230</div>
                      <div className="text-cyan-400 text-xs mt-1">vs call center</div>
                    </div>
                    <div className="col-span-2 bg-slate-800/50 rounded-lg p-4 border border-white/5">
                      <div className="text-slate-400 text-xs mb-3">Revenue Trend</div>
                      <div className="flex items-end gap-1 h-16">
                        {[40, 55, 45, 60, 75, 65, 80, 90, 85, 95, 88, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                      <div className="text-slate-400 text-xs mb-2">AI Calls Today</div>
                      <div className="text-2xl font-bold text-white">347</div>
                      <div className="text-blue-400 text-xs mt-1">98% answered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Scale</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete CRM platform with AI-powered voice agents, intelligent analytics, and tools to grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-900/50 border-white/5 hover:border-white/10 transition-all group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
              Use Cases
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Built for
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Your Industry</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              See how businesses across industries use Claro Strategy to transform their operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-slate-800/50 border-white/5 overflow-hidden group hover:border-white/10 transition-all">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs border-white/20 text-slate-300">
                        {useCase.industry}
                      </Badge>
                      <h3 className="text-xl font-semibold text-white">{useCase.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 mb-6 leading-relaxed">{useCase.description}</p>
                  <div className="space-y-2">
                    {useCase.results.map((result, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-slate-300">{result}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Loved by
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Industry Leaders</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-900/50 border-white/5">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              Pricing
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Simple,
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Transparent Pricing</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We manage everything for you. One monthly subscription, unlimited potential.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
              <CardContent className="p-8 relative">
                <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Managed Service
                </Badge>
                <div className="mb-6">
                  <div className="text-slate-400 text-sm mb-1">Starting at</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">Custom</span>
                  </div>
                  <div className="text-slate-400 text-sm mt-2">Tailored to your business needs</div>
                </div>

                <div className="space-y-3 mb-8">
                  {pricingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-6 text-lg shadow-lg shadow-blue-500/25">
                    Schedule a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="text-center text-slate-500 text-sm mt-4">
                  No credit card required • 14-day free trial
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Sales Process?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of businesses using Claro Strategy to capture more leads, close more deals, and save thousands on operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Image
                src="/clarostrategy crop.png"
                alt="Claro Strategy"
                width={150}
                height={40}
                className="h-8 w-auto mb-4"
              />
              <p className="text-slate-400 text-sm max-w-md">
                Claro Strategy provides AI-powered CRM and voice agent solutions that help businesses 
                capture every opportunity and scale efficiently.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Claro Strategy. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <Shield className="h-5 w-5" />
              <span className="text-sm">HIPAA Compliant</span>
              <span className="text-slate-700">|</span>
              <span className="text-sm">SOC 2 Type II</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

