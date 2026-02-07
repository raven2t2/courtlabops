"use client"

import { useState, useEffect } from "react"
import { Check, X, Instagram, ThumbsUp, AlertCircle, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfigStatus {
  instagram: {
    configured: boolean;
    accountId: string | null;
  };
  facebook: {
    configured: boolean;
    pageId: string | null;
  };
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

export default function SocialSetupPage() {
  const [status, setStatus] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/social')
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      console.error('Failed to check status:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto max-w-2xl p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4">
          <h1 className="text-2xl font-extrabold text-text-primary">Social Media API Setup</h1>
          <p className="text-sm text-text-secondary mt-1">Configure Instagram and Facebook for auto-posting</p>
        </Surface>

        {loading ? (
          <Surface className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-hyper-blue border-t-transparent rounded-full" />
          </Surface>
        ) : (
          <>
            {/* Instagram Status */}
            <Surface className="mb-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  status?.instagram.configured ? "bg-pink-500/10" : "bg-bg-tertiary"
                )}>
                  <Instagram size={24} className={status?.instagram.configured ? "text-pink-500" : "text-text-muted"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-text-primary">Instagram</h2>
                    {status?.instagram.configured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-green/40 bg-accent-green-muted px-2 py-0.5 text-xs font-semibold text-accent-green">
                        <Check size={10} /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-red/40 bg-accent-red-muted px-2 py-0.5 text-xs font-semibold text-accent-red">
                        <X size={10} /> Not Configured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {status?.instagram.configured 
                      ? `Account ID: ${status.instagram.accountId}`
                      : "Required for auto-posting Reels, Stories, and Feed posts"
                    }
                  </p>
                </div>
              </div>
            </Surface>

            {/* Facebook Status */}
            <Surface className="mb-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  status?.facebook.configured ? "bg-blue-500/10" : "bg-bg-tertiary"
                )}>
                  <ThumbsUp size={24} className={status?.facebook.configured ? "text-blue-500" : "text-text-muted"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-text-primary">Facebook</h2>
                    {status?.facebook.configured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-green/40 bg-accent-green-muted px-2 py-0.5 text-xs font-semibold text-accent-green">
                        <Check size={10} /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-red/40 bg-accent-red-muted px-2 py-0.5 text-xs font-semibold text-accent-red">
                        <X size={10} /> Not Configured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {status?.facebook.configured 
                      ? `Page ID: ${status.facebook.pageId}`
                      : "Required for auto-posting to Facebook Page and creating Events"
                    }
                  </p>
                </div>
              </div>
            </Surface>

            {/* Setup Instructions */}
            <Surface>
              <h3 className="text-base font-semibold text-text-primary mb-3">Setup Instructions</h3>
              
              <div className="space-y-4">
                <div className="rounded-lg border border-border-subtle bg-bg-primary p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">1. Get Facebook Page ID</h4>
                  <p className="text-xs text-text-secondary">
                    Go to your Facebook Page → About → Page Transparency → See Page ID
                  </p>
                </div>

                <div className="rounded-lg border border-border-subtle bg-bg-primary p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">2. Connect Instagram Business Account</h4>
                  <p className="text-xs text-text-secondary">
                    Instagram App → Settings → Account → Switch to Professional → Connect to CourtLab Facebook Page
                  </p>
                </div>

                <div className="rounded-lg border border-border-subtle bg-bg-primary p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">3. Create Facebook App</h4>
                  <p className="text-xs text-text-secondary">
                    <a href="https://developers.facebook.com/apps/" target="_blank" className="text-hyper-blue hover:underline inline-flex items-center gap-1">
                      developers.facebook.com/apps <ExternalLink size={10} />
                    </a>
                    <br />Create App → Business → "CourtLab Social"
                  </p>
                </div>

                <div className="rounded-lg border border-border-subtle bg-bg-primary p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">4. Generate Access Token</h4>
                  <p className="text-xs text-text-secondary">
                    <a href="https://developers.facebook.com/tools/explorer/" target="_blank" className="text-hyper-blue hover:underline inline-flex items-center gap-1">
                      Graph API Explorer <ExternalLink size={10} />
                    </a>
                    <br />Select permissions: pages_manage_posts, instagram_content_publish, pages_read_engagement
                  </p>
                </div>

                <div className="rounded-lg border border-border-subtle bg-bg-primary p-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">5. Add to Vercel Environment Variables</h4>
                  <div className="mt-2 space-y-1">
                    <code className="block text-xs bg-bg-tertiary px-2 py-1 rounded">FACEBOOK_ACCESS_TOKEN=your_token</code>
                    <code className="block text-xs bg-bg-tertiary px-2 py-1 rounded">FACEBOOK_PAGE_ID=your_page_id</code>
                    <code className="block text-xs bg-bg-tertiary px-2 py-1 rounded">INSTAGRAM_ACCOUNT_ID=your_ig_id</code>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle">
                <a 
                  href="https://github.com/raven2t2/courtlabops/blob/main/docs/FACEBOOK_INSTAGRAM_SETUP.md" 
                  target="_blank"
                  className="inline-flex items-center gap-2 text-sm text-hyper-blue hover:underline"
                >
                  <ExternalLink size={14} />
                  View Full Setup Guide
                </a>
              </div>
            </Surface>
          </>
        )}
      </div>
    </div>
  )
}
