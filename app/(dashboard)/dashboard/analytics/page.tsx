import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AnalyticsClient } from '@/components/analytics/analytics-client'

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return <AnalyticsClient />
}
