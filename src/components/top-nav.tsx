"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Bell,
  Calendar,
  ChevronDown,
  Crosshair,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Campaigns", href: "/campaigns", icon: Target },
  { label: "Coaches", href: "/coaches", icon: Trophy },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Competitors", href: "/competitors", icon: Crosshair },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function TopNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/90 bg-bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border-default bg-bg-secondary">
                <Image
                  src="/courtlab-main-logo.png"
                  alt="CourtLab logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-base font-bold tracking-tight text-text-primary">CourtLab</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Mission Control</p>
              </div>
            </Link>

            <button className="hidden items-center gap-1 rounded-lg border border-border-default bg-bg-secondary px-2.5 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary md:inline-flex">
              Workspace
              <ChevronDown size={13} />
            </button>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-bg-tertiary text-text-primary"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <label className="hidden h-9 items-center gap-2 rounded-xl border border-border-default bg-bg-secondary px-3 lg:flex">
              <Search size={14} className="text-text-muted" />
              <input
                type="text"
                placeholder="Search workspace"
                className="w-48 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
            </label>

            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-default bg-bg-secondary text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
              aria-label="View alerts"
            >
              <Bell size={16} />
            </button>

            <button className="hidden items-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-hyper-blue-hover sm:inline-flex">
              <Plus size={14} />
              New Task
            </button>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-default bg-bg-secondary text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border-subtle bg-bg-secondary transition-all duration-300 lg:hidden",
          mobileMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex w-full max-w-[1700px] flex-col gap-1 px-4 py-3 sm:px-6">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-bg-tertiary text-text-primary"
                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}

          <button className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-hyper-blue-hover sm:hidden">
            <Plus size={14} />
            New Task
          </button>
        </nav>
      </div>
    </header>
  )
}
