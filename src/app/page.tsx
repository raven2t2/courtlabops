"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import {
  Users, ChevronRight, Search, Bell, Clock,
  AlertTriangle, Eye, Mail, TrendingUp, MapPin, Star, Plus,
  ArrowUpRight, Activity, Zap, Flame, Shield, CalendarDays,
  UserCheck, AlertCircle, Trophy
} from "lucide-react"

// ── Dark OKLCH palette (mapped 1:1 from light reference) ─────────────────────
const P = {
  hyperBlue:      "oklch(0.546 0.245 264)",
  hyperBlueMuted: "oklch(0.546 0.245 264 / 0.12)",
  velocityOrange: "oklch(0.632 0.26 30)",
  velocityMuted:  "oklch(0.632 0.26 30 / 0.10)",
  success:        "oklch(0.723 0.219 149)",
  successMuted:   "oklch(0.723 0.219 149 / 0.10)",
  warning:        "oklch(0.769 0.188 84)",
  warningMuted:   "oklch(0.769 0.188 84 / 0.10)",
  danger:         "oklch(0.637 0.237 25)",
  dangerMuted:    "oklch(0.637 0.237 25 / 0.10)",
  violet:         "oklch(0.586 0.22 293)",
  violetMuted:    "oklch(0.586 0.22 293 / 0.10)",
  // Dark-mode surface colors
  pageBg:         "oklch(0.145 0.005 285)",
  cardBg:         "oklch(0.17 0.005 285)",
  subtleBg:       "oklch(0.135 0.005 285)",
  borderSubtle:   "oklch(0.22 0.008 280)",
  borderDefault:  "oklch(0.275 0.006 285)",
  heading:        "oklch(0.985 0.002 285)",
  body:           "oklch(0.705 0.015 286)",
  secondary:      "oklch(0.553 0.014 286)",
  muted:          "oklch(0.42 0.012 286)",
  icon:           "oklch(0.355 0.014 286)",
}

// ── Primitive components (matching reference API exactly) ────────────────────
function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl border shadow-sm ${className}`} style={{ background: P.cardBg, borderColor: P.borderDefault, ...style }}>
      {children}
    </div>
  )
}

function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between px-5 pt-5 pb-3 ${className}`}>{children}</div>
}

function CardTitle({ children, icon: Icon, iconColor }: { children: ReactNode; icon?: typeof Users; iconColor?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {Icon && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: iconColor || P.hyperBlueMuted }}>
          <Icon size={15} style={{ color: iconColor ? "white" : P.hyperBlue }} strokeWidth={2.2} />
        </div>
      )}
      <h3 className="text-sm font-semibold tracking-tight" style={{ color: P.heading }}>{children}</h3>
    </div>
  )
}

function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>
}

function Badge({ children, variant = "default" }: { children: ReactNode; variant?: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    default:   { bg: P.borderSubtle, color: P.secondary, border: P.borderDefault },
    critical:  { bg: P.dangerMuted, color: P.danger, border: "oklch(0.637 0.237 25 / 0.2)" },
    high:      { bg: P.warningMuted, color: P.warning, border: "oklch(0.769 0.188 84 / 0.2)" },
    medium:    { bg: P.hyperBlueMuted, color: P.hyperBlue, border: "oklch(0.546 0.245 264 / 0.2)" },
    warm:      { bg: P.velocityMuted, color: P.velocityOrange, border: "oklch(0.632 0.26 30 / 0.2)" },
    new:       { bg: P.successMuted, color: P.success, border: "oklch(0.723 0.219 149 / 0.2)" },
    contacted: { bg: P.violetMuted, color: P.violet, border: "oklch(0.586 0.22 293 / 0.2)" },
    live:      { bg: P.successMuted, color: P.success, border: "oklch(0.723 0.219 149 / 0.25)" },
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

function Button({ children, variant = "default", size = "sm", className = "", ...props }: {
  children: ReactNode; variant?: string; size?: string; className?: string; [key: string]: unknown
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
  const sizes: Record<string, string> = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" }
  const variants: Record<string, React.CSSProperties> = {
    default: { background: P.borderSubtle, color: P.body, border: `1px solid ${P.borderDefault}` },
    primary: { background: P.hyperBlue, color: "#fff", border: "none", boxShadow: "0 2px 8px oklch(0.546 0.245 264 / 0.3)" },
    ghost:   { background: "transparent", color: P.secondary, border: "none" },
    orange:  { background: P.velocityOrange, color: "#fff", border: "none", boxShadow: "0 2px 8px oklch(0.632 0.26 30 / 0.3)" },
  }
  return (
    <button className={`${base} ${sizes[size] || sizes.sm} ${className}`} style={variants[variant] || variants.default} {...props}>
      {children}
    </button>
  )
}

// ── Data (identical to reference) ────────────────────────────────────────────
const STATS = [
  { label: "Total Leads", value: 18, delta: "+44%", deltaType: "up", sub: "+8 VIC expansion", icon: Users, accent: P.hyperBlue, accentBg: P.hyperBlueMuted },
  { label: "Upcoming Events", value: 6, delta: null, sub: "1 critical deadline", icon: CalendarDays, accent: P.velocityOrange, accentBg: P.velocityMuted },
  { label: "Coach Prospects", value: 5, delta: "+2", deltaType: "up", sub: "3 high priority", icon: Trophy, accent: P.success, accentBg: P.successMuted },
  { label: "Competitors", value: 5, delta: null, sub: "Active tracking", icon: Eye, accent: P.violet, accentBg: P.violetMuted },
]

const PRIORITY_ACTIONS = [
  { title: "Easter Classic 2026", desc: "Apr 3–6 — 8 weeks out. Lock in booth + demo stations now.", level: "critical", tag: "8 weeks", icon: Flame },
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
  { text: "Apple Search Ads crossed 161 impressions", time: "2h ago", icon: TrendingUp, color: P.velocityOrange },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, color: P.success },
  { text: "Competitor analysis updated — HomeCourt", time: "1d ago", icon: Shield, color: P.violet },
  { text: "Easter Classic registration deadline alert", time: "1d ago", icon: AlertCircle, color: P.danger },
]

// ── AnimNum (from reference) ─────────────────────────────────────────────────
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

// ── ScoreBar (from reference, dark-ified) ────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? P.hyperBlue : score >= 70 ? P.velocityOrange : P.muted
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: P.borderDefault }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>{score}</span>
    </div>
  )
}

// ── ProgressMetric (from reference, dark-ified) ──────────────────────────────
function ProgressMetric({ label, icon: Icon, value, total, unit, note, color }: {
  label: string; icon: typeof TrendingUp; value: number; total: number; unit: string; note: string; color: string
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: P.borderSubtle, background: P.subtleBg }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color: P.muted }} />
          <span className="text-xs font-semibold" style={{ color: P.body }}>{label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>
          {value}{total ? `/${total}` : ""}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: P.borderDefault }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[11px] mt-2" style={{ color: P.muted }}>{unit} · {note}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  return (
    <>
      {/* ── Header (sticky, glass) ──────────────────────────────────── */}
      <header className="sticky top-0 z-20 px-8 py-4 flex items-center justify-between border-b"
        style={{ background: `oklch(0.145 0.005 285 / 0.9)`, backdropFilter: "blur(12px)", borderColor: P.borderDefault }}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-tight" style={{ color: P.heading, fontFamily: "'Outfit', sans-serif" }}>Dashboard</h1>
            <Badge variant="live">Live</Badge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: P.secondary }}>Australia-first execution · Combines are the Trojan horse</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: P.cardBg, borderColor: P.borderDefault }}>
            <Search size={14} style={{ color: P.muted }} />
            <input type="text" placeholder="Search ops..." className="bg-transparent border-none outline-none text-sm w-40"
              style={{ color: P.body }} />
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ background: P.subtleBg, borderColor: P.borderDefault, color: P.muted }}>⌘K</kbd>
          </div>
          <button className="relative p-2 rounded-lg border transition-colors" style={{ background: P.cardBg, borderColor: P.borderDefault }}>
            <Bell size={15} style={{ color: P.secondary }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse" style={{ background: P.velocityOrange }} />
          </button>
          <Button variant="primary" size="sm"><Plus size={14} /> New Lead</Button>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="p-8 max-w-[1360px] mx-auto space-y-6">

        {/* ── Stats Grid (4-col, same as reference) ──────────────── */}
        <div className={`grid grid-cols-4 gap-4 ${ready ? "fade-up" : ""}`}>
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <Card key={s.label} className="hover-lift" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: P.muted }}>{s.label}</p>
                      <p className="text-3xl font-extrabold tracking-tight" style={{ color: P.heading, fontFamily: "'Outfit', sans-serif" }}>
                        <AnimNum target={s.value} delay={i * 120} />
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px]" style={{ color: P.secondary }}>{s.sub}</span>
                        {s.delta && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: P.successMuted, color: P.success }}>{s.delta}</span>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.accentBg }}>
                      <Icon size={18} style={{ color: s.accent }} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* ── Two-column layout (grid-cols-12, 7/5 split) ────────── */}
        <div className="grid grid-cols-12 gap-6">

          {/* Priority Actions (col-span-7) */}
          <div className="col-span-7">
            <Card className={`${ready ? "fade-up" : ""}`} style={{ animationDelay: "250ms" }}>
              <CardHeader>
                <CardTitle icon={AlertTriangle} iconColor={P.velocityMuted}>Priority Actions</CardTitle>
                <Badge variant="critical">3 pending</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {PRIORITY_ACTIONS.map((a, i) => {
                    const AIcon = a.icon
                    return (
                      <div key={i} className="group flex items-center gap-3.5 p-3.5 rounded-lg border transition-all cursor-pointer"
                        style={{ borderColor: P.borderSubtle, background: P.subtleBg }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = P.borderDefault; e.currentTarget.style.background = P.cardBg }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = P.borderSubtle; e.currentTarget.style.background = P.subtleBg }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: a.level === "critical" ? P.dangerMuted : a.level === "high" ? P.warningMuted : P.hyperBlueMuted }}>
                          <AIcon size={15} style={{ color: a.level === "critical" ? P.danger : a.level === "high" ? P.warning : P.hyperBlue }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-sm font-semibold" style={{ color: P.heading }}>{a.title}</h4>
                            <Badge variant={a.level}>{a.level}</Badge>
                          </div>
                          <p className="text-xs truncate" style={{ color: P.secondary }}>{a.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-70">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                            style={{ background: P.borderSubtle, color: P.secondary, fontFamily: "'JetBrains Mono', monospace" }}>{a.tag}</span>
                          <ChevronRight size={14} style={{ color: P.icon }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column (col-span-5) */}
          <div className="col-span-5 space-y-6">

            {/* Performance */}
            <Card className={`${ready ? "fade-up" : ""}`} style={{ animationDelay: "350ms" }}>
              <CardHeader>
                <CardTitle icon={TrendingUp}>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProgressMetric label="Apple Search Ads" icon={TrendingUp} value={161} total={1000}
                  unit="impressions" note="Too early for conclusions" color={P.velocityOrange} />
                <ProgressMetric label="Email Outreach" icon={Mail} value={0} total={10}
                  unit="emails sent" note="Awaiting review" color={P.hyperBlue} />
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border" style={{ borderColor: P.borderSubtle, background: P.subtleBg }}>
                  <div className="flex items-center gap-2">
                    <Clock size={13} style={{ color: P.muted }} />
                    <span className="text-xs" style={{ color: P.secondary }}>Next review cycle</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md"
                    style={{ background: P.borderSubtle, color: P.heading, fontFamily: "'JetBrains Mono', monospace" }}>Feb 13</span>
                </div>
              </CardContent>
            </Card>

            {/* Activity */}
            <Card className={`${ready ? "fade-up" : ""}`} style={{ animationDelay: "450ms" }}>
              <CardHeader>
                <CardTitle icon={Activity}>Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ACTIVITY.map((a, i) => {
                    const AIcon = a.icon
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15` }}>
                          <AIcon size={12} style={{ color: a.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed" style={{ color: P.body }}>{a.text}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: P.muted, fontFamily: "'JetBrains Mono', monospace" }}>{a.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Leads Pipeline Table ────────────────────────────────── */}
        <Card className={`${ready ? "fade-up" : ""}`} style={{ animationDelay: "550ms" }}>
          <CardHeader>
            <CardTitle icon={Users}>Pipeline</CardTitle>
            <Link href="/leads" className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: P.hyperBlue }}>
              View all 18 <ArrowUpRight size={13} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ background: P.subtleBg }}>
                    {["Club", "Region", "Status", "Contact", "Score", ""].map(h => (
                      <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider px-5 py-3 border-b"
                        style={{ color: P.muted, borderColor: P.borderSubtle }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((lead, i) => (
                    <tr key={i} className="group transition-colors border-b" style={{ borderColor: P.pageBg }}
                      onMouseEnter={e => e.currentTarget.style.background = P.subtleBg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold border"
                            style={{ borderColor: P.borderDefault, color: P.secondary, background: P.subtleBg }}>
                            {lead.name.split(" ").map(w => w[0]).join("")}
                          </div>
                          <span className="text-sm font-semibold" style={{ color: P.heading }}>{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border"
                          style={{ borderColor: P.borderDefault, color: P.secondary, background: P.subtleBg }}>
                          <MapPin size={10} /> {lead.loc}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><Badge variant={lead.status}>{lead.status}</Badge></td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: P.secondary }}>{lead.contact}</td>
                      <td className="px-5 py-3.5"><ScoreBar score={lead.score} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          Open <ChevronRight size={12} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ── Quick Access (4-col, same as reference) ─────────────── */}
        <div className={`grid grid-cols-4 gap-4 ${ready ? "fade-up" : ""}`} style={{ animationDelay: "650ms" }}>
          {[
            { title: "Leads", desc: "18 clubs · SA + VIC", icon: Users, color: P.hyperBlue, bg: P.hyperBlueMuted, href: "/leads" },
            { title: "Events", desc: "Easter Classic in 8w", icon: CalendarDays, color: P.velocityOrange, bg: P.velocityMuted, href: "/events" },
            { title: "Competitors", desc: "5 apps tracked", icon: Shield, color: P.violet, bg: P.violetMuted, href: "/competitors" },
            { title: "Coaches", desc: "5 affiliate prospects", icon: Star, color: P.success, bg: P.successMuted, href: "/coaches" },
          ].map(c => {
            const Icon = c.icon
            return (
              <Link key={c.title} href={c.href}>
                <Card className="hover-lift cursor-pointer">
                  <div className="p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                      <Icon size={18} style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold" style={{ color: P.heading }}>{c.title}</h4>
                      <p className="text-[11px]" style={{ color: P.muted }}>{c.desc}</p>
                    </div>
                    <ChevronRight size={14} style={{ color: P.icon }} />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
