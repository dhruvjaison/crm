'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingStep {
  title: string
  description: string
  action: string
  actionUrl: string
  icon: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Your CRM!',
    description: 'Let\'s take a quick tour to help you get started. This will only take 2 minutes.',
    action: 'Start Tour',
    actionUrl: '',
    icon: '👋',
  },
  {
    title: 'Add Your First Contact',
    description: 'Build your customer database by adding contacts. You can add them manually or import from CSV.',
    action: 'Add Contact',
    actionUrl: '/dashboard/contacts',
    icon: '👥',
  },
  {
    title: 'Create Your First Deal',
    description: 'Track sales opportunities through your pipeline. Link deals to contacts to stay organized.',
    action: 'Create Deal',
    actionUrl: '/dashboard/deals',
    icon: '💼',
  },
  {
    title: 'Set Up Tasks',
    description: 'Never miss a follow-up! Create tasks to remind yourself of important actions.',
    action: 'Create Task',
    actionUrl: '/dashboard/tasks',
    icon: '✅',
  },
  {
    title: 'Explore Analytics',
    description: 'View your performance metrics, revenue trends, and pipeline analytics.',
    action: 'View Analytics',
    actionUrl: '/dashboard/analytics',
    icon: '📊',
  },
  {
    title: 'You\'re All Set!',
    description: 'You\'re ready to start using your CRM. Check out our help documentation anytime you need assistance.',
    action: 'Go to Dashboard',
    actionUrl: '/dashboard',
    icon: '🎉',
  },
]

export function OnboardingTour() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour
    const tourCompleted = localStorage.getItem('onboarding_completed')
    if (!tourCompleted) {
      setIsOpen(true)
    } else {
      setHasSeenTour(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAction = () => {
    const step = onboardingSteps[currentStep]
    if (step.actionUrl) {
      router.push(step.actionUrl)
    }
    if (currentStep === onboardingSteps.length - 1) {
      handleComplete()
    } else {
      handleNext()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsOpen(false)
    setHasSeenTour(true)
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsOpen(false)
    setHasSeenTour(true)
  }

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100
  const step = onboardingSteps[currentStep]

  if (!isOpen || hasSeenTour) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-6xl mb-4">{step.icon}</div>
          <CardTitle className="text-2xl">{step.title}</CardTitle>
          <CardDescription className="text-base">{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tour
            </Button>
          </div>
          <Button onClick={handleAction}>
            {currentStep === onboardingSteps.length - 1 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Finish
              </>
            ) : (
              <>
                {step.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

