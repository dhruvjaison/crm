'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  TrendingUp, 
  DollarSign, 
  Mail, 
  CheckSquare,
  Settings,
  Briefcase,
  Building2,
  Plug,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface DashboardNavProps {
  session: Session
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Contacts',
    href: '/dashboard/contacts',
    icon: Users,
  },
  {
    title: 'Deals',
    href: '/dashboard/deals',
    icon: Briefcase,
  },
  {
    title: 'Calls',
    href: '/dashboard/calls',
    icon: Phone,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
  },
  {
    title: 'Cost Savings',
    href: '/dashboard/cost-savings',
    icon: DollarSign,
  },
  {
    title: 'Email',
    href: '/dashboard/email',
    icon: Mail,
  },
  {
    title: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Integrations',
    href: '/dashboard/integrations',
    icon: Plug,
  },
  {
    title: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

// Super Admin only items
const adminNavItems = [
  {
    title: 'All Tenants',
    href: '/dashboard/admin/tenants',
    icon: Building2,
  },
]

export function DashboardNav({ session }: DashboardNavProps) {
  const pathname = usePathname()
  const isSuperAdmin = session.user.role === 'SUPER_ADMIN'

  return (
    <aside className="w-64 border-r bg-white dark:bg-gray-950 hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
      <div className="px-6 py-6 border-b flex items-center justify-center">
        <Link href="/dashboard" className="block group">
          <img 
            src="/clarostrategy-crop.png" 
            alt="Claro Strategy" 
            className="h-16 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
      </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out relative group',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 dark:from-cyan-950 dark:to-blue-950 dark:text-cyan-400 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:translate-x-1'
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  {item.title}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-r-full" />
                  )}
                </Link>
            )
          })}

          {isSuperAdmin && (
            <>
              <div className="pt-4 pb-2">
                <Badge variant="outline" className="text-xs">Super Admin</Badge>
              </div>
              {adminNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                
                return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out relative group',
                        isActive
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 dark:from-purple-950 dark:to-pink-950 dark:text-purple-400 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:translate-x-1'
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )} />
                      {item.title}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-r-full" />
                      )}
                    </Link>
                )
              })}
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="text-sm">
            <p className="font-medium truncate">{session.user.name || session.user.email}</p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

