"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users, Calendar, Trophy, ChevronRight, Search, Bell, Clock,
  AlertTriangle, Eye, Mail, TrendingUp, MapPin, Star, Plus,
  ArrowUpRight, Activity, Zap, Flame, Shield, CalendarDays,
  UserCheck, AlertCircle, Sparkles, BarChart3, Target
} from "lucide-react"

// ── Data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Leads", value: 18, delta: "+44%", sub: "+8 VIC expansion", icon: Users, accent: "var(--color-accent-blue)", accentBg: "var(--color-accent-blue-muted)" },
  { label: "Upcoming Events", value: 6, sub: "1 critical deadline", icon: CalendarDays, accent: "var(--color-velocity-orange)", accentBg: "var(--color-velocity-orange-muted)" },
  { label: "Coach Prospects", value: 5, delta: "+2", sub: "3 high priority", icon: Trophy, accent: "var(--color-accent-green)", accentBg: "var(--color-accent-green-muted)" },
  { label: "Competitors", value: 5, sub: "Active tracking", icon: Eye, accent: "var(--color-accent-violet)", accentBg: "var(--color-accent-violet-muted)" },
]

const PRIORITY_ACTIONS = [
  { title: "Easter Classic 2026", desc: "Apr 3-6 — 8 weeks out. Lock in booth + demo stations now.", level: "critical", tag: "8 weeks", icon: Flame },
  { title: "Dodo Elyazar Follow-up", desc: "Jan tour done. Pitch 2026 camp partnerships. Decision pending.", level: "high", tag: "Follow-up", icon: Zap },
  { title: "Forestville Eagles Outreach", desc: "Zane's club — warm lead. Personalized email drafted, ready to send.", level: "medium", tag: "Ready", icon: Mail },
]

const LEADS = [
  { name: "Forestville Eagles", loc: "SA", status: "warm", contact: "Head Coach", score: 87 },
  { name: "North Adelaide Rockets", loc: "SA", status: "contacted", contact: "President", score: 81 },
  { name: "Melbourne Tigers", loc: "VIC", status: "new", contact: "Youth Director", score: 75 },
  { name: "Sturt Sabres", loc: "SA", status: "new", contact: "Operations Mgr", score: 72 },
  { name: "Nunawading Spectres", loc: "VIC", status: "new", contact: "Head of Programs", score: 70 },
  { name: "Woodville Warriors", loc: "SA", status: "new", contact: "Club Secretary", score: 68 },
]

const ACTIVITY = [
  { text: "Apple Search Ads crossed 161 impressions", time: "2h ago", icon: TrendingUp, color: "var(--color-velocity-orange)" },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, color: "var(--color-accent-green)" },
  { text: "Competitor analysis updated — HomeCourt", time: "1d ago", icon: Shield, color: "var(--color-accent-violet)" },
  { text: "Easter Classic registration deadline alert", time: "1d ago", icon: AlertCircle, color: "var(--color-accent-red)" },
]

// ── Animated counter ────────────────────────────────────────────────────
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
  return <span>{val}</span>
}

// ── Score bar ───────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 80
    ? "var(--color-accent-blue)"
    : score >= 70
      ? "var(--color-velocity-orange)"
      : "var(--color-text-muted)"
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-1.5 rounded-full overflow-hidden bg-bg-elevated">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums font-[--font-mono]" style={{ color }}>{score}</span>
    </div>
  )
}

// ── Progress metric ─────────────────────────────────────────────────────
function ProgressMetric({ label, icon: Icon, value, total, unit, note, color }: {
  label: string; icon: typeof TrendingUp; value: number; total: number; unit: string; note: string; color: string
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="p-4 rounded-xl border border-border-subtle bg-bg-primary/50 hover:border-border-default transition-all group">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-text-muted group-hover:text-text-tertiary transition-colors" />
          <span className="text-xs font-semibold text-text-secondary">{label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums font-[--font-mono]" style={{ color }}>
          {value}{total ? `/${total}` : ""}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-bg-elevated">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[11px] mt-2 text-text-muted">{unit} &middot; {note}</p>
    </div>
  )
}

// ── Badge ───────────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    default:   { bg: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)", border: "var(--color-border-default)" },
    critical:  { bg: "var(--color-accent-red-muted)", color: "var(--color-accent-red)", border: "oklch(0.637 0.237 25 / 0.20)" },
    high:      { bg: "var(--color-accent-amber-muted)", color: "var(--color-accent-amber)", border: "oklch(0.769 0.188 84 / 0.20)" },
    medium:    { bg: "var(--color-accent-blue-muted)", color: "var(--color-accent-blue)", border: "oklch(0.623 0.214 259 / 0.20)" },
    warm:      { bg: "var(--color-accent-orange-muted)", color: "var(--color-accent-orange)", border: "oklch(0.702 0.194 41 / 0.20)" },
    new:       { bg: "var(--color-accent-green-muted)", color: "var(--color-accent-green)", border: "oklch(0.723 0.219 149 / 0.20)" },
    contacted: { bg: "var(--color-accent-violet-muted)", color: "var(--color-accent-violet)", border: "oklch(0.586 0.22 293 / 0.20)" },
    live:      { bg: "var(--color-accent-green-muted)", color: "var(--color-accent-green)", border: "oklch(0.723 0.219 149 / 0.20)" },
  }
  const s = styles[variant] || styles.default
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {(variant === "critical" || variant === "live") && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />}
      {children}
    </span>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  return (
    <div className="min-h-full bg-bg-primary">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 px-6 lg:px-8 py-4 flex items-center justify-between border-b border-border-subtle glass">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-tight text-text-primary font-[--font-display]">Dashboard</h1>
            <Badge variant="live">Live</Badge>
          </div>
          <p className="text-xs mt-0.5 text-text-muted">Australia-first execution &middot; Combines are the Trojan horse</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-bg-secondary/80 backdrop-blur-sm">
            <Search size={14} className="text-text-muted" />
            <input type="text" placeholder="Search ops..." className="bg-transparent border-none outline-none text-sm w-40 text-text-primary placeholder:text-text-muted" />
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border-default bg-bg-tertiary text-text-muted">&#8984;K</kbd>
          </div>
          <button className="relative p-2 rounded-lg border border-border-default bg-bg-secondary hover:bg-bg-tertiary transition-all hover:border-border-hover">
            <Bell size={15} className="text-text-tertiary" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full pulse-glow" style={{ background: "var(--color-velocity-orange)" }} />
          </button>
          <Link href="/leads" className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-accent-blue hover:bg-accent-blue-hover shadow-lg shadow-accent-blue/20 transition-all hover:shadow-accent-blue/30 hover:-translate-y-0.5">
            <Plus size={14} /> New Lead
          </Link>
        </div>
      </header>

      <div className="p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6">

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${ready ? "fade-up" : ""}`}>
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label}
                className="hover-lift cq-card bg-bg-secondary rounded-xl border border-border-subtle p-5 group cursor-default"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-text-muted">{s.label}</p>
                    <p className="text-3xl font-extrabold tracking-tight text-text-primary font-[--font-display]">
                      <AnimNum target={s.value} delay={i * 120} />
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-text-muted">{s.sub}</span>
                      {s.delta && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-green-muted text-accent-green">{s.delta}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: s.accentBg }}>
                    <Icon size={18} style={{ color: s.accent }} strokeWidth={2} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Two-column layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Priority Actions */}
          <div className="xl:col-span-7">
            <div className={`cq-widget bg-bg-secondary rounded-xl border border-border-subtle overflow-hidden ${ready ? "fade-up" : ""}`} style={{ animationDelay: "250ms" }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-velocity-orange-muted">
                    <AlertTriangle size={15} className="text-velocity-orange" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-text-primary font-[--font-display]">Priority Actions</h3>
                </div>
                <Badge variant="critical">3 pending</Badge>
              </div>
              <div className="px-5 pb-5 space-y-2">
                {PRIORITY_ACTIONS.map((a, i) => {
                  const AIcon = a.icon
                  const levelColors: Record<string, { bg: string; color: string }> = {
                    critical: { bg: "var(--color-accent-red-muted)", color: "var(--color-accent-red)" },
                    high: { bg: "var(--color-accent-amber-muted)", color: "var(--color-accent-amber)" },
                    medium: { bg: "var(--color-accent-blue-muted)", color: "var(--color-accent-blue)" },
                  }
                  const lc = levelColors[a.level] || levelColors.medium
                  return (
                    <div key={i}
                      className={`group flex items-center gap-3.5 p-3.5 rounded-xl border border-border-subtle bg-bg-primary/40 hover:border-border-default hover:bg-bg-primary/70 transition-all cursor-pointer ${ready ? "slide-in" : ""}`}
                      style={{ animationDelay: `${300 + i * 80}ms` }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: lc.bg }}>
                        <AIcon size={15} style={{ color: lc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-semibold text-text-primary">{a.title}</h4>
                          <Badge variant={a.level}>{a.level}</Badge>
                        </div>
                        <p className="text-xs truncate text-text-muted">{a.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-bg-tertiary text-text-tertiary font-mono">{a.tag}</span>
                        <ChevronRight size={14} className="text-border-hover group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="xl:col-span-5 space-y-6">
            {/* Performance */}
            <div className={`cq-widget bg-bg-secondary rounded-xl border border-border-subtle overflow-hidden ${ready ? "fade-up" : ""}`} style={{ animationDelay: "350ms" }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-blue-muted">
                    <BarChart3 size={15} className="text-accent-blue" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-text-primary font-[--font-display]">Performance</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-accent-blue-muted text-accent-blue">This week</span>
              </div>
              <div className="px-5 pb-5 space-y-3">
                <ProgressMetric label="Apple Search Ads" icon={TrendingUp} value={161} total={1000} unit="impressions" note="Too early for conclusions" color="var(--color-velocity-orange)" />
                <ProgressMetric label="Email Outreach" icon={Mail} value={0} total={10} unit="emails sent" note="Awaiting review" color="var(--color-accent-blue)" />
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border-subtle bg-bg-primary/40 group hover:border-border-default transition-all">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-text-muted" />
                    <span className="text-xs text-text-muted">Next review cycle</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-bg-tertiary text-text-primary font-mono">Feb 13</span>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className={`bg-bg-secondary rounded-xl border border-border-subtle overflow-hidden ${ready ? "fade-up" : ""}`} style={{ animationDelay: "450ms" }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-green-muted">
                    <Activity size={15} className="text-accent-green" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-text-primary font-[--font-display]">Activity Feed</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-bg-tertiary text-text-tertiary">Recent</span>
              </div>
              <div className="px-5 pb-5 space-y-1">
                {ACTIVITY.map((a, i) => {
                  const AIcon = a.icon
                  return (
                    <div key={i}
                      className={`flex items-start gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-bg-primary/40 transition-colors ${ready ? "slide-in" : ""}`}
                      style={{ animationDelay: `${500 + i * 60}ms` }}>
                      <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in oklch, ${a.color} 15%, transparent)` }}>
                        <AIcon size={13} style={{ color: a.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed text-text-secondary">{a.text}</p>
                        <p className="text-[10px] mt-0.5 text-text-muted font-mono">{a.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pipeline Table ──────────────────────────────────────────── */}
        <div className={`bg-bg-secondary rounded-xl border border-border-subtle overflow-hidden ${ready ? "fade-up" : ""}`} style={{ animationDelay: "550ms" }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-blue-muted">
                <Users size={15} className="text-accent-blue" strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-text-primary font-[--font-display]">Pipeline</h3>
                <p className="text-[10px] text-text-muted">Top leads by score</p>
              </div>
            </div>
            <Link href="/leads" className="flex items-center gap-1.5 text-xs font-semibold text-accent-blue hover:text-accent-blue-hover transition-colors group">
              View all 18 <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-primary/40">
                  {["Club", "Region", "Status", "Contact", "Score", ""].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider px-5 py-3 border-b border-border-subtle text-text-muted first:pl-5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADS.map((lead, i) => (
                  <tr key={i} className="group border-b border-border-subtle/50 last:border-b-0 hover:bg-bg-primary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border border-border-default text-text-tertiary bg-bg-tertiary group-hover:border-border-hover transition-colors">
                          {lead.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <span className="text-sm font-semibold text-text-primary">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border border-border-default text-text-tertiary bg-bg-tertiary">
                        <MapPin size={10} /> {lead.loc}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant={lead.status}>{lead.status}</Badge></td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">{lead.contact}</td>
                    <td className="px-5 py-3.5"><ScoreBar score={lead.score} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-xs font-semibold text-text-muted opacity-0 group-hover:opacity-100 transition-all inline-flex items-center gap-1 cursor-pointer hover:text-accent-blue">
                        Open <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quick Access ────────────────────────────────────────────── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${ready ? "fade-up" : ""}`} style={{ animationDelay: "650ms" }}>
          {[
            { title: "Leads", desc: "18 clubs — SA + VIC", icon: Users, color: "var(--color-accent-blue)", bg: "var(--color-accent-blue-muted)", href: "/leads" },
            { title: "Events", desc: "Easter Classic in 8w", icon: CalendarDays, color: "var(--color-velocity-orange)", bg: "var(--color-velocity-orange-muted)", href: "/events" },
            { title: "Competitors", desc: "5 apps tracked", icon: Shield, color: "var(--color-accent-violet)", bg: "var(--color-accent-violet-muted)", href: "/competitors" },
            { title: "Coaches", desc: "5 affiliate prospects", icon: Star, color: "var(--color-accent-green)", bg: "var(--color-accent-green-muted)", href: "/coaches" },
          ].map((c, i) => {
            const Icon = c.icon
            return (
              <Link key={c.title} href={c.href}
                className="hover-lift bg-bg-secondary rounded-xl border border-border-subtle group"
                style={{ animationDelay: `${650 + i * 60}ms` }}>
                <div className="p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: c.bg }}>
                    <Icon size={18} style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary font-[--font-display]">{c.title}</h4>
                    <p className="text-[11px] text-text-muted">{c.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-border-hover group-hover:text-text-tertiary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
