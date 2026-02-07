"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard, Users, Target, Trophy, Calendar,
  Crosshair, Settings, Flame, MoreVertical, Menu, X
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Leads", href: "/leads", badge: "18" },
  { icon: Target, label: "Campaigns", href: "/campaigns" },
  { icon: Trophy, label: "Coaches", href: "/coaches" },
  { icon: Crosshair, label: "Competitors", href: "/competitors" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-[#27272A] flex-shrink-0">
          <Image src="/courtlab-logo.jpg" alt="CourtLab" width={36} height={36} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white">CourtLab</div>
          <div className="text-[11px] font-medium text-[#52525B]">Operations Hub</div>
        </div>
      </div>

      <div className="mx-5 h-px bg-[#1E1E24]" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#52525B]">Menu</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                active
                  ? "bg-[#3B82F6]/12 text-[#3B82F6]"
                  : "text-[#71717A] hover:text-white hover:bg-[#18181B]"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  active ? "bg-[#3B82F6] text-white" : "bg-[#18181B] text-[#52525B]"
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Tip */}
      <div className="mx-3 mb-3 p-3.5 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5">
        <div className="flex items-center gap-1.5 mb-1">
          <Flame size={12} className="text-[#F59E0B]" />
          <span className="text-[11px] font-bold text-[#F59E0B]">Action Required</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#A1A1AA]">Easter Classic booth reservation closes in 8 weeks.</p>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-[#1E1E24]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white bg-[#3B82F6]">MR</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate text-white">Michael Ragland</div>
            <div className="text-[11px] text-[#52525B]">Founder</div>
          </div>
          <MoreVertical size={14} className="text-[#52525B]" />
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272A] bg-[#0A0A0D] text-white lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[56] w-[252px] flex flex-col border-r border-[#1E1E24] bg-[#0A0A0D] transition-transform duration-300 lg:hidden ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="w-[252px] flex-shrink-0 flex-col border-r border-[#1E1E24] bg-[#0A0A0D] hidden lg:flex">
        {sidebarContent}
      </aside>
    </>
  )
}
