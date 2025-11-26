import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, Phone, Building, Calendar, TrendingUp, PhoneCall } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ContactActions } from '@/components/contacts/contact-actions'

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  const contact = await prisma.contact.findFirst({
    where: { 
      id,
      tenantId: session.user.tenantId 
    },
    include: {
      calls: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      deals: {
        include: { stage: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!contact) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      LEAD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      QUALIFIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      CUSTOMER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    }
    return colors[status] || colors.LEAD
  }

  const getSentimentColor = (sentiment: string | null) => {
    if (!sentiment) return 'bg-gray-100 text-gray-800'
    const colors: Record<string, string> = {
      POSITIVE: 'bg-green-100 text-green-800',
      NEUTRAL: 'bg-amber-100 text-amber-800',
      NEGATIVE: 'bg-red-100 text-red-800',
    }
    return colors[sentiment] || colors.NEUTRAL
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/contacts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-muted-foreground">{contact.company || 'Contact Details'}</p>
        </div>
        <ContactActions contact={contact} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="mt-1">{contact.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="mt-1">{contact.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company
                  </label>
                  <p className="mt-1">{contact.company || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Recent Calls ({contact.calls.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contact.calls.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No calls yet</p>
              ) : (
                <div className="space-y-2">
                  {contact.calls.map((call) => (
                    <Link 
                      key={call.id} 
                      href={`/dashboard/calls/${call.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSentimentColor(call.sentiment)}>
                              {call.sentiment?.toLowerCase() || 'neutral'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(call.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm truncate">{call.summary || 'No summary'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {call.duration ? `${Math.floor(call.duration / 60)}m` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deals */}
          <Card>
            <CardHeader>
              <CardTitle>Associated Deals ({contact.deals.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.deals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No deals yet</p>
              ) : (
                <div className="space-y-2">
                  {contact.deals.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/dashboard/deals/${deal.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-muted-foreground">{deal.stage.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-cyan-600">
                            ${deal.value?.toLocaleString() || 0}
                          </p>
                          <Badge>{deal.status}</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Lead Score
                </label>
                <p className="text-2xl font-bold text-cyan-600 mt-1">{contact.leadScore}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </label>
                <p className="text-sm mt-1">{format(new Date(contact.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Calls</label>
                <p className="text-2xl font-bold mt-1">{contact.calls.length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Active Deals</label>
                <p className="text-2xl font-bold mt-1">
                  {contact.deals.filter(d => d.status === 'OPEN').length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

