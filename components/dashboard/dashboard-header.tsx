'use client'

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { NotificationsPanel } from './notifications-panel'
import { ThemeToggle } from '@/components/theme-toggle'

interface DashboardHeaderProps {
  session: Session
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const userInitials = session.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : session.user.email?.[0].toUpperCase()

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-700/60 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Left side - could add breadcrumbs or search */}
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
          </h2>
        </div>

        {/* Right side - theme, notifications and user menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <NotificationsPanel />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || undefined} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session.user.role === 'SUPER_ADMIN' && 'Super Admin'}
                    {session.user.role === 'CLIENT_ADMIN' && 'Admin'}
                    {session.user.role === 'CLIENT_USER' && 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                  {session.user.role === 'SUPER_ADMIN' && (
                    <Badge variant="outline" className="w-fit mt-1">
                      Super Admin
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

