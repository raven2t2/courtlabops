"use client"

import { usePathname } from "next/navigation"
import { TopNav } from "@/components/top-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboardRoute = pathname === "/"

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary">
      <TopNav />
      <main className="w-full pb-10">
        {isDashboardRoute ? (
          children
        ) : (
          <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">{children}</div>
        )}
      </main>
    </div>
  )
}
