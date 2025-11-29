'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface WalkthroughStep {
  id: string
  title: string
  description: string
  page: string
  element?: string
  tips: string[]
  actions?: {
    label: string
    description: string
  }[]
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Your command center. See key metrics, recent activity, and quick actions.',
    page: '/dashboard',
    tips: [
      'Metrics update in real-time as you add data',
      'Click any metric card to see detailed views',
      'Charts show trends over the last 7-30 days',
    ],
  },
  {
    id: 'contacts',
    title: 'Managing Contacts',
    description: 'Your customer database. Add, edit, and organize all your contacts here.',
    page: '/dashboard/contacts',
    element: 'add-contact-button',
    tips: [
      'Use lead scores (0-100) to prioritize outreach',
      'Tags help organize contacts by category',
      'Import CSV to add multiple contacts at once',
    ],
    actions: [
      { label: 'Add Contact', description: 'Create a new contact manually' },
      { label: 'Import CSV', description: 'Bulk import from spreadsheet' },
      { label: 'Edit Contact', description: 'Click any contact to view/edit details' },
    ],
  },
  {
    id: 'deals',
    title: 'Deal Pipeline',
    description: 'Track sales opportunities from discovery to close. Visualize your pipeline stages.',
    page: '/dashboard/deals',
    element: 'create-deal-button',
    tips: [
      'Link deals to contacts to track relationships',
      'Set expected close dates for forecasting',
      'Drag deals between stages (future feature)',
      'Pipeline value shows total potential revenue',
    ],
    actions: [
      { label: 'Create Deal', description: 'Start tracking a new opportunity' },
      { label: 'Link Contact', description: 'Associate deal with a contact' },
      { label: 'Set Value', description: 'Enter potential deal value' },
      { label: 'Choose Stage', description: 'Select where in pipeline' },
    ],
  },
  {
    id: 'tasks',
    title: 'Task Management',
    description: 'Never miss a follow-up. Create tasks, set priorities, and track completion.',
    page: '/dashboard/tasks',
    element: 'create-task-button',
    tips: [
      'Set due dates to stay organized',
      'Use priorities: High, Medium, Low',
      'Link tasks to deals or contacts',
      'Filter by status to focus on what matters',
    ],
    actions: [
      { label: 'Add Task', description: 'Create a new task or reminder' },
      { label: 'Set Priority', description: 'Mark as High/Medium/Low' },
      { label: 'Set Due Date', description: 'Add deadline for completion' },
      { label: 'Mark Complete', description: 'Check off when done' },
    ],
  },
  {
    id: 'calls',
    title: 'AI Call Intelligence',
    description: 'View call logs, transcripts, and AI-powered insights from your voice agents.',
    page: '/dashboard/calls',
    tips: [
      'AI analyzes sentiment automatically',
      'Transcripts are searchable',
      'Key insights highlight important moments',
      'Filter by sentiment: Positive, Neutral, Negative',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    description: 'Deep dive into your performance. Revenue trends, pipeline funnel, and top performers.',
    page: '/dashboard/analytics',
    tips: [
      'Revenue chart shows monthly trends',
      'Pipeline funnel reveals conversion rates',
      'Top performers ranked by closed deals',
      'Export data for custom reports (future)',
    ],
  },
  {
    id: 'cost-savings',
    title: 'Cost Savings Calculator',
    description: 'See how much you\'re saving vs traditional call centers. Real-time ROI tracking.',
    page: '/dashboard/cost-savings',
    tips: [
      'Compares AI voice agents vs traditional costs',
      'Updates automatically as calls increase',
      'Shows monthly and all-time savings',
      'Industry average: $1.25/min vs $0.05/min',
    ],
  },
  {
    id: 'email',
    title: 'Email Templates',
    description: 'Create reusable email templates with dynamic variables for personalization.',
    page: '/dashboard/email',
    tips: [
      'Use {{firstName}} for personalization',
      'Preview shows how email will look',
      'Templates save time on common messages',
      'Edit anytime to update messaging',
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect your tools. AI voice agents, calendar sync, email, and more.',
    page: '/dashboard/integrations',
    tips: [
      'AI Voice Agents managed for you',
      'Test integrations before going live',
      'Webhook URL for custom integrations',
      'Contact support for new integrations',
    ],
  },
  {
    id: 'settings',
    title: 'Settings & Team',
    description: 'Manage your organization, team members, and account preferences.',
    page: '/dashboard/settings',
    tips: [
      'Edit organization name',
      'Invite team members with roles',
      'Deactivate users without deleting',
      'Branding customization coming soon',
    ],
  },
]

export function GuidedWalkthrough() {
  const router = useRouter()
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set())

  const step = walkthroughSteps[currentStep]
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100
  const isOnCorrectPage = pathname === step.page

  useEffect(() => {
    // Check if walkthrough is active
    const active = localStorage.getItem('walkthrough_active')
    if (active === 'true') {
      setIsActive(true)
      const savedStep = localStorage.getItem('walkthrough_step')
      if (savedStep) {
        setCurrentStep(parseInt(savedStep))
      }
    }
  }, [])

  useEffect(() => {
    // Save progress
    if (isActive) {
      localStorage.setItem('walkthrough_step', currentStep.toString())
      
      // Mark step as visited
      const newVisited = new Set(visitedSteps)
      newVisited.add(step.id)
      setVisitedSteps(newVisited)
    }
  }, [currentStep, isActive])

  const startWalkthrough = () => {
    localStorage.setItem('walkthrough_active', 'true')
    setIsActive(true)
    setCurrentStep(0)
    setVisitedSteps(new Set())
    router.push(walkthroughSteps[0].page)
    toast.success('Walkthrough started!', {
      description: 'Navigate at your own pace',
    })
  }

  const endWalkthrough = () => {
    localStorage.removeItem('walkthrough_active')
    localStorage.removeItem('walkthrough_step')
    setIsActive(false)
    toast.info('Walkthrough ended', {
      description: 'You can restart it anytime from Help',
    })
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
    router.push(walkthroughSteps[index].page)
  }

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      goToStep(currentStep + 1)
    } else {
      toast.success('Walkthrough complete! 🎉', {
        description: 'You\'ve explored all features',
      })
      endWalkthrough()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }

  const handleNavigate = () => {
    if (!isOnCorrectPage) {
      router.push(step.page)
      toast.info('Navigating...', {
        description: `Going to ${step.title}`,
      })
    }
  }

  if (!isActive) {
    return (
      <Button onClick={startWalkthrough} size="lg" className="w-full">
        <Play className="h-5 w-5 mr-2" />
        Start Interactive Walkthrough
      </Button>
    )
  }

  return (
    <>
      {/* Subtle backdrop - doesn't block interaction */}
      <div className="fixed inset-0 z-30 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Floating Navigation Card */}
      <div className="fixed bottom-6 right-6 z-40 w-96">
        <Card className="shadow-2xl border-2 border-primary/20">
          {/* Header with minimize */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="gap-1">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                Walkthrough Active
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={endWalkthrough}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription className="text-sm">
                  {step.description}
                </CardDescription>
              </>
            )}
          </CardHeader>

          {!isMinimized && (
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Step {currentStep + 1} of {walkthroughSteps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Navigation to page if not there */}
              {!isOnCorrectPage && (
                <Button 
                  onClick={handleNavigate} 
                  variant="outline" 
                  className="w-full"
                  size="sm"
                >
                  Go to {step.title}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {/* Tips */}
              {step.tips && step.tips.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    💡 Key Points
                  </p>
                  {step.tips.map((tip, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                      • {tip}
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              {step.actions && step.actions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    🎯 Try These Actions
                  </p>
                  {step.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  size="sm"
                  className="flex-1"
                >
                  {currentStep === walkthroughSteps.length - 1 ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Jump */}
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Jump to section ({visitedSteps.size}/{walkthroughSteps.length} visited)
                </summary>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {walkthroughSteps.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goToStep(i)}
                      className={`w-full text-left px-2 py-1 rounded text-xs hover:bg-muted transition-colors ${
                        i === currentStep ? 'bg-primary/10 font-medium' : ''
                      }`}
                    >
                      {i + 1}. {s.title}
                      {visitedSteps.has(s.id) && (
                        <CheckCircle2 className="h-3 w-3 inline ml-1 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </details>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Highlight element if specified */}
      {isOnCorrectPage && step.element && (
        <style jsx global>{`
          [data-onboarding="${step.element}"] {
            position: relative;
            z-index: 35;
            animation: gentle-pulse 3s ease-in-out infinite;
          }
          
          @keyframes gentle-pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4),
                          0 0 15px 3px rgba(59, 130, 246, 0.2);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(59, 130, 246, 0),
                          0 0 25px 8px rgba(59, 130, 246, 0.1);
            }
          }
        `}</style>
      )}
    </>
  )
}

