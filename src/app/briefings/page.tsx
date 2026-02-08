"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  Cloud,
  Flame,
  Zap,
  Users,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Search,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BriefingData {
  date: string
  sections: {
    metrics: {
      signups: number
      signupsChange: number
      demos: number
      demosChange: number
      trials: number
      trialsChange: number
    }
    leads: {
      hot: Array<{ name: string; source: string; temp: "hot" | "warm" | "cold"; score: number }>
    }
    affiliates: {
      topPerformers: Array<{ name: string; conversions: number; revenue: number }>
    }
    competitive: {
      news: Array<{ title: string; source: string; date: string }>
    }
    content: {
      topPosts: Array<{ title: string; platform: string; engagement: number }>
    }
    ops: {
      blockers: string[]
      deployments: string[]
    }
    calendar: {
      events: Array<{ title: string; time: string; attendees: string }>
    }
    weather: {
      condition: string
      temp: number
      humidity: number
      forecast: string
    }
  }
}

interface BriefingFile {
  date: string
  timestamp: number
}

function StatCard({ icon: Icon, label, value, change, tone }: {
  icon: any
  label: string
  value: number | string
  change?: number
  tone?: "green" | "blue" | "orange"
}) {
  const toneClass = tone === "green" ? "text-accent-green" : tone === "orange" ? "text-velocity-orange" : "text-hyper-blue"
  const bgClass = tone === "green" ? "bg-accent-green-muted" : tone === "orange" ? "bg-velocity-orange-muted" : "bg-hyper-blue-muted"
  
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-secondary/50 p-5">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bgClass)}>
          <Icon size={20} className={toneClass} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-text-primary">{value}</p>
        {change !== undefined && (
          <span className={cn("text-xs font-semibold", change >= 0 ? "text-accent-green" : "text-accent-red")}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </div>
  )
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "green" | "red" | "orange" | "blue" | "neutral" }) {
  const classes = cn(
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
    tone === "green" && "border-accent-green/40 bg-accent-green-muted text-accent-green",
    tone === "red" && "border-accent-red/40 bg-accent-red-muted text-accent-red",
    tone === "orange" && "border-velocity-orange/40 bg-velocity-orange-muted text-velocity-orange",
    tone === "blue" && "border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue",
    tone === "neutral" && "border-border-default bg-bg-tertiary text-text-secondary"
  )
  return <span className={classes}>{children}</span>
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/50 p-5 sm:p-6", className)}>
      {children}
    </section>
  )
}

export default function BriefingsPage() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [allBriefings, setAllBriefings] = useState<BriefingFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadBriefings()
  }, [])

  const loadBriefings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/briefings")
      const data = await res.json()
      setAllBriefings(data.files || [])
      
      if (data.files && data.files.length > 0) {
        const latestDate = data.files[0].date
        loadBriefing(latestDate)
      } else {
        // Load sample data
        loadSampleBriefing()
      }
    } catch (error) {
      console.error("Failed to load briefings:", error)
      loadSampleBriefing()
    }
    setIsLoading(false)
  }

  const loadBriefing = async (date: string) => {
    try {
      const res = await fetch(`/api/briefings/${date}`)
      const data = await res.json()
      setBriefing(data)
      setSelectedDate(date)
    } catch (error) {
      console.error("Failed to load briefing:", error)
    }
  }

  const loadSampleBriefing = () => {
    const today = new Date().toISOString().split("T")[0]
    setBriefing({
      date: today,
      sections: {
        metrics: {
          signups: 12,
          signupsChange: 8,
          demos: 4,
          demosChange: 2,
          trials: 2,
          trialsChange: -1,
        },
        leads: {
          hot: [
            { name: "Forestville Eagles", source: "Twitter mention", temp: "hot", score: 95 },
            { name: "Melbourne Tigers", source: "Reddit thread", temp: "hot", score: 88 },
            { name: "Frankston Blues", source: "Coach referral", temp: "warm", score: 82 },
          ],
        },
        affiliates: {
          topPerformers: [
            { name: "Sarah Chen (TikTok)", conversions: 5, revenue: 2500 },
            { name: "Coach Marcus (Instagram)", conversions: 3, revenue: 1500 },
            { name: "David Lee (YouTube)", conversions: 2, revenue: 1200 },
          ],
        },
        competitive: {
          news: [
            { title: "PlayerZone raises $5M Series A", source: "TechCrunch", date: "Today" },
            { title: "STATS Perform launches youth analytics", source: "Sports Tech News", date: "Yesterday" },
            { title: "Basket.app hits 50k users", source: "Product Hunt", date: "2 days ago" },
          ],
        },
        content: {
          topPosts: [
            { title: "5 Basketball Drills for Guard Development", platform: "YouTube", engagement: 2847 },
            { title: "Youth Tournament Highlights Reel", platform: "Instagram", engagement: 1654 },
            { title: "Coach Interview: Building Winning Culture", platform: "TikTok", engagement: 5234 },
          ],
        },
        ops: {
          blockers: [
            "Twitter API rate limits hitting daily - need to implement caching",
            "Gallery image sync timeout on large batches",
          ],
          deployments: ["Kanban column reorganization", "Social posting automation enabled"],
        },
        calendar: {
          events: [
            { title: "Easter Classic Tournament Planning", time: "10:00 AM", attendees: "Michael, Coach Sarah" },
            { title: "Affiliate Partner Sync", time: "2:00 PM", attendees: "Michael, Esther" },
            { title: "Content Strategy Review", time: "4:00 PM", attendees: "Michael, Design Team" },
          ],
        },
        weather: {
          condition: "Partly Cloudy",
          temp: 24,
          humidity: 62,
          forecast: "Clear skies with light winds. Perfect for outdoor training sessions.",
        },
      },
    })
    setSelectedDate(today)
  }

  const filteredBriefings = allBriefings.filter((b) =>
    b.date.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-hyper-blue border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.12),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.10),transparent_40%)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-hyper-blue hover:text-hyper-blue-hover transition-colors"
            >
              <ArrowLeft size={16} />
              {showArchive ? "Back to Today" : "View Archive"}
            </button>
          </div>

          {briefing && !showArchive && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">Daily Briefing</p>
              <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-text-primary mb-2">
                {new Date(briefing.date).toLocaleDateString("en-AU", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h1>
              <p className="text-text-secondary">Your morning strategic overview for CourtLab operations</p>
            </div>
          )}

          {showArchive && (
            <div>
              <h2 className="text-3xl font-display font-bold tracking-tight text-text-primary mb-4">
                Briefing Archive
              </h2>
              <p className="text-text-secondary">Search and view past daily briefings</p>
            </div>
          )}
        </div>

        {/* Archive View */}
        {showArchive ? (
          <Surface>
            <div className="mb-6">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3">
                <Search size={16} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search by date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
              </label>
            </div>

            <div className="space-y-3">
              {filteredBriefings.length > 0 ? (
                filteredBriefings.map((file) => (
                  <button
                    key={file.date}
                    onClick={() => {
                      loadBriefing(file.date)
                      setShowArchive(false)
                    }}
                    className="w-full text-left rounded-xl border border-border-subtle bg-bg-primary p-4 hover:border-hyper-blue/50 hover:bg-bg-secondary transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-hyper-blue transition-colors">
                          {new Date(file.date).toLocaleDateString("en-AU", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {new Date(file.timestamp * 1000).toLocaleTimeString()}
                        </p>
                      </div>
                      <ArrowRight size={18} className="text-text-muted group-hover:text-hyper-blue transition-colors" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-muted">No briefings found</p>
                </div>
              )}
            </div>
          </Surface>
        ) : briefing ? (
          <>
            {/* Metrics Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-hyper-blue" />
                <h2 className="text-xl font-bold text-text-primary">CourtLab Metrics (Last 24h)</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  icon={Users}
                  label="New Signups"
                  value={briefing.sections.metrics.signups}
                  change={briefing.sections.metrics.signupsChange}
                  tone="blue"
                />
                <StatCard
                  icon={Calendar}
                  label="Demo Requests"
                  value={briefing.sections.metrics.demos}
                  change={briefing.sections.metrics.demosChange}
                  tone="orange"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Trial Activations"
                  value={briefing.sections.metrics.trials}
                  change={briefing.sections.metrics.trialsChange}
                  tone="green"
                />
              </div>
            </div>

            {/* Lead Temperature */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Flame size={20} className="text-velocity-orange" />
                <h2 className="text-xl font-bold text-text-primary">Lead Temperature (Social + Reddit)</h2>
              </div>
              <Surface>
                <div className="space-y-3">
                  {briefing.sections.leads.hot.map((lead, idx) => (
                    <div key={idx} className="flex items-start justify-between rounded-xl bg-bg-primary p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary">{lead.name}</p>
                        <p className="text-sm text-text-secondary mt-1">{lead.source}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge tone={lead.temp === "hot" ? "red" : "orange"}>
                          {lead.temp.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-text-muted">Score</p>
                          <p className="text-lg font-bold text-text-primary">{lead.score}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>
            </div>

            {/* Grid Layout for Secondary Sections */}
            <div className="grid gap-8 lg:grid-cols-2 mb-8">
              {/* Affiliate Activity */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-accent-green" />
                  <h2 className="text-xl font-bold text-text-primary">Top Affiliates</h2>
                </div>
                <Surface className="h-full">
                  <div className="space-y-3">
                    {briefing.sections.affiliates.topPerformers.map((aff, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-bg-primary p-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-text-primary">{aff.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {aff.conversions} conversions · ${aff.revenue.toLocaleString()}
                          </p>
                        </div>
                        <Badge tone="green">{aff.conversions}x</Badge>
                      </div>
                    ))}
                  </div>
                </Surface>
              </div>

              {/* Competitive Intel */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-accent-amber" />
                  <h2 className="text-xl font-bold text-text-primary">Competitive Intel</h2>
                </div>
                <Surface className="h-full">
                  <div className="space-y-3">
                    {briefing.sections.competitive.news.map((news, idx) => (
                      <div key={idx} className="rounded-lg bg-bg-primary p-3">
                        <p className="text-sm font-semibold text-text-primary">{news.title}</p>
                        <p className="text-xs text-text-muted mt-2">
                          {news.source} · {news.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </Surface>
              </div>
            </div>

            {/* Content Performance */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-accent-blue" />
                <h2 className="text-xl font-bold text-text-primary">Content Performance</h2>
              </div>
              <Surface>
                <div className="space-y-3">
                  {briefing.sections.content.topPosts.map((post, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-bg-primary p-4">
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary">{post.title}</p>
                        <p className="text-xs text-text-muted mt-1">{post.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-text-muted">Engagement</p>
                        <p className="text-2xl font-bold text-hyper-blue">{post.engagement.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>
            </div>

            {/* Ops Status & Calendar */}
            <div className="grid gap-8 lg:grid-cols-2 mb-8">
              {/* Ops Status */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-accent-red" />
                  <h2 className="text-xl font-bold text-text-primary">Ops Status</h2>
                </div>
                <Surface className="h-full">
                  <div className="space-y-4">
                    {briefing.sections.ops.blockers.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-red mb-2">Blockers</p>
                        <div className="space-y-2">
                          {briefing.sections.ops.blockers.map((blocker, idx) => (
                            <div key={idx} className="flex gap-2 text-sm text-text-secondary">
                              <span className="text-accent-red mt-0.5">•</span>
                              <span>{blocker}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {briefing.sections.ops.deployments.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-green mb-2">Deployments</p>
                        <div className="space-y-2">
                          {briefing.sections.ops.deployments.map((deploy, idx) => (
                            <div key={idx} className="flex gap-2 text-sm text-text-secondary">
                              <span className="text-accent-green mt-0.5">✓</span>
                              <span>{deploy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Surface>
              </div>

              {/* Calendar */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-hyper-blue" />
                  <h2 className="text-xl font-bold text-text-primary">Today's Schedule</h2>
                </div>
                <Surface className="h-full">
                  <div className="space-y-3">
                    {briefing.sections.calendar.events.map((event, idx) => (
                      <div key={idx} className="rounded-lg bg-bg-primary p-4">
                        <p className="font-semibold text-text-primary">{event.title}</p>
                        <p className="text-xs text-hyper-blue mt-1 font-medium">{event.time}</p>
                        <p className="text-xs text-text-muted mt-2">{event.attendees}</p>
                      </div>
                    ))}
                  </div>
                </Surface>
              </div>
            </div>

            {/* Weather */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Cloud size={20} className="text-accent-blue" />
                <h2 className="text-xl font-bold text-text-primary">Weather (Adelaide)</h2>
              </div>
              <Surface>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-text-primary">{briefing.sections.weather.temp}°C</p>
                    <p className="text-lg text-text-secondary mt-1">{briefing.sections.weather.condition}</p>
                    <p className="text-sm text-text-muted mt-2">
                      Humidity: {briefing.sections.weather.humidity}%
                    </p>
                  </div>
                  <p className="text-sm text-text-secondary text-right max-w-xs">
                    {briefing.sections.weather.forecast}
                  </p>
                </div>
              </Surface>
            </div>
          </>
        ) : (
          <Surface className="text-center py-12">
            <p className="text-text-muted">No briefing available for today</p>
          </Surface>
        )}
      </div>
    </div>
  )
}
