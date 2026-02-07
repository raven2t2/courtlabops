"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Target, 
  Settings,
  Trophy,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Clubs", href: "/clubs", icon: Building2 },
  { name: "Campaigns", href: "/campaigns", icon: Target },
  { name: "Coaches", href: "/coaches", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-[#2E2E38] bg-[#16161A] text-white transition-all duration-200 hover:bg-[#1E1E24] lg:hidden",
          isOpen && "border-orange-500/50 bg-orange-500/10"
        )}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[56] flex flex-col border-r border-[#2E2E38] bg-[#0F0F11] transition-all duration-300 ease-out lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo section */}
        <div className={cn(
          "flex h-16 items-center gap-3 border-b border-[#2E2E38] px-4",
          isCollapsed && "justify-center px-2"
        )}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-xl shadow-lg shadow-orange-500/20">
            🏀
          </div>
          {!isCollapsed && (
            <div className="font-bold text-xl tracking-tight">
              <span className="text-white">Court</span>
              <span className="text-orange-500">Lab</span>
            </div>
          )}
          
          {/* Collapse button (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "ml-auto hidden h-6 w-6 items-center justify-center rounded-md border border-[#2E2E38] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300 lg:flex",
              isCollapsed && "absolute -right-3 bg-[#0F0F11]"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-zinc-400 hover:bg-[#1E1E24] hover:text-white",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#2E2E38] p-3">
          <button 
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-[#1E1E24] hover:text-white",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
