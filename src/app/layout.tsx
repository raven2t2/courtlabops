import type { Metadata } from "next"
import "./globals.css"

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
        <main className="min-h-screen w-full bg-bg-primary">{children}</main>
      </body>
    </html>
  )
}
