"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  FileText,
  MessageSquare,
  PenTool,
  Play,
  Send,
  Twitter,
  User,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

type BadgeTone = "critical" | "high" | "medium" | "warm" | "contacted" | "new" | "live" | "neutral"

// Sample data - in production this would be fetched from API
const KENNY_TIPS = [
  { number: 1, title: "The Corner 3", category: "shooting", posted: false },
  { number: 2, title: "Free Throw Routine", category: "mental", posted: false },
  { number: 3, title: "Defensive Stance", category: "defense", posted: false },
  { number: 4, title: "Ball-Handling Basics", category: "skills", posted: false },
  { number: 5, title: "Rebounding Position", category: "fundamentals", posted: false },
  { number: 6, title: "The Pick & Roll", category: "iq", posted: false },
  { number: 7, title: "Transition Offense", category: "offense", posted: false },
  { number: 8, title: "Pre-Game Routine", category: "mental", posted: false },
  { number: 9, title: "Film Study", category: "iq", posted: false },
  { number: 10, title: "Track Your Stats", category: "tracking", posted: false },
  { number: 11, title: "Set SMART Goals", category: "mental", posted: false },
  { number: 12, title: "The Mid-Range Game", category: "shooting", posted: false },
  { number: 13, title: "Communication on Defense", category: "defense", posted: false },
  { number: 14, title: "Footwork Fundamentals", category: "fundamentals", posted: false },
  { number: 15, title: "Recovery & Sleep", category: "wellness", posted: false },
  { number: 16, title: "Shot Fake & Drive", category: "offense", posted: false },
  { number: 17, title: "Passing Fundamentals", category: "fundamentals", posted: false },
  { number: 18, title: "Close-Out Technique", category: "defense", posted: false },
  { number: 19, title: "Post Moves", category: "offense", posted: false },
  { number: 20, title: "Mental Toughness", category: "mental", posted: false },
]

const CMO_TWEETS = [
  {
    id: "cmo-001",
    content: "Busy week at CourtLab HQ. Working on partnerships with clubs across Adelaide and Melbourne. The response to verified combines has been incredible...",
    scheduledFor: "2026-02-08T09:00:00Z",
    category: "partnership",
    posted: false,
  },
  {
    id: "cmo-002",
    content: "Behind the scenes: Just reviewed data from our last combine. Players who tracked their shots for 4+ weeks improved 23% faster...",
    scheduledFor: "2026-02-09T14:00:00Z",
    category: "insight",
    posted: false,
  },
]

const BRAND_TWEETS = [
  {
    id: "brand-001",
    content: "🏀 Become Undeniable. Track every shot. See real progress. Build your Basketball Resume. Join 500+ players already improving with CourtLab.",
    scheduledFor: "2026-02-07T10:00:00Z",
    category: "promotion",
    posted: false,
  },
  {
    id: "brand-002",
    content: "🔥 Player Spotlight: 'I used to guess if I was getting better. Now I know.' — Jake, 14. Jake improved his corner 3% from 31% to 47% in 8 weeks...",
    scheduledFor: "2026-02-08T16:00:00Z",
    category: "spotlight",
    posted: false,
  },
]

const POSTING_SCHEDULE = [
  { time: "9:00 AM", account: "CMO", type: "Tweet", status: "scheduled" },
  { time: "10:00 AM", account: "Brand", type: "Tweet", status: "scheduled" },
  { time: "11:00 AM", account: "Brand", type: "Kenny's Tip", status: "scheduled" },
  { time: "2:00 PM", account: "CMO", type: "Tweet", status: "scheduled" },
  { time: "4:00 PM", account: "Brand", type: "Tweet", status: "scheduled" },
  { time: "6:00 PM", account: "CMO", type: "Tweet", status: "scheduled" },
]

const STATS = [
  { label: "Kenny's Tips", value: 20, sub: "Ready to post", icon: PenTool, tone: "text-accent-green" },
  { label: "CMO Queue", value: 2, sub: "Scheduled tweets", icon: User, tone: "text-hyper-blue" },
  { label: "Brand Queue", value: 2, sub: "Scheduled tweets", icon: Users, tone: "text-velocity-orange" },
  { label: "Posts Today", value: 0, sub: "Automation disabled", icon: Send, tone: "text-text-muted" },
]

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        tone === "critical" && "border-accent-red/40 bg-accent-red-muted text-accent-red",
        tone === "high" && "border-accent-amber/40 bg-accent-amber-muted text-accent-amber",
        tone === "medium" && "border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue",
        tone === "warm" && "border-velocity-orange/40 bg-velocity-orange-muted text-velocity-orange",
        tone === "contacted" && "border-accent-violet/40 bg-accent-violet-muted text-accent-violet",
        tone === "new" && "border-accent-green/40 bg-accent-green-muted text-accent-green",
        tone === "live" && "border-accent-green/40 bg-accent-green-muted text-accent-green",
        tone === "neutral" && "border-border-default bg-bg-tertiary text-text-secondary"
      )}
    >
      {tone === "live" ? <span className="h-1.5 w-1.5 rounded-full bg-accent-green" /> : null}
      {children}
    </span>
  )
}

function getCategoryBadgeTone(category: string): BadgeTone {
  const map: Record<string, BadgeTone> = {
    shooting: "high",
    mental: "medium",
    defense: "warm",
    skills: "new",
    fundamentals: "contacted",
    iq: "medium",
    offense: "high",
    tracking: "new",
    wellness: "live",
    promotion: "high",
    partnership: "medium",
    insight: "medium",
    spotlight: "warm",
  }
  return map[category] || "neutral"
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<"all" | "tips" | "cmo" | "brand">("all")

  const remainingTips = KENNY_TIPS.filter((t) => !t.posted).length
  const cmoQueued = CMO_TWEETS.filter((t) => !t.posted).length
  const brandQueued = BRAND_TWEETS.filter((t) => !t.posted).length

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        {/* Header */}
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content Calendar</p>
                <Badge tone="live">Active</Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Social Media Command Center</h1>
              <p className="mt-1 text-sm text-text-secondary">Dual Twitter strategy: @EstherCourtLab (CMO) + @CourtLabApp (Brand)</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary">
                <Clock size={14} /> Schedule
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white">
                <PenTool size={14} /> New Post
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{item.label}</p>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-bg-tertiary", item.tone)}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-text-primary">{item.value}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                    <span>{item.sub}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Surface>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Main Content */}
          <div className="space-y-4">
            {/* Tabs */}
            <Surface className="p-2">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: "all", label: "All Content", count: remainingTips + cmoQueued + brandQueued },
                  { id: "tips", label: "Kenny's Tips", count: remainingTips },
                  { id: "cmo", label: "CMO Account", count: cmoQueued },
                  { id: "brand", label: "Brand Account", count: brandQueued },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-hyper-blue text-white"
                        : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                    )}
                  >
                    {tab.label}
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", activeTab === tab.id ? "bg-white/20" : "bg-bg-tertiary")}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </Surface>

            {/* Kenny's Tips */}
            {(activeTab === "all" || activeTab === "tips") && (
              <Surface>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green-muted text-accent-green">
                      <PenTool size={15} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-text-primary">Kenny's Tips</h2>
                      <p className="text-xs text-text-muted">Daily basketball tips from our mascot</p>
                    </div>
                  </div>
                  <Badge tone="new">{remainingTips} queued</Badge>
                </div>

                <div className="space-y-2">
                  {KENNY_TIPS.slice(0, 8).map((tip) => (
                    <div
                      key={tip.number}
                      className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-primary p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-muted">#{tip.number}</span>
                          <p className="truncate text-sm font-semibold text-text-primary">{tip.title}</p>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge tone={getCategoryBadgeTone(tip.category)}>{tip.category}</Badge>
                          {tip.posted ? (
                            <span className="text-[10px] text-text-muted">Posted</span>
                          ) : (
                            <span className="text-[10px] text-accent-green">Ready</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-2 flex items-center gap-1">
                        <button className="rounded-lg p-1.5 text-text-muted hover:bg-bg-tertiary hover:text-text-primary">
                          <FileText size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {KENNY_TIPS.length > 8 && (
                    <button className="w-full rounded-lg border border-border-subtle bg-bg-primary py-2 text-xs font-semibold text-text-secondary hover:bg-bg-tertiary">
                      View all {KENNY_TIPS.length} tips
                    </button>
                  )}
                </div>
              </Surface>
            )}

            {/* CMO Account */}
            {(activeTab === "all" || activeTab === "cmo") && (
              <Surface>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hyper-blue-muted text-hyper-blue">
                      <User size={15} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-text-primary">@EstherCourtLab (CMO)</h2>
                      <p className="text-xs text-text-muted">Personal voice, partnerships, building in public</p>
                    </div>
                  </div>
                  <Badge tone="medium">{cmoQueued} queued</Badge>
                </div>

                <div className="space-y-2">
                  {CMO_TWEETS.map((tweet) => (
                    <div
                      key={tweet.id}
                      className="rounded-xl border border-border-subtle bg-bg-primary p-3"
                    >
                      <p className="text-sm text-text-primary line-clamp-2">{tweet.content}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge tone={getCategoryBadgeTone(tweet.category)}>{tweet.category}</Badge>
                          <span className="text-[10px] text-text-muted">
                            {new Date(tweet.scheduledFor).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Twitter size={12} className="text-hyper-blue" />
                          <span className="text-[10px] text-text-muted">CMO</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>
            )}

            {/* Brand Account */}
            {(activeTab === "all" || activeTab === "brand") && (
              <Surface>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-velocity-orange-muted text-velocity-orange">
                      <Users size={15} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-text-primary">@CourtLabApp (Brand)</h2>
                      <p className="text-xs text-text-muted">Kenny mascot, tips, user spotlights</p>
                    </div>
                  </div>
                  <Badge tone="warm">{brandQueued} queued</Badge>
                </div>

                <div className="space-y-2">
                  {BRAND_TWEETS.map((tweet) => (
                    <div
                      key={tweet.id}
                      className="rounded-xl border border-border-subtle bg-bg-primary p-3"
                    >
                      <p className="text-sm text-text-primary line-clamp-2">{tweet.content}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge tone={getCategoryBadgeTone(tweet.category)}>{tweet.category}</Badge>
                          <span className="text-[10px] text-text-muted">
                            {new Date(tweet.scheduledFor).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Twitter size={12} className="text-velocity-orange" />
                          <span className="text-[10px] text-text-muted">Brand</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Posting Schedule */}
            <Surface>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet-muted text-accent-violet">
                    <CalendarDays size={15} />
                  </div>
                  <h2 className="text-base font-bold text-text-primary">Daily Schedule</h2>
                </div>
                <Badge tone="neutral">Disabled</Badge>
              </div>

              <div className="space-y-1">
                {POSTING_SCHEDULE.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-primary px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-text-muted w-16">{slot.time}</span>
                      <div className="flex items-center gap-1.5">
                        {slot.account === "CMO" ? (
                          <User size={12} className="text-hyper-blue" />
                        ) : (
                          <Users size={12} className="text-velocity-orange" />
                        )}
                        <span className="text-xs text-text-primary">{slot.account}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted">{slot.type}</span>
                      <div className="h-2 w-2 rounded-full bg-accent-amber" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-border-subtle bg-bg-tertiary/50 p-3">
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-accent-amber">Note:</span> Automation is currently disabled. Enable cron jobs to start auto-posting.
                </p>
              </div>
            </Surface>

            {/* Quick Actions */}
            <Surface>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green-muted text-accent-green">
                  <Play size={15} />
                </div>
                <h2 className="text-base font-bold text-text-primary">Quick Actions</h2>
              </div>

              <div className="space-y-2">
                <button className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-bg-tertiary">
                  <div className="flex items-center gap-2">
                    <PenTool size={14} className="text-accent-green" />
                    <span>Create Kenny's Tip</span>
                  </div>
                </button>
                <button className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-bg-tertiary">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-hyper-blue" />
                    <span>Draft CMO Tweet</span>
                  </div>
                </button>
                <button className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-bg-tertiary">
                  <div className="flex items-center gap-2">
                    <Twitter size={14} className="text-velocity-orange" />
                    <span>Draft Brand Tweet</span>
                  </div>
                </button>
                <button className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-bg-tertiary">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-accent-violet" />
                    <span>View Content Strategy</span>
                  </div>
                </button>
              </div>
            </Surface>

            {/* Account Info */}
            <Surface>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hyper-blue-muted text-hyper-blue">
                  <Twitter size={15} />
                </div>
                <h2 className="text-base font-bold text-text-primary">Account Status</h2>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-border-subtle bg-bg-primary p-3">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-hyper-blue" />
                    <span className="text-sm font-semibold text-text-primary">@EstherCourtLab</span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">CMO — Personal voice</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    <span className="text-[10px] text-accent-green">Authenticated</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border-subtle bg-bg-primary p-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-velocity-orange" />
                    <span className="text-sm font-semibold text-text-primary">@CourtLabApp</span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">Brand — Kenny mascot</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    <span className="text-[10px] text-accent-green">Authenticated</span>
                  </div>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  )
}
