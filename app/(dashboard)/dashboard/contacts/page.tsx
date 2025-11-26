import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Building } from 'lucide-react'
import Link from 'next/link'
import { AddContactButton } from '@/components/contacts/contacts-client'
import { NoContacts } from '@/components/empty-states'

export default async function ContactsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const contacts = await prisma.contact.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      LEAD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      QUALIFIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      CUSTOMER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    }
    return colors[status] || colors.LEAD
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your leads and customers
          </p>
        </div>
        <AddContactButton />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'LEAD').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qualified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'QUALIFIED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'CUSTOMER').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>
            {contacts.length} contacts in your CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <NoContacts />
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                    {contact.firstName[0]}{contact.lastName[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                      {contact.leadScore >= 70 && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          🔥 Hot Lead
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {contact.company}
                        </span>
                      )}
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                      )}
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium">Lead Score</p>
                    <p className="text-lg font-bold text-cyan-600">{contact.leadScore}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/contacts/${contact.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

