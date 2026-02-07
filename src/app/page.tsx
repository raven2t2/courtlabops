"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users, Calendar, Trophy, ChevronRight, Search, Bell, Clock,
  AlertTriangle, Eye, Mail, TrendingUp, MapPin, Star, Plus,
  ArrowUpRight, Activity, Zap, Flame, Shield, CalendarDays,
  UserCheck, AlertCircle
} from "lucide-react"

// ── Data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Leads", value: 18, delta: "+44%", sub: "+8 VIC expansion", icon: Users, accent: "#3B82F6", accentBg: "rgba(59,130,246,0.12)" },
  { label: "Upcoming Events", value: 6, sub: "1 critical deadline", icon: CalendarDays, accent: "#F97316", accentBg: "rgba(249,115,22,0.10)" },
  { label: "Coach Prospects", value: 5, delta: "+2", sub: "3 high priority", icon: Trophy, accent: "#22C55E", accentBg: "rgba(34,197,94,0.10)" },
  { label: "Competitors", value: 5, sub: "Active tracking", icon: Eye, accent: "#8B5CF6", accentBg: "rgba(139,92,246,0.10)" },
]

const PRIORITY_ACTIONS = [
  { title: "Easter Classic 2026", desc: "Apr 3-6 -- 8 weeks out. Lock in booth + demo stations now.", level: "critical", tag: "8 weeks", icon: Flame },
  { title: "Dodo Elyazar Follow-up", desc: "Jan tour done. Pitch 2026 camp partnerships. Decision pending.", level: "high", tag: "Follow-up", icon: Zap },
  { title: "Forestville Eagles Outreach", desc: "Zane's club -- warm lead. Personalized email drafted, ready to send.", level: "medium", tag: "Ready", icon: Mail },
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
  { text: "Apple Search Ads crossed 161 impressions", time: "2h ago", icon: TrendingUp, color: "#F97316" },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, color: "#22C55E" },
  { text: "Competitor analysis updated -- HomeCourt", time: "1d ago", icon: Shield, color: "#8B5CF6" },
  { text: "Easter Classic registration deadline alert", time: "1d ago", icon: AlertCircle, color: "#EF4444" },
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
  const color = score >= 80 ? "#3B82F6" : score >= 70 ? "#F97316" : "#52525B"
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-1.5 rounded-full overflow-hidden bg-[#27272A]">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums font-mono" style={{ color }}>{score}</span>
    </div>
  )
}

// ── Progress metric ─────────────────────────────────────────────────────
function ProgressMetric({ label, icon: Icon, value, total, unit, note, color }: {
  label: string; icon: typeof TrendingUp; value: number; total: number; unit: string; note: string; color: string
}) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="p-4 rounded-xl border border-[#1E1E24] bg-[#0F0F11]">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-[#52525B]" />
          <span className="text-xs font-semibold text-[#A1A1AA]">{label}</span>
        </div>
        <span className="text-sm font-bold tabular-nums font-mono" style={{ color }}>
          {value}{total ? `/${total}` : ""}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-[#27272A]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <p className="text-[11px] mt-2 text-[#52525B]">{unit} &middot; {note}</p>
    </div>
  )
}

// ── Badge ───────────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    default:   { bg: "#18181B", color: "#71717A", border: "#27272A" },
    critical:  { bg: "rgba(239,68,68,0.10)", color: "#EF4444", border: "rgba(239,68,68,0.20)" },
    high:      { bg: "rgba(245,158,11,0.10)", color: "#F59E0B", border: "rgba(245,158,11,0.20)" },
    medium:    { bg: "rgba(59,130,246,0.10)", color: "#3B82F6", border: "rgba(59,130,246,0.20)" },
    warm:      { bg: "rgba(249,115,22,0.10)", color: "#F97316", border: "rgba(249,115,22,0.20)" },
    new:       { bg: "rgba(34,197,94,0.10)", color: "#22C55E", border: "rgba(34,197,94,0.20)" },
    contacted: { bg: "rgba(139,92,246,0.10)", color: "#8B5CF6", border: "rgba(139,92,246,0.20)" },
    live:      { bg: "rgba(34,197,94,0.10)", color: "#22C55E", border: "rgba(34,197,94,0.20)" },
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
    <div className="min-h-full bg-[#09090B]">
      {/* Header */}
      <header className="sticky top-0 z-20 px-6 lg:px-8 py-4 flex items-center justify-between border-b border-[#1E1E24] bg-[#09090B]/90 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-tight text-white">Dashboard</h1>
            <Badge variant="live">Live</Badge>
          </div>
          <p className="text-xs mt-0.5 text-[#52525B]">Australia-first execution &middot; Combines are the Trojan horse</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#27272A] bg-[#0F0F11]">
            <Search size={14} className="text-[#52525B]" />
            <input type="text" placeholder="Search ops..." className="bg-transparent border-none outline-none text-sm w-40 text-white placeholder-[#52525B]" />
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#27272A] bg-[#18181B] text-[#52525B]">&#8984;K</kbd>
          </div>
          <button className="relative p-2 rounded-lg border border-[#27272A] bg-[#0F0F11] hover:bg-[#18181B] transition-colors">
            <Bell size={15} className="text-[#71717A]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse bg-[#F97316]" />
          </button>
          <Link href="/leads" className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/20 transition-all">
            <Plus size={14} /> New Lead
          </Link>
        </div>
      </header>

      <div className="p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6">
        {/* Stats Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${ready ? "fade-up" : ""}`}>
          {STATS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-[#0F0F11] rounded-xl border border-[#1E1E24] p-5 hover:border-[#27272A] transition-all" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-[#52525B]">{s.label}</p>
                    <p className="text-3xl font-extrabold tracking-tight text-white">
                      <AnimNum target={s.value} delay={i * 120} />
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-[#52525B]">{s.sub}</span>
                      {s.delta && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">{s.delta}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.accentBg }}>
                    <Icon size={18} style={{ color: s.accent }} strokeWidth={2} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Priority Actions */}
          <div className="xl:col-span-7">
            <div className={`bg-[#0F0F11] rounded-xl border border-[#1E1E24] ${ready ? "fade-up" : ""}`} style={{ animationDelay: "250ms" }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F97316]/10">
                    <AlertTriangle size={15} className="text-[#F97316]" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-white">Priority Actions</h3>
                </div>
                <Badge variant="critical">3 pending</Badge>
              </div>
              <div className="px-5 pb-5 space-y-2">
                {PRIORITY_ACTIONS.map((a, i) => {
                  const AIcon = a.icon
                  const levelColors: Record<string, { bg: string; color: string }> = {
                    critical: { bg: "rgba(239,68,68,0.10)", color: "#EF4444" },
                    high: { bg: "rgba(245,158,11,0.10)", color: "#F59E0B" },
                    medium: { bg: "rgba(59,130,246,0.10)", color: "#3B82F6" },
                  }
                  const lc = levelColors[a.level] || levelColors.medium
                  return (
                    <div key={i} className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-[#1E1E24] bg-[#0A0A0D] hover:border-[#27272A] hover:bg-[#0F0F11] transition-all cursor-pointer">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: lc.bg }}>
                        <AIcon size={15} style={{ color: lc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-semibold text-white">{a.title}</h4>
                          <Badge variant={a.level}>{a.level}</Badge>
                        </div>
                        <p className="text-xs truncate text-[#52525B]">{a.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-70">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#18181B] text-[#71717A] font-mono">{a.tag}</span>
                        <ChevronRight size={14} className="text-[#3F3F46]" />
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
            <div className={`bg-[#0F0F11] rounded-xl border border-[#1E1E24] ${ready ? "fade-up" : ""}`} style={{ animationDelay: "350ms" }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3B82F6]/12">
                    <TrendingUp size={15} className="text-[#3B82F6]" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-white">Performance</h3>
                </div>
              </div>
              <div className="px-5 pb-5 space-y-3">
                <ProgressMetric label="Apple Search Ads" icon={TrendingUp} value={161} total={1000} unit="impressions" note="Too early for conclusions" color="#F97316" />
                <ProgressMetric label="Email Outreach" icon={Mail} value={0} total={10} unit="emails sent" note="Awaiting review" color="#3B82F6" />
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#1E1E24] bg-[#0A0A0D]">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#52525B]" />
                    <span className="text-xs text-[#52525B]">Next review cycle</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#18181B] text-white font-mono">Feb 13</span>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className={`bg-[#0F0F11] rounded-xl border border-[#1E1E24] ${ready ? "fade-up" : ""}`} style={{ animationDelay: "450ms" }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#22C55E]/10">
                    <Activity size={15} className="text-[#22C55E]" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-white">Activity Feed</h3>
                </div>
              </div>
              <div className="px-5 pb-5 space-y-3">
                {ACTIVITY.map((a, i) => {
                  const AIcon = a.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}15` }}>
                        <AIcon size={12} style={{ color: a.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed text-[#A1A1AA]">{a.text}</p>
                        <p className="text-[10px] mt-0.5 text-[#52525B] font-mono">{a.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Table */}
        <div className={`bg-[#0F0F11] rounded-xl border border-[#1E1E24] ${ready ? "fade-up" : ""}`} style={{ animationDelay: "550ms" }}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3B82F6]/12">
                <Users size={15} className="text-[#3B82F6]" strokeWidth={2.2} />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-white">Pipeline</h3>
            </div>
            <Link href="/leads" className="flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
              View all 18 <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0A0A0D]">
                  {["Club", "Region", "Status", "Contact", "Score", ""].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold uppercase tracking-wider px-5 py-3 border-b border-[#1E1E24] text-[#52525B]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADS.map((lead, i) => (
                  <tr key={i} className="group border-b border-[#0F0F11] hover:bg-[#18181B]/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold border border-[#27272A] text-[#71717A] bg-[#18181B]">
                          {lead.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        <span className="text-sm font-semibold text-white">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border border-[#27272A] text-[#71717A] bg-[#18181B]">
                        <MapPin size={10} /> {lead.loc}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant={lead.status}>{lead.status}</Badge></td>
                    <td className="px-5 py-3.5 text-xs text-[#52525B]">{lead.contact}</td>
                    <td className="px-5 py-3.5"><ScoreBar score={lead.score} /></td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-xs font-semibold text-[#52525B] opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 cursor-pointer hover:text-white">
                        Open <ChevronRight size={12} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Access */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${ready ? "fade-up" : ""}`} style={{ animationDelay: "650ms" }}>
          {[
            { title: "Leads", desc: "18 clubs - SA + VIC", icon: Users, color: "#3B82F6", bg: "rgba(59,130,246,0.12)", href: "/leads" },
            { title: "Events", desc: "Easter Classic in 8w", icon: CalendarDays, color: "#F97316", bg: "rgba(249,115,22,0.10)", href: "/events" },
            { title: "Competitors", desc: "5 apps tracked", icon: Shield, color: "#8B5CF6", bg: "rgba(139,92,246,0.10)", href: "/competitors" },
            { title: "Coaches", desc: "5 affiliate prospects", icon: Star, color: "#22C55E", bg: "rgba(34,197,94,0.10)", href: "/coaches" },
          ].map(c => {
            const Icon = c.icon
            return (
              <Link key={c.title} href={c.href} className="bg-[#0F0F11] rounded-xl border border-[#1E1E24] hover:border-[#27272A] transition-all cursor-pointer">
                <div className="p-4 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                    <Icon size={18} style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                    <p className="text-[11px] text-[#52525B]">{c.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-[#3F3F46]" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
