import type { Metadata } from "next"
import "./globals.css"
import { AppShell } from "@/components/app-shell"

export const metadata: Metadata = {
  title: "CourtLab CRM",
  description: "Go-to-Market Engine for CourtLab Basketball",
  icons: {
    icon: "/courtlab-main-logo.png",
    shortcut: "/courtlab-main-logo.png",
    apple: "/courtlab-main-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
