"use client"

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Inbox, 
  FolderKanban, Settings, LogOut, ShieldIcon, Moon, Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: FolderKanban,
    },
    {
      name: 'Contacts',
      href: '/dashboard/contacts',
      icon: Inbox,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  return (
    <div className={cn(
      "flex flex-col border-r bg-card transition-all duration-300",
      expanded ? "w-64" : "w-20",
      className
    )}>
      <div className="flex items-center h-16 px-4 border-b">
        {expanded ? (
          <div className="flex items-center gap-2 text-primary">
            <ShieldIcon className="h-6 w-6" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <ShieldIcon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-3 -right-4 h-8 w-8 rounded-full border shadow-md bg-background"
        onClick={() => setExpanded(prev => !prev)}
      >
        {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={expanded ? 1000 : 0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href={item.href} 
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground transition-colors hover:text-foreground",
                      pathname === item.href && "bg-accent text-foreground font-medium",
                      !expanded && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", pathname === item.href && "text-primary")} />
                    {expanded && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {!expanded && <TooltipContent side="right">{item.name}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <div className={cn(
          "flex items-center gap-3 pb-4",
          !expanded && "justify-center",
        )}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          
          {expanded && <span className="text-muted-foreground">Theme</span>}
        </div>
        
        <div className={cn(
          "flex items-center gap-3",
          !expanded && "flex-col",
        )}>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Admin User" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          
          {expanded && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@example.com</span>
            </div>
          )}
        </div>
        
        <Link href="/login">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full mt-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              !expanded && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {expanded && "Log out"}
          </Button>
        </Link>
      </div>
    </div>
  )
}