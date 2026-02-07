"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  CalendarDays,
  Crosshair,
  Flame,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  UserCheck,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Leads", href: "/leads", badge: "18" },
  { icon: Mail, label: "Campaigns", href: "/campaigns" },
  { icon: UserCheck, label: "Coaches", href: "/coaches" },
  { icon: Crosshair, label: "Competitors", href: "/competitors" },
  { icon: CalendarDays, label: "Events", href: "/events" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <>
      <div className="border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-border-default">
            <Image src="/courtlab-logo.jpg" alt="CourtLab" width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-text-primary">CourtLab</p>
            <p className="text-[11px] text-text-muted">Operations Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-hyper-blue-muted text-hyper-blue"
                  : "text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-hyper-blue text-white" : "bg-bg-tertiary text-text-muted"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-accent-amber/20 bg-accent-amber/5 p-3.5">
        <div className="mb-1 flex items-center gap-1.5">
          <Flame size={12} className="text-accent-amber" />
          <span className="text-[11px] font-bold text-accent-amber">Action Required</span>
        </div>
        <p className="text-[11px] leading-relaxed text-text-secondary">Easter Classic booth reservation closes in 8 weeks.</p>
      </div>

      <div className="border-t border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hyper-blue text-[11px] font-bold text-white">MR</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-text-primary">Michael Ragland</p>
            <p className="text-[11px] text-text-muted">Founder</p>
          </div>
        </div>
      </div>
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-bg-sidebar text-white lg:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen ? (
        <button
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-border-subtle bg-bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}
