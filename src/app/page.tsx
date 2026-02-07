"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Flame,
  Mail,
  MapPin,
  Plus,
  Search,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tone = "blue" | "orange" | "green" | "red" | "ink"
type BadgeTone = "critical" | "high" | "medium" | "warm" | "contacted" | "new" | "live" | "ink"

const TONE_TEXT: Record<Tone, string> = {
  blue: "text-[var(--dash-blue)]",
  orange: "text-[var(--dash-orange)]",
  green: "text-[var(--dash-green)]",
  red: "text-[var(--dash-red)]",
  ink: "text-[var(--dash-ink)]",
}

const STATS = [
  { label: "Total Leads", value: 18, delta: "+44%", sub: "+8 VIC expansion", icon: Users, tone: "blue" as const },
  { label: "Upcoming Events", value: 6, delta: null, sub: "1 critical deadline", icon: CalendarDays, tone: "orange" as const },
  { label: "Coach Prospects", value: 5, delta: "+2", sub: "3 high priority", icon: Trophy, tone: "green" as const },
  { label: "Competitors", value: 5, delta: null, sub: "Active tracking", icon: Shield, tone: "ink" as const },
]

const PRIORITY_ACTIONS = [
  {
    title: "Easter Classic 2026",
    desc: "Apr 3-6: lock booth + demo stations this month.",
    level: "critical" as const,
    tag: "8 weeks",
    icon: Flame,
  },
  {
    title: "Dodo Elyazar Follow-up",
    desc: "Tour completed. Pitch 2026 camp partnership package.",
    level: "high" as const,
    tag: "Follow-up",
    icon: Zap,
  },
  {
    title: "Forestville Eagles Outreach",
    desc: "Warm lead. Personalized email is drafted and queued.",
    level: "medium" as const,
    tag: "Ready",
    icon: Mail,
  },
]

const LEADS = [
  { name: "Forestville Eagles", loc: "SA", status: "warm" as const, contact: "Head Coach", score: 87 },
  { name: "North Adelaide Rockets", loc: "SA", status: "contacted" as const, contact: "President", score: 81 },
  { name: "Melbourne Tigers", loc: "VIC", status: "new" as const, contact: "Youth Director", score: 75 },
  { name: "Sturt Sabres", loc: "SA", status: "new" as const, contact: "Operations Mgr", score: 72 },
  { name: "Nunawading Spectres", loc: "VIC", status: "new" as const, contact: "Head of Programs", score: 70 },
  { name: "Woodville Warriors", loc: "SA", status: "new" as const, contact: "Club Secretary", score: 68 },
]

const ACTIVITY_FEED = [
  { text: "Apple Search Ads crossed 161 impressions", time: "2h ago", icon: TrendingUp, tone: "orange" as const },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, tone: "green" as const },
  { text: "Competitor update logged for HomeCourt", time: "1d ago", icon: Shield, tone: "ink" as const },
  { text: "Easter Classic registration deadline reminder", time: "1d ago", icon: AlertTriangle, tone: "red" as const },
]

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cn("dash-surface rounded-3xl p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, tone = "ink" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={cn("dash-badge", `dash-badge--${tone}`)}>
      {tone === "live" ? <span className="dash-dot-live" /> : null}
      {children}
    </span>
  )
}

function CountUp({ target, delay = 0 }: { target: number; delay?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    const timer = setTimeout(() => {
      let current = 0
      const step = Math.max(1, Math.floor(target / 24))

      interval = setInterval(() => {
        current += step
        if (current >= target) {
          setValue(target)
          if (interval) clearInterval(interval)
          return
        }
        setValue(current)
      }, 24)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (interval) clearInterval(interval)
    }
  }, [target, delay])

  return <span>{value}</span>
}

function ScoreBar({ score }: { score: number }) {
  const toneClass = score >= 80 ? TONE_TEXT.blue : score >= 70 ? TONE_TEXT.orange : "text-[var(--dash-ink-soft)]"

  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--dash-line-soft)]">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", score >= 80 ? "bg-[var(--dash-blue)]" : score >= 70 ? "bg-[var(--dash-orange)]" : "bg-[var(--dash-ink-soft)]")}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-bold", toneClass)} style={{ fontFamily: "var(--font-mono)" }}>
        {score}
      </span>
    </div>
  )
}

function PerformanceRow({
  label,
  value,
  total,
  note,
  tone,
}: {
  label: string
  value: number
  total: number
  note: string
  tone: Tone
}) {
  const width = total > 0 ? Math.min(100, (value / total) * 100) : 0
  const barClass = tone === "orange" ? "bg-[var(--dash-orange)]" : "bg-[var(--dash-blue)]"

  return (
    <div className="dash-pill space-y-2 rounded-2xl p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[var(--dash-ink)]">{label}</p>
        <p className={cn("text-sm font-bold", TONE_TEXT[tone])} style={{ fontFamily: "var(--font-mono)" }}>
          {value}/{total}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--dash-line-soft)]">
        <div className={cn("h-full rounded-full transition-[width] duration-700", barClass)} style={{ width: `${width}%` }} />
      </div>
      <p className="text-[11px] text-[var(--dash-ink-soft)]">{note}</p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="dashboard-shell px-4 pb-6 pt-4 sm:px-6 sm:pb-8">
      <div className="mx-auto max-w-[1240px] space-y-4 sm:space-y-5">
        <Surface className="dash-hero fade-up relative overflow-hidden border">
          <div className="pointer-events-none absolute -right-14 -top-12 h-52 w-52 rounded-full border border-[color:color-mix(in_oklab,var(--dash-blue)_22%,white)]" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full border border-[color:color-mix(in_oklab,var(--dash-orange)_22%,white)]" />

          <div className="relative space-y-5 sm:space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--dash-ink-soft)]">CourtLab Mission Control</p>
                  <Badge tone="live">Live</Badge>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--dash-ink)] sm:text-3xl">Move Faster On The Deals That Matter</h1>
                <p className="max-w-2xl text-sm text-[var(--dash-ink-soft)]">
                  Focus this week: event deadlines, coach follow-ups, and converting warm South Australia clubs before March.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="dash-border-strong flex items-center gap-2 rounded-2xl border bg-[color:color-mix(in_oklab,var(--dash-paper)_84%,transparent)] px-3 py-2">
                  <Search size={14} className="text-[var(--dash-ink-soft)]" />
                  <input
                    type="text"
                    placeholder="Search ops"
                    className="w-full border-none bg-transparent text-sm text-[var(--dash-ink)] outline-none placeholder:text-[var(--dash-ink-soft)] sm:w-44"
                  />
                </label>
                <button className="dash-border-strong inline-flex items-center justify-center gap-2 rounded-2xl border bg-[var(--dash-paper)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] transition-colors">
                  <Bell size={14} /> Alerts
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--dash-blue)] px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  <Plus size={14} /> New Lead
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="dash-chip rounded-2xl p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-ink-soft)]">Weekly Goal</p>
                <p className="mt-1 text-lg font-bold text-[var(--dash-ink)]">10 Decision Conversations</p>
              </div>
              <div className="dash-chip rounded-2xl p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-ink-soft)]">Risk Window</p>
                <p className="mt-1 text-lg font-bold text-[var(--dash-ink)]">Easter Classic: 8 Weeks Out</p>
              </div>
              <div className="dash-chip rounded-2xl p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-ink-soft)]">Coverage Gap</p>
                <p className="mt-1 text-lg font-bold text-[var(--dash-ink)]">VIC Outreach Needs 3 More Coaches</p>
              </div>
            </div>
          </div>
        </Surface>

        <div className="fade-up grid gap-3 sm:grid-cols-2 xl:grid-cols-4 [animation-delay:120ms]">
          {STATS.map((item, index) => {
            const Icon = item.icon

            return (
              <Surface key={item.label} className="hover-lift">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--dash-ink-soft)]">{item.label}</p>
                    <div className="dash-pill rounded-xl p-2">
                      <Icon size={16} className={TONE_TEXT[item.tone]} />
                    </div>
                  </div>
                  <p className="text-3xl font-black leading-none text-[var(--dash-ink)]">
                    <CountUp target={item.value} delay={index * 140} />
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--dash-ink-soft)]">
                    <span>{item.sub}</span>
                    {item.delta ? <Badge tone="medium">{item.delta}</Badge> : null}
                  </div>
                </div>
              </Surface>
            )
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-4">
            <Surface className="fade-up [animation-delay:220ms]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[var(--dash-ink)]">Priority Actions</h2>
                <Badge tone="critical">3 Pending</Badge>
              </div>

              <div className="space-y-2.5">
                {PRIORITY_ACTIONS.map((item) => {
                  const Icon = item.icon
                  const tone = item.level === "critical" ? "red" : item.level === "high" ? "orange" : "blue"

                  return (
                    <div key={item.title} className="dash-row-hover group flex items-start gap-3 rounded-2xl border border-[var(--dash-line-soft)] p-3">
                      <div className="dash-pill rounded-xl p-2">
                        <Icon size={14} className={TONE_TEXT[tone]} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[var(--dash-ink)]">{item.title}</h3>
                          <Badge tone={item.level}>{item.level}</Badge>
                        </div>
                        <p className="text-xs text-[var(--dash-ink-soft)]">{item.desc}</p>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <span className="dash-pill rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--dash-ink-soft)]">{item.tag}</span>
                        <ChevronRight size={14} className="text-[var(--dash-ink-soft)]" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Surface>

            <Surface className="fade-up [animation-delay:340ms]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[var(--dash-ink)]">Pipeline</h2>
                <Link href="/leads" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--dash-blue)]">
                  View all 18 <ArrowUpRight size={12} />
                </Link>
              </div>

              <div className="hidden overflow-hidden rounded-2xl border border-[var(--dash-line-soft)] md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--dash-paper)]">
                      {["Club", "Region", "Status", "Contact", "Score"].map((header) => (
                        <th key={header} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-ink-soft)]">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LEADS.map((lead) => (
                      <tr key={lead.name} className="dash-table-row">
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-[var(--dash-ink)]">{lead.name}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="dash-pill inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-[var(--dash-ink-soft)]">
                            <MapPin size={10} /> {lead.loc}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge tone={lead.status}>{lead.status}</Badge>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-[var(--dash-ink-soft)]">{lead.contact}</td>
                        <td className="px-3 py-2.5">
                          <ScoreBar score={lead.score} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 md:hidden">
                {LEADS.map((lead) => (
                  <div key={lead.name} className="dash-pill rounded-2xl p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[var(--dash-ink)]">{lead.name}</p>
                      <Badge tone={lead.status}>{lead.status}</Badge>
                    </div>
                    <p className="mb-2 text-xs text-[var(--dash-ink-soft)]">
                      {lead.contact} · {lead.loc}
                    </p>
                    <ScoreBar score={lead.score} />
                  </div>
                ))}
              </div>
            </Surface>
          </div>

          <div className="space-y-4">
            <Surface className="fade-up [animation-delay:280ms]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[var(--dash-ink)]">Performance</h2>
                <Badge tone="ink">Week 06</Badge>
              </div>

              <div className="space-y-3">
                <PerformanceRow
                  label="Apple Search Ads"
                  value={161}
                  total={1000}
                  note="Impressions trending above expected first-week baseline"
                  tone="orange"
                />
                <PerformanceRow
                  label="Email Outreach"
                  value={0}
                  total={10}
                  note="Review sequence draft before launch"
                  tone="blue"
                />
                <div className="dash-pill flex items-center justify-between rounded-2xl p-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--dash-ink-soft)]">
                    <Clock3 size={13} /> Next review cycle
                  </div>
                  <span className="dash-pill rounded-full px-2 py-0.5 text-xs font-semibold text-[var(--dash-ink)]" style={{ fontFamily: "var(--font-mono)" }}>
                    Feb 13
                  </span>
                </div>
              </div>
            </Surface>

            <Surface className="fade-up [animation-delay:420ms]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-[var(--dash-ink)]">Activity Feed</h2>
                <Activity size={15} className="text-[var(--dash-ink-soft)]" />
              </div>

              <div className="space-y-3">
                {ACTIVITY_FEED.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.text} className="dash-pill flex items-start gap-3 rounded-2xl p-3">
                      <div className="dash-pill mt-0.5 rounded-lg p-1.5">
                        <Icon size={13} className={TONE_TEXT[item.tone]} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-relaxed text-[var(--dash-ink)]">{item.text}</p>
                        <p className="mt-1 text-[11px] text-[var(--dash-ink-soft)]" style={{ fontFamily: "var(--font-mono)" }}>
                          {item.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Surface>

            <div className="fade-up grid gap-3 [animation-delay:500ms] sm:grid-cols-2 xl:grid-cols-1">
              {[
                { title: "Leads", desc: "18 clubs across SA + VIC", icon: Users, href: "/leads", tone: "blue" as const },
                { title: "Events", desc: "Easter Classic in 8 weeks", icon: CalendarDays, href: "/events", tone: "orange" as const },
                { title: "Competitors", desc: "5 active products tracked", icon: Shield, href: "/competitors", tone: "ink" as const },
                { title: "Coaches", desc: "5 affiliate prospects", icon: Star, href: "/coaches", tone: "green" as const },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <Link key={item.title} href={item.href}>
                    <Surface className="group cursor-pointer transition-colors hover:bg-[var(--dash-paper)]">
                      <div className="flex items-center gap-3">
                        <div className="dash-pill rounded-xl p-2">
                          <Icon size={15} className={TONE_TEXT[item.tone]} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[var(--dash-ink)]">{item.title}</p>
                          <p className="text-xs text-[var(--dash-ink-soft)]">{item.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-[var(--dash-ink-soft)]" />
                      </div>
                    </Surface>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
