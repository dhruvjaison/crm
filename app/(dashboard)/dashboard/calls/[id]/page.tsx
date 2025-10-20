import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, DollarSign, ArrowLeft, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function CallDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const call = await prisma.call.findUnique({
    where: { id: params.id },
    include: {
      contact: true,
    },
  })

  if (!call) {
    notFound()
  }

  // Check access
  if (session.user.role !== 'SUPER_ADMIN' && call.tenantId !== session.user.tenantId) {
    redirect('/dashboard/calls')
  }

  const getSentimentColor = (sentiment: string | null) => {
    const colors: Record<string, string> = {
      POSITIVE: 'text-green-600 bg-green-50 dark:bg-green-950',
      NEUTRAL: 'text-amber-600 bg-amber-50 dark:bg-amber-950',
      NEGATIVE: 'text-red-600 bg-red-50 dark:bg-red-950',
    }
    return sentiment ? colors[sentiment] : colors.NEUTRAL
  }

  const keyMoments = call.keyMoments ? (typeof call.keyMoments === 'string' ? JSON.parse(call.keyMoments) : call.keyMoments) : []

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/calls">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calls
        </Link>
      </Button>

      {/* Call Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-lg ${
            call.direction === 'INBOUND' 
              ? 'bg-blue-50 dark:bg-blue-950' 
              : 'bg-purple-50 dark:bg-purple-950'
          }`}>
            {call.direction === 'INBOUND' ? (
              <PhoneIncoming className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <PhoneOutgoing className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {call.contact 
                ? `${call.contact.firstName} ${call.contact.lastName}`
                : call.phoneNumber
              }
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(call.createdAt), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
            </p>
          </div>
        </div>
        {call.sentiment && (
          <Badge className={`${getSentimentColor(call.sentiment)} text-lg px-4 py-2`}>
            {call.sentiment.toLowerCase()} sentiment
          </Badge>
        )}
      </div>

      {/* Call Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              ${(call.totalCost || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              @ ${call.costPerMinute}/min
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {call.sentimentScore ? (call.sentimentScore * 100).toFixed(0) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {call.sentimentScore && call.sentimentScore > 0 ? 'Positive' : call.sentimentScore && call.sentimentScore < 0 ? 'Negative' : 'Neutral'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Intent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">
              {call.detectedIntent?.replace('_', ' ') || 'Unknown'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {call.summary && (
        <Card>
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{call.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Alert */}
      {call.followUpNeeded && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertCircle className="h-5 w-5" />
              Follow-up Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-900 dark:text-orange-300">
              {call.followUpNotes || 'This call requires follow-up action.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Moments */}
      {Array.isArray(keyMoments) && keyMoments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Moments</CardTitle>
            <CardDescription>Important timestamps in the conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keyMoments.map((moment: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">{moment.timestamp}</Badge>
                  <div>
                    <p className="font-medium">{moment.label}</p>
                    <p className="text-sm text-muted-foreground">{moment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords & Topics */}
      {(call.keywords?.length > 0 || call.topics?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Keywords & Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {call.topics && call.topics.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {call.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {call.keywords && call.keywords.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {call.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Transcript */}
      {call.transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Full Transcript</CardTitle>
            <CardDescription>Complete conversation transcription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {call.transcript}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

