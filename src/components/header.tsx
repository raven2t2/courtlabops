"use client"

import { Search, Bell, User, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      "flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#2E2E38] bg-[#0F0F11] px-4 sm:px-6",
      className
    )}>
      {/* Search - hidden on very small screens, visible on sm+ */}
      <div className="flex-1 max-w-md ml-10 sm:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input 
            placeholder="Search leads, clubs, campaigns..."
            className="h-10 border-[#2E2E38] bg-[#16161A] pl-10 text-sm text-white placeholder:text-zinc-500 focus:border-orange-500 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9 text-zinc-400 hover:bg-[#1E1E24] hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#0F0F11]" />
        </Button>
        
        {/* User profile */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#2E2E38] sm:pl-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-white">Michael Ragland</div>
            <div className="text-xs text-zinc-500">Founder</div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2E2E38] bg-[#16161A] text-zinc-400">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
