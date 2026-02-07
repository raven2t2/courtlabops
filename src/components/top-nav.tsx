"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Trophy,
  Menu,
  X,
  Bell
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Target },
  { name: "Coaches", href: "/coaches", icon: Trophy },
]

export function TopNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#09090B]/95 backdrop-blur-xl border-b border-[#27272A]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#F97316]/20">
              <Image 
                src="/courtlab-logo.jpg" 
                alt="CourtLab" 
                width={40} 
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
              Court<span className="text-[#F97316]">Lab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-[#18181B] text-white" 
                      : "text-[#71717A] hover:text-white hover:bg-[#18181B]/50"
                    }
                  `}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="hidden sm:flex p-2.5 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-xl transition-colors">
              <Bell size={18} />
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 text-[#71717A] hover:text-white hover:bg-[#18181B] rounded-xl transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav with animation */}
      <div 
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${mobileOpen ? 'max-h-64 opacity-100 border-t border-[#27272A]' : 'max-h-0 opacity-0'}
        `}
      >
        <nav className="px-4 py-3 space-y-1 bg-[#0F0F11]">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${isActive 
                    ? "bg-[#18181B] text-white" 
                    : "text-[#71717A] hover:text-white hover:bg-[#18181B]/50"
                  }
                `}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
