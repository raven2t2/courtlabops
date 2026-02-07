"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import {
  Users, ChevronRight, Search, Bell, Clock,
  AlertTriangle, Eye, Mail, TrendingUp, MapPin, Star, Plus,
  ArrowUpRight, Activity, Zap, Flame, Shield, CalendarDays,
  UserCheck, AlertCircle, BarChart3
} from "lucide-react"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DATA
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const STATS = [
  { label: "Total Leads", value: 18, delta: "+44%", sub: "+8 VIC expansion", icon: Users, color: "var(--color-accent-blue)" },
  { label: "Upcoming Events", value: 6, sub: "1 critical deadline", icon: CalendarDays, color: "var(--color-velocity-orange)" },
  { label: "Coach Prospects", value: 5, delta: "+2", sub: "3 high priority", icon: Star, color: "var(--color-accent-green)" },
  { label: "Competitors", value: 5, sub: "Active tracking", icon: Eye, color: "var(--color-accent-violet)" },
]

const PRIORITY_ACTIONS = [
  { title: "Easter Classic 2026", desc: "Apr 3–6 — 8 weeks out. Lock in booth + demo stations now.", level: "critical" as const, tag: "8 weeks", icon: Flame },
  { title: "Dodo Elyazar Follow-up", desc: "Jan tour done. Pitch 2026 camp partnerships. Decision pending.", level: "high" as const, tag: "Follow-up", icon: Zap },
  { title: "Forestville Eagles Outreach", desc: "Zane's club — warm lead. Personalized email drafted, ready to send.", level: "medium" as const, tag: "Ready", icon: Mail },
]

const LEADS = [
  { name: "Forestville Eagles", loc: "SA", status: "warm" as const, contact: "Head Coach", score: 87 },
  { name: "North Adelaide Rockets", loc: "SA", status: "contacted" as const, contact: "President", score: 81 },
  { name: "Melbourne Tigers", loc: "VIC", status: "new" as const, contact: "Youth Director", score: 75 },
  { name: "Sturt Sabres", loc: "SA", status: "new" as const, contact: "Operations Mgr", score: 72 },
  { name: "Nunawading Spectres", loc: "VIC", status: "new" as const, contact: "Head of Programs", score: 70 },
  { name: "Woodville Warriors", loc: "SA", status: "new" as const, contact: "Club Secretary", score: 68 },
]

const ACTIVITY = [
  { text: "Apple Search Ads crossed 161 impressions", time: "2h ago", icon: TrendingUp, color: "var(--color-velocity-orange)" },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, color: "var(--color-accent-green)" },
  { text: "Competitor analysis updated — HomeCourt", time: "1d ago", icon: Shield, color: "var(--color-accent-violet)" },
  { text: "Easter Classic registration deadline alert", time: "1d ago", icon: AlertCircle, color: "var(--color-accent-red)" },
]

const QUICK_ACCESS = [
  { title: "Leads", desc: "18 clubs — SA + VIC", icon: Users, color: "var(--color-accent-blue)", href: "/leads" },
  { title: "Events", desc: "Easter Classic in 8w", icon: CalendarDays, color: "var(--color-velocity-orange)", href: "/events" },
  { title: "Competitors", desc: "5 apps tracked", icon: Shield, color: "var(--color-accent-violet)", href: "/competitors" },
  { title: "Coaches", desc: "5 affiliate prospects", icon: Star, color: "var(--color-accent-green)", href: "/coaches" },
]

const LEVEL_COLORS = {
  critical: { bg: "var(--color-accent-red-muted)", fg: "var(--color-accent-red)" },
  high:     { bg: "var(--color-accent-amber-muted)", fg: "var(--color-accent-amber)" },
  medium:   { bg: "var(--color-accent-blue-muted)", fg: "var(--color-accent-blue)" },
} as const

const STATUS_STYLES = {
  warm:      { bg: "var(--color-accent-orange-muted)", fg: "var(--color-accent-orange)", border: "oklch(0.702 0.194 41 / 0.2)" },
  new:       { bg: "var(--color-accent-green-muted)", fg: "var(--color-accent-green)", border: "oklch(0.723 0.219 149 / 0.2)" },
  contacted: { bg: "var(--color-accent-violet-muted)", fg: "var(--color-accent-violet)", border: "oklch(0.586 0.22 293 / 0.2)" },
} as const

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PRIMITIVES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function AnimNum({ target, delay = 0 }: { target: number; delay?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0
      const step = Math.max(1, Math.floor(target / 30))
      const iv = setInterval(() => {
        i += step
        if (i >= target) { setVal(target); clearInterval(iv) }
        else setVal(i)
      }, 30)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return <span className="tabular-nums">{val}</span>
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "var(--color-accent-blue)" : score >= 70 ? "var(--color-velocity-orange)" : "var(--color-text-muted)"
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16 h-1.5 rounded-full overflow-hidden bg-border-subtle">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums font-mono" style={{ color }}>{score}</span>
    </div>
  )
}

function Badge({ children, pulse, style }: { children: ReactNode; pulse?: boolean; style: { bg: string; fg: string; border?: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border leading-none"
      style={{ background: style.bg, color: style.fg, borderColor: style.border || "transparent" }}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: style.fg }} />}
      {children}
    </span>
  )
}

function SectionHeader({ icon: Icon, title, color, children }: { icon: typeof Users; title: string; color: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in oklch, ${color} 15%, transparent)` }}>
          <Icon size={15} style={{ color }} strokeWidth={2.2} />
        </div>
        <h3 className="text-[13px] font-semibold text-text-primary font-[--font-display]">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Card({ children, className = "", delay, ready }: { children: ReactNode; className?: string; delay?: string; ready?: boolean }) {
  return (
    <div
      className={`bg-bg-secondary rounded-xl border border-border-subtle ${ready !== undefined ? (ready ? "fade-up" : "opacity-0") : ""} ${className}`}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DASHBOARD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function Dashboard() {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  return (
    <div className="min-h-full">

      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 px-8 xl:px-10 py-4 flex items-center justify-between border-b border-border-subtle glass">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-text-primary font-[--font-display]">Dashboard</h1>
            <Badge pulse style={{ bg: "var(--color-accent-green-muted)", fg: "var(--color-accent-green)", border: "oklch(0.723 0.219 149 / 0.2)" }}>Live</Badge>
          </div>
          <p className="text-xs mt-0.5 text-text-muted">Australia-first execution &middot; Combines are the Trojan horse</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-subtle bg-bg-secondary/60 backdrop-blur-sm">
            <Search size={14} className="text-text-muted" />
            <input type="text" placeholder="Search ops..." className="bg-transparent border-none outline-none text-sm w-44 text-text-primary placeholder:text-text-muted" />
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border-subtle bg-bg-tertiary text-text-muted">&#8984;K</kbd>
          </div>
          <button className="relative p-2 rounded-lg border border-border-subtle bg-bg-secondary hover:bg-bg-tertiary transition-colors">
            <Bell size={16} className="text-text-tertiary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full pulse-glow" style={{ background: "var(--color-velocity-orange)" }} />
          </button>
          <Link href="/leads" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-px" style={{ background: "var(--color-accent-blue)" }}>
            <Plus size={14} /> New Lead
          </Link>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="px-8 xl:px-10 py-8 space-y-8">

        {/* ── Row 1: Stat Cards ────────────────────────────────────── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 ${ready ? "fade-up" : "opacity-0"}`}>
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="hover-lift bg-bg-secondary rounded-xl border border-border-subtle p-6 group cursor-default"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{s.label}</p>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `color-mix(in oklch, ${s.color} 14%, transparent)` }}>
                    <Icon size={16} style={{ color: s.color }} strokeWidth={2} />
                  </div>
                </div>
                <p className="text-4xl font-extrabold tracking-tight text-text-primary font-[--font-display] mb-1">
                  <AnimNum target={s.value} delay={200 + i * 100} />
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-muted">{s.sub}</span>
                  {s.delta && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--color-accent-green-muted)", color: "var(--color-accent-green)" }}>{s.delta}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Row 2: Two‑Column (Priority + Performance/Activity) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Left — Priority Actions (3 of 5 cols) */}
          <Card className="xl:col-span-3 flex flex-col" delay="200ms" ready={ready}>
            <SectionHeader icon={AlertTriangle} title="Priority Actions" color="var(--color-velocity-orange)">
              <Badge style={LEVEL_COLORS.critical} pulse>3 pending</Badge>
            </SectionHeader>
            <div className="px-6 pb-6 space-y-2.5 flex-1">
              {PRIORITY_ACTIONS.map((a, i) => {
                const AIcon = a.icon
                const lc = LEVEL_COLORS[a.level]
                return (
                  <div
                    key={i}
                    className={`group flex items-center gap-4 p-4 rounded-xl border border-border-subtle bg-bg-primary/30 hover:bg-bg-primary/60 hover:border-border-default transition-all cursor-pointer ${ready ? "slide-in" : "opacity-0"}`}
                    style={{ animationDelay: `${300 + i * 70}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105" style={{ background: lc.bg }}>
                      <AIcon size={16} style={{ color: lc.fg }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-text-primary">{a.title}</h4>
                        <Badge style={lc}>{a.level}</Badge>
                      </div>
                      <p className="text-xs text-text-muted truncate">{a.desc}</p>
                    </div>
                    <div className="flex items-center gap-2.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-bg-tertiary text-text-tertiary font-mono">{a.tag}</span>
                      <ChevronRight size={14} className="text-text-muted group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Right — Performance + Activity (2 of 5 cols) */}
          <div className="xl:col-span-2 flex flex-col gap-5">

            {/* Performance */}
            <Card className="flex-1" delay="300ms" ready={ready}>
              <SectionHeader icon={BarChart3} title="Performance" color="var(--color-accent-blue)">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: "var(--color-accent-blue-muted)", color: "var(--color-accent-blue)" }}>This week</span>
              </SectionHeader>
              <div className="px-6 pb-6 space-y-4">
                {/* Apple Search Ads */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={13} className="text-text-muted" />
                      <span className="text-xs font-medium text-text-secondary">Apple Search Ads</span>
                    </div>
                    <span className="text-xs font-bold font-mono" style={{ color: "var(--color-velocity-orange)" }}>161/1000</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-border-subtle">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: "16.1%", background: "var(--color-velocity-orange)" }} />
                  </div>
                  <p className="text-[11px] mt-1.5 text-text-muted">impressions &middot; Too early for conclusions</p>
                </div>
                {/* Email Outreach */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-text-muted" />
                      <span className="text-xs font-medium text-text-secondary">Email Outreach</span>
                    </div>
                    <span className="text-xs font-bold font-mono" style={{ color: "var(--color-accent-blue)" }}>0/10</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-border-subtle">
                    <div className="h-full rounded-full" style={{ width: "0%", background: "var(--color-accent-blue)" }} />
                  </div>
                  <p className="text-[11px] mt-1.5 text-text-muted">emails sent &middot; Awaiting review</p>
                </div>
                {/* Review date */}
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border-subtle bg-bg-primary/30">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-text-muted" />
                    <span className="text-xs text-text-muted">Next review</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-bg-tertiary text-text-primary font-mono">Feb 13</span>
                </div>
              </div>
            </Card>

            {/* Activity Feed */}
            <Card delay="400ms" ready={ready}>
              <SectionHeader icon={Activity} title="Activity Feed" color="var(--color-accent-green)">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-bg-tertiary text-text-tertiary">Recent</span>
              </SectionHeader>
              <div className="px-6 pb-6 space-y-1">
                {ACTIVITY.map((a, i) => {
                  const AIcon = a.icon
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-bg-primary/30 transition-colors ${ready ? "slide-in" : "opacity-0"}`}
                      style={{ animationDelay: `${500 + i * 50}ms` }}
                    >
                      <div className="mt-0.5 w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in oklch, ${a.color} 14%, transparent)` }}>
                        <AIcon size={12} style={{ color: a.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed text-text-secondary">{a.text}</p>
                        <p className="text-[10px] mt-0.5 text-text-muted font-mono">{a.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Row 3: Pipeline Table ────────────────────────────────── */}
        <Card delay="500ms" ready={ready}>
          <SectionHeader icon={Users} title="Pipeline" color="var(--color-accent-blue)">
            <Link href="/leads" className="flex items-center gap-1.5 text-xs font-semibold transition-colors group" style={{ color: "var(--color-accent-blue)" }}>
              View all 18 <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </SectionHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-primary/30">
                  {["Club", "Region", "Status", "Contact", "Score", ""].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider px-6 py-3 border-y border-border-subtle text-text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADS.map((lead, i) => (
                  <tr key={i} className="group border-b border-border-subtle/40 last:border-b-0 hover:bg-bg-tertiary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border border-border-default text-text-tertiary bg-bg-tertiary group-hover:border-border-hover transition-colors">
                          {lead.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <span className="text-sm font-semibold text-text-primary">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border border-border-default text-text-tertiary bg-bg-tertiary">
                        <MapPin size={10} /> {lead.loc}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge style={STATUS_STYLES[lead.status]}>{lead.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">{lead.contact}</td>
                    <td className="px-6 py-4"><ScoreBar score={lead.score} /></td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-text-muted opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 cursor-pointer hover:text-accent-blue">
                        Open <ChevronRight size={12} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── Row 4: Quick Access ──────────────────────────────────── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 ${ready ? "fade-up" : "opacity-0"}`} style={{ animationDelay: "600ms" }}>
          {QUICK_ACCESS.map((c, i) => {
            const Icon = c.icon
            return (
              <Link
                key={c.title}
                href={c.href}
                className="hover-lift bg-bg-secondary rounded-xl border border-border-subtle group"
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `color-mix(in oklch, ${c.color} 14%, transparent)` }}>
                    <Icon size={18} style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary font-[--font-display]">{c.title}</h4>
                    <p className="text-[11px] text-text-muted">{c.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-text-muted group-hover:text-text-tertiary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
