import { TrendingUp, Plus, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface NoDealsProps {
  onCreateDeal?: () => void
}

export function NoDeals({ onCreateDeal }: NoDealsProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <TrendingUp className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">No deals in your pipeline</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Track your sales opportunities and move them through your pipeline to close more business.
      </p>
      
      <Button size="lg" onClick={onCreateDeal}>
        <Plus className="mr-2 h-5 w-5" />
        Create Your First Deal
      </Button>
      
      <div className="mt-8 pt-8 border-t w-full">
        <h4 className="font-medium mb-3 flex items-center justify-center gap-2">
          <Lightbulb className="h-4 w-4" />
          What makes a good deal?
        </h4>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="text-left">
            <span className="font-medium text-foreground">Clear value</span>
            <p>Define the deal amount and expected close date</p>
          </div>
          <div className="text-left">
            <span className="font-medium text-foreground">Contact linked</span>
            <p>Associate deals with your contacts and companies</p>
          </div>
          <div className="text-left">
            <span className="font-medium text-foreground">Track progress</span>
            <p>Move deals through stages as they progress</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

