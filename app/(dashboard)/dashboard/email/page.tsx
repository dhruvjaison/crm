import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { EmailTemplatesClient } from '@/components/email/email-templates-client'

export default async function EmailPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return <EmailTemplatesClient />
}
