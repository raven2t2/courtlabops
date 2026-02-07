import type { Metadata } from "next"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

export const metadata: Metadata = {
  title: "CourtLab CRM",
  description: "Go-to-Market Engine for CourtLab Basketball",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <div className="min-h-screen lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
          <Sidebar />
          <main className="min-w-0 bg-bg-primary">{children}</main>
        </div>
      </body>
    </html>
  )
}
