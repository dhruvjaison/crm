import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { InteractiveOnboarding } from '@/components/onboarding/interactive-onboarding'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <DashboardNav session={session} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader session={session} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Onboarding Tour */}
      <InteractiveOnboarding />
    </div>
  )
}

