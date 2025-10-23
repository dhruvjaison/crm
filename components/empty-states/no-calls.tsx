import { Phone, PlayCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export function NoCalls() {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Phone className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">No calls recorded yet</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Connect your phone system or voice service to automatically track and analyze all your customer calls.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <Link href="/dashboard/integrations">
            <Settings className="mr-2 h-5 w-5" />
            Connect Phone System
          </Link>
        </Button>
      </div>
      
      <div className="mt-8 pt-8 border-t w-full">
        <h4 className="font-medium mb-3">What you&apos;ll get with call tracking:</h4>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <PlayCircle className="h-8 w-8 text-primary/60" />
            <div>
              <span className="font-medium text-foreground">Transcripts</span>
              <p>Automatic transcription of all calls</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary/60" />
            <div>
              <span className="font-medium text-foreground">Analytics</span>
              <p>Sentiment analysis and key insights</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Phone className="h-8 w-8 text-primary/60" />
            <div>
              <span className="font-medium text-foreground">Auto-logging</span>
              <p>Calls automatically linked to contacts</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

