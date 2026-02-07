"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Search,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  User,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"

type BadgeTone = "critical" | "high" | "medium" | "warm" | "contacted" | "new" | "live" | "neutral"
type ColumnTone = "blue" | "orange" | "green" | "violet"

type BoardCard = {
  id: string
  title: string
  description?: string
  org: string
  owner: string
  due: string
  priority: Exclude<BadgeTone, "live" | "neutral">
  tags?: string[]
  status?: string
  completed?: string
}

type BoardColumn = {
  id: string
  title: string
  hint: string
  tone: ColumnTone
  cards: BoardCard[]
}

type KanbanData = {
  version: string
  lastUpdated: string
  updatedBy: string
  columns: BoardColumn[]
  owners: Record<string, {
    role: string
    tasks: {
      total: number
      backlog: number
      inProgress: number
      waiting: number
      done: number
    }
  }>
  archive: Record<string, any[]>
}

const STATS = [
  { label: "Total Leads", value: 34, delta: "+26", sub: "SA + VIC", icon: Users, tone: "blue" as ColumnTone },
  { label: "Upcoming Events", value: 1, delta: "8 weeks", sub: "Easter Classic", icon: CalendarDays, tone: "orange" as ColumnTone },
  { label: "Coach Prospects", value: 20, delta: "20 targets", sub: "Affiliate pipeline", icon: Trophy, tone: "green" as ColumnTone },
  { label: "Gallery Assets", value: 207, delta: "105+102", sub: "Images + Videos", icon: Star, tone: "violet" as ColumnTone },
]

const CALENDAR_CELLS: ReadonlyArray<{ date: string; day: number; outside?: boolean }> = [
  { date: "2026-02-01", day: 1 }, { date: "2026-02-02", day: 2 }, { date: "2026-02-03", day: 3 },
  { date: "2026-02-04", day: 4 }, { date: "2026-02-05", day: 5 }, { date: "2026-02-06", day: 6 },
  { date: "2026-02-07", day: 7 }, { date: "2026-02-08", day: 8 }, { date: "2026-02-09", day: 9 },
  { date: "2026-02-10", day: 10 }, { date: "2026-02-11", day: 11 }, { date: "2026-02-12", day: 12 },
  { date: "2026-02-13", day: 13 }, { date: "2026-02-14", day: 14 }, { date: "2026-02-15", day: 15 },
  { date: "2026-02-16", day: 16 }, { date: "2026-02-17", day: 17 }, { date: "2026-02-18", day: 18 },
  { date: "2026-02-19", day: 19 }, { date: "2026-02-20", day: 20 }, { date: "2026-02-21", day: 21 },
  { date: "2026-02-22", day: 22 }, { date: "2026-02-23", day: 23 }, { date: "2026-02-24", day: 24 },
  { date: "2026-02-25", day: 25 }, { date: "2026-02-26", day: 26 }, { date: "2026-02-27", day: 27 },
  { date: "2026-02-28", day: 28 },
  { date: "2026-03-01", day: 1, outside: true }, { date: "2026-03-02", day: 2, outside: true },
  { date: "2026-03-03", day: 3, outside: true }, { date: "2026-03-04", day: 4, outside: true },
  { date: "2026-03-05", day: 5, outside: true }, { date: "2026-03-06", day: 6, outside: true },
  { date: "2026-03-07", day: 7, outside: true },
]

const CALENDAR_EVENTS: Record<string, { label: string; tone: BadgeTone }> = {
  "2026-02-08": { label: "FB/IG tokens due", tone: "critical" },
  "2026-02-09": { label: "Forestville sprint", tone: "high" },
  "2026-02-13": { label: "ASA 7-day review", tone: "critical" },
  "2026-02-14": { label: "Sponsor proposal", tone: "critical" },
  "2026-02-18": { label: "Easter booth payment", tone: "critical" },
  "2026-02-24": { label: "VIC outreach day", tone: "new" },
}

const ACTIVITY_FEED = [
  { text: "Gallery wired to 207 assets", time: "Just now", icon: CheckCircle, tone: "text-accent-green" },
  { text: "Kanban restructured with PM tracking", time: "Just now", icon: Activity, tone: "text-hyper-blue" },
  { text: "Apple Search Ads at 161 impressions", time: "2h ago", icon: TrendingUp, tone: "text-velocity-orange" },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, tone: "text-accent-green" },
]

const LATEST_ADDITIONS = [
  { title: "Gallery API Integration", detail: "207 assets now live via GitHub with category filters and search", time: "Now", icon: Star, tone: "text-accent-green" },
  { title: "Kanban PM Tracking", detail: "Full task archive with owner sections for Michael + Esther", time: "Now", icon: Activity, tone: "text-hyper-blue" },
  { title: "Content Auto-Posting", detail: "Approval queue → Auto-publish at scheduled times (9am, 11am, 2pm, 4pm, 6pm, 8pm)", time: "Today", icon: CalendarDays, tone: "text-velocity-orange" },
]

const PIPELINE_LEADS = [
  { name: "Forestville Eagles", loc: "SA", status: "warm" as const, contact: "Head Coach", score: 95 },
  { name: "Frankston Blues", loc: "VIC", status: "contacted" as const, contact: "GM Mitchell Condick", score: 88 },
  { name: "Melbourne Tigers", loc: "VIC", status: "new" as const, contact: "Youth Director", score: 85 },
  { name: "Sturt Sabres", loc: "SA", status: "new" as const, contact: "Operations Mgr", score: 82 },
  { name: "Knox Raiders", loc: "VIC", status: "new" as const, contact: "Head of Programs", score: 80 },
]

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
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

function ScoreBar({ score }: { score: number }) {
  const toneClass = score >= 85 ? "bg-accent-green" : score >= 75 ? "bg-hyper-blue" : score >= 65 ? "bg-velocity-orange" : "bg-text-muted"
  const textClass = score >= 85 ? "text-accent-green" : score >= 75 ? "text-hyper-blue" : score >= 65 ? "text-velocity-orange" : "text-text-muted"

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border-default">
        <div className={cn("h-full rounded-full", toneClass)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("text-xs font-bold", textClass)}>{score}</span>
    </div>
  )
}

function StatIcon({ tone, children }: { tone: ColumnTone; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl",
        tone === "blue" && "bg-hyper-blue-muted text-hyper-blue",
        tone === "orange" && "bg-velocity-orange-muted text-velocity-orange",
        tone === "green" && "bg-accent-green-muted text-accent-green",
        tone === "violet" && "bg-accent-violet-muted text-accent-violet"
      )}
    >
      {children}
    </div>
  )
}

export default function Dashboard() {
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null)
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [selectedOwner, setSelectedOwner] = useState<string | "all">("all")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch kanban data
  useEffect(() => {
    loadKanban()
  }, [])

  const loadKanban = async () => {
    try {
      const res = await fetch('/api/kanban')
      const data = await res.json()
      setKanbanData(data)
      setColumns(data.columns || [])
    } catch (err) {
      console.error('Failed to load kanban:', err)
    }
    setIsLoading(false)
  }

  // Filter columns by owner
  const filteredColumns = useMemo(() => {
    if (selectedOwner === "all" || !columns) return columns
    return columns.map(col => ({
      ...col,
      cards: col.cards.filter(card => card.owner === selectedOwner)
    }))
  }, [columns, selectedOwner])

  const totalBoardCards = useMemo(() => 
    filteredColumns.reduce((sum, column) => sum + column.cards.length, 0), 
    [filteredColumns]
  )

  const ownerStats = kanbanData?.owners || {}

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        {/* Header */}
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">CourtLab Command Center</p>
                <Badge tone="live">PM Active</Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Project Dashboard</h1>
              <p className="mt-1 text-sm text-text-secondary">Kanban execution board with task ownership, archive, and live updates.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary">
                <Bell size={14} /> Alerts
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white">
                <Plus size={14} /> Add Task
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{item.label}</p>
                    <StatIcon tone={item.tone}>
                      <Icon size={15} />
                    </StatIcon>
                  </div>
                  <p className="text-3xl font-extrabold text-text-primary">{item.value}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                    <span>{item.sub}</span>
                    <Badge tone="medium">{item.delta}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </Surface>

        {/* Owner Filter Bar */}
        <Surface className="mb-4 p-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-text-muted">Filter by owner:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOwner("all")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedOwner === "all"
                    ? "bg-hyper-blue text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                <Users size={12} />
                All Tasks ({kanbanData?.columns?.reduce((s, c) => s + c.cards.length, 0) || 0})
              </button>
              <button
                onClick={() => setSelectedOwner("Michael")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedOwner === "Michael"
                    ? "bg-accent-green text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                <User size={12} />
                Michael ({ownerStats.Michael?.tasks.total || 0})
              </button>
              <button
                onClick={() => setSelectedOwner("Esther")}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedOwner === "Esther"
                    ? "bg-velocity-orange text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                <Bot size={12} />
                Esther ({ownerStats.Esther?.tasks.total || 0})
              </button>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
              <span>Last updated: {kanbanData?.lastUpdated ? new Date(kanbanData.lastUpdated).toLocaleString() : '—'}</span>
            </div>
          </div>
        </Surface>

        {/* Kanban Board */}
        <div className="mb-4">
          <Surface className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-text-primary">Execution Board</h2>
                <Badge tone="neutral">{totalBoardCards} active</Badge>
                {selectedOwner !== "all" && (
                  <Badge tone={selectedOwner === "Michael" ? "new" : "warm"}>
                    {selectedOwner}'s tasks
                  </Badge>
                )}
              </div>
              <Link href="/archive" className="text-xs font-semibold text-hyper-blue hover:underline">
                View Archive →
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-hyper-blue border-t-transparent" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid min-w-[1180px] grid-cols-4 gap-3 p-3">
                  {filteredColumns.map((column) => (
                    <div key={column.id} className="rounded-xl border border-border-subtle bg-bg-primary p-2.5">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-text-primary">{column.title}</p>
                          <p className="text-[11px] text-text-muted">{column.hint}</p>
                        </div>
                        <Badge tone="neutral">{column.cards.length}</Badge>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {column.cards.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-border-subtle bg-bg-secondary p-4 text-center">
                            <p className="text-xs text-text-muted">No tasks</p>
                          </div>
                        ) : (
                          column.cards.map((card) => (
                            <article
                              key={card.id}
                              className="rounded-lg border border-border-default bg-bg-secondary p-3 transition-all hover:border-hyper-blue/50"
                            >
                              <p className="text-xs font-semibold text-text-primary">{card.title}</p>
                              {card.description && (
                                <p className="mt-1 text-[11px] text-text-secondary line-clamp-2">{card.description}</p>
                              )}
                              
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <Badge tone={card.priority}>{card.priority}</Badge>
                                <span className="text-[11px] text-text-muted">Due {card.due}</span>
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                                  {card.org} · {card.owner}
                                </span>
                                {card.tags && (
                                  <div className="flex gap-1">
                                    {card.tags.slice(0, 2).map(tag => (
                                      <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-bg-tertiary text-text-muted">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Surface>
        </div>

        {/* Calendar + Milestones */}
        <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_0.5fr]">
          <Surface>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-text-primary">Calendar Planner</h2>
              <Badge tone="neutral">Feb 2026</Badge>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {CALENDAR_CELLS.map((cell) => {
                const event = CALENDAR_EVENTS[cell.date]
                const isToday = cell.date === "2026-02-07"
                return (
                  <div
                    key={cell.date}
                    className={cn(
                      "min-h-10 rounded-lg border p-1",
                      cell.outside
                        ? "border-border-subtle/40 bg-bg-primary/30 text-text-muted/60"
                        : "border-border-subtle bg-bg-primary text-text-secondary",
                      isToday && "border-hyper-blue bg-hyper-blue/10"
                    )}
                  >
                    <p className={cn("text-[11px] font-semibold", isToday && "text-hyper-blue")}>{cell.day}</p>
                    {event ? (
                      <div
                        className={cn(
                          "mt-0.5 h-1 rounded-full",
                          event.tone === "critical" && "bg-accent-red",
                          event.tone === "high" && "bg-accent-amber",
                          event.tone === "medium" && "bg-hyper-blue",
                          event.tone === "new" && "bg-accent-green"
                        )}
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(CALENDAR_EVENTS).map(([date, item]) => (
                <div key={date} className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-primary px-2.5 py-2">
                  <div className={cn("h-2 w-2 rounded-full", 
                    item.tone === "critical" && "bg-accent-red",
                    item.tone === "high" && "bg-accent-amber",
                    item.tone === "medium" && "bg-hyper-blue",
                    item.tone === "new" && "bg-accent-green"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-text-primary truncate">{item.label}</p>
                    <p className="text-[10px] text-text-muted">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          <div className="space-y-4">
            <Surface>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-text-primary">Next Milestones</h2>
                <Clock3 size={14} className="text-text-muted" />
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border-l-2 border-accent-red bg-bg-primary p-2.5">
                  <p className="text-xs font-semibold text-text-primary">FB/IG API tokens</p>
                  <p className="text-[11px] text-text-secondary">Due Feb 8 · Michael</p>
                </div>
                <div className="rounded-lg border-l-2 border-accent-amber bg-bg-primary p-2.5">
                  <p className="text-xs font-semibold text-text-primary">Apple Ads 7-day review</p>
                  <p className="text-[11px] text-text-secondary">Due Feb 13 · Esther</p>
                </div>
                <div className="rounded-lg border-l-2 border-accent-red bg-bg-primary p-2.5">
                  <p className="text-xs font-semibold text-text-primary">Easter booth payment</p>
                  <p className="text-[11px] text-text-secondary">Due Feb 18 · Michael</p>
                </div>
              </div>
            </Surface>

            <Surface>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-text-primary">Owner Summary</h2>
                <Users size={14} className="text-text-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-bg-primary p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-green">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-text-primary">Michael</span>
                  </div>
                  <span className="text-xs font-bold text-accent-green">{ownerStats.Michael?.tasks.total || 0} tasks</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-bg-primary p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-velocity-orange">
                      <Bot size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-text-primary">Esther (PM)</span>
                  </div>
                  <span className="text-xs font-bold text-velocity-orange">{ownerStats.Esther?.tasks.total || 0} tasks</span>
                </div>
              </div>
            </Surface>
          </div>
        </div>

        {/* Pipeline + Activity */}
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-text-primary">Pipeline Snapshot</h2>
              <Link href="/leads" className="inline-flex items-center gap-1 text-xs font-semibold text-hyper-blue">
                View all 34 <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-border-subtle md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-primary">
                    {["Club", "Region", "Status", "Contact", "Score"].map((header) => (
                      <th key={header} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PIPELINE_LEADS.map((lead) => (
                    <tr key={lead.name} className="border-t border-border-subtle">
                      <td className="px-3 py-2.5 font-semibold text-text-primary">{lead.name}</td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-border-default px-2 py-0.5 text-xs text-text-secondary">
                          <MapPin size={10} /> {lead.loc}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={lead.status}>{lead.status}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-text-secondary">{lead.contact}</td>
                      <td className="px-3 py-2.5">
                        <ScoreBar score={lead.score} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>

          <div className="space-y-4">
            <Surface>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-text-primary">Latest Additions</h2>
                <Badge tone="new">3 New</Badge>
              </div>

              <div className="space-y-2">
                {LATEST_ADDITIONS.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <Icon size={13} className={item.tone} />
                        <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                        <span className="ml-auto text-[10px] text-text-muted">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-text-secondary">{item.detail}</p>
                    </div>
                  )
                })}
              </div>
            </Surface>

            <Surface>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-text-primary">Live Activity</h2>
                <Activity size={15} className="text-text-muted" />
              </div>

              <div className="space-y-2">
                {ACTIVITY_FEED.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.text} className="flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-primary p-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-bg-tertiary">
                        <Icon size={12} className={item.tone} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-primary">{item.text}</p>
                        <p className="mt-0.5 text-[11px] text-text-muted">{item.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  )
}
