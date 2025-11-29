'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, ArrowRight, Check, Sparkles } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OnboardingStep {
  id: string
  title: string
  description: string
  targetPage: string
  targetElement?: string
  action: string
  completionKey: string
  tips: string[]
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your CRM! 👋',
    description: 'Let\'s get you set up in 3 easy steps. We\'ll guide you through adding your first contact, creating a deal, and setting up a task.',
    targetPage: '/dashboard',
    action: 'Start Setup',
    completionKey: 'onboarding_started',
    tips: [
      'This will only take 2-3 minutes',
      'You can skip and come back anytime',
      'We\'ll show you exactly what to click',
    ],
  },
  {
    id: 'add-contact',
    title: 'Step 1: Add Your First Contact 👤',
    description: 'Click the "Add Contact" button in the top right. Fill in at least the name and email, then save.',
    targetPage: '/dashboard/contacts',
    targetElement: 'add-contact-button',
    action: 'Go to Contacts',
    completionKey: 'first_contact_added',
    tips: [
      'You can import multiple contacts from CSV later',
      'Lead scores help prioritize your outreach',
      'Tags make it easy to organize contacts',
    ],
  },
  {
    id: 'create-deal',
    title: 'Step 2: Create Your First Deal 💼',
    description: 'Click "Create Deal", select the contact you just added, set a value, and save. This tracks your sales opportunity.',
    targetPage: '/dashboard/deals',
    targetElement: 'create-deal-button',
    action: 'Go to Deals',
    completionKey: 'first_deal_created',
    tips: [
      'Link deals to contacts to track relationships',
      'Set expected close dates for forecasting',
      'Move deals through pipeline stages as they progress',
    ],
  },
  {
    id: 'create-task',
    title: 'Step 3: Create a Follow-up Task ✅',
    description: 'Click "Create Task" to set a reminder. This could be a follow-up call, email, or meeting.',
    targetPage: '/dashboard/tasks',
    targetElement: 'create-task-button',
    action: 'Go to Tasks',
    completionKey: 'first_task_created',
    tips: [
      'Set due dates to stay on top of follow-ups',
      'Link tasks to deals or contacts',
      'Use priority levels to focus on what matters',
    ],
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    description: 'Great job! You\'ve learned the basics. Explore analytics, set up integrations, or dive into the help docs to learn more.',
    targetPage: '/dashboard',
    action: 'Finish',
    completionKey: 'onboarding_completed',
    tips: [
      'Check Analytics to see your performance',
      'Visit Help for detailed guides',
      'Invite team members in Settings',
    ],
  },
]

export function InteractiveOnboarding() {
  const router = useRouter()
  const pathname = usePathname()
  const [isActive, setIsActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const currentStep = steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  useEffect(() => {
    // Check if onboarding is completed
    const completed = localStorage.getItem('onboarding_completed')
    if (completed) {
      setIsActive(false)
      return
    }

    // Check if user wants to see onboarding
    const dismissed = localStorage.getItem('onboarding_dismissed')
    if (dismissed) {
      setIsActive(false)
      return
    }

    // Load completed steps
    const saved = localStorage.getItem('onboarding_progress')
    if (saved) {
      const progress = JSON.parse(saved)
      setCompletedSteps(new Set(progress.completedSteps))
      setCurrentStepIndex(progress.currentStep || 0)
    }

    // Activate onboarding
    setIsActive(true)
  }, [])

  useEffect(() => {
    // Save progress
    if (isActive) {
      localStorage.setItem('onboarding_progress', JSON.stringify({
        currentStep: currentStepIndex,
        completedSteps: Array.from(completedSteps),
      }))
    }
  }, [currentStepIndex, completedSteps, isActive])

  useEffect(() => {
    // Check for completion events
    const checkCompletion = () => {
      const step = steps[currentStepIndex]
      if (!step) return

      // Check localStorage for completion markers
      const completed = localStorage.getItem(step.completionKey)
      if (completed && !completedSteps.has(step.id)) {
        handleStepComplete(step.id)
      }
    }

    const interval = setInterval(checkCompletion, 1000)
    return () => clearInterval(interval)
  }, [currentStepIndex, completedSteps])

  const handleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(stepId)
    setCompletedSteps(newCompleted)

    toast.success('Step completed! 🎉', {
      description: 'Great job! Moving to the next step...',
    })

    setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1)
      } else {
        handleComplete()
      }
    }, 1500)
  }

  const handleAction = () => {
    const step = steps[currentStepIndex]
    
    if (step.id === 'welcome') {
      // Mark started and go to first real step
      localStorage.setItem('onboarding_started', 'true')
      setCurrentStepIndex(1)
      router.push(steps[1].targetPage)
    } else if (step.id === 'complete') {
      handleComplete()
    } else {
      // Navigate to the target page
      router.push(step.targetPage)
      toast.info('Look for the highlighted button!', {
        description: step.description,
      })
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding_dismissed', 'true')
    setIsActive(false)
    toast.info('Onboarding skipped', {
      description: 'You can restart it anytime from Settings',
    })
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsActive(false)
    toast.success('Onboarding complete! 🎉', {
      description: 'You\'re ready to use your CRM!',
    })
  }

  if (!isActive) return null

  // Position the card based on current page
  const isOnTargetPage = pathname === currentStep.targetPage
  const cardPosition = isOnTargetPage ? 'bottom-right' : 'center'

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" />

      {/* Onboarding Card */}
      <div
        className={`fixed z-50 ${
          cardPosition === 'center'
            ? 'inset-0 flex items-center justify-center p-4'
            : 'bottom-6 right-6'
        }`}
      >
        <Card className={`shadow-2xl border-2 border-primary/20 ${
          cardPosition === 'center' ? 'w-full max-w-lg' : 'w-96'
        }`}>
          <CardHeader className="relative pb-3">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Quick Setup
              </span>
            </div>
            <CardTitle className="text-xl">{currentStep.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {currentStep.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Step {currentStepIndex + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Tips */}
            {currentStep.tips && currentStep.tips.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  💡 Tips
                </p>
                {currentStep.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                    • {tip}
                  </p>
                ))}
              </div>
            )}

            {/* Action Button */}
            <div className="flex gap-2 pt-2">
              {currentStep.id !== 'welcome' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip Setup
                </Button>
              )}
              <Button
                onClick={handleAction}
                size="sm"
                className="flex-1"
              >
                {currentStep.id === 'complete' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Finish
                  </>
                ) : (
                  <>
                    {currentStep.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlight target element if on correct page */}
      {isOnTargetPage && currentStep.targetElement && (
        <style jsx global>{`
          [data-onboarding="${currentStep.targetElement}"] {
            position: relative;
            z-index: 45;
            animation: pulse-border 2s ease-in-out infinite;
          }
          
          @keyframes pulse-border {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7),
                          0 0 20px 5px rgba(59, 130, 246, 0.3);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(59, 130, 246, 0),
                          0 0 30px 10px rgba(59, 130, 246, 0.1);
            }
          }
        `}</style>
      )}
    </>
  )
}

