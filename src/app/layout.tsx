import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/top-nav";

export const metadata: Metadata = {
  title: "CourtLab CRM",
  description: "Go-to-Market Engine for CourtLab Basketball",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#09090B]">
        <TopNav />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
