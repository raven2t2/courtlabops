"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
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
} from "lucide-react"
import { cn } from "@/lib/utils"

type BadgeTone = "critical" | "high" | "medium" | "warm" | "contacted" | "new" | "live" | "neutral"
type ColumnTone = "blue" | "orange" | "green" | "violet"

type BoardCard = {
  id: string
  title: string
  org: string
  owner: string
  due: string
  priority: Exclude<BadgeTone, "live" | "neutral">
}

type BoardColumn = {
  id: string
  title: string
  hint: string
  tone: ColumnTone
  cards: BoardCard[]
}

const STATS = [
  { label: "Total Leads", value: 18, delta: "+44%", sub: "+8 VIC expansion", icon: Users, tone: "blue" as ColumnTone },
  { label: "Upcoming Events", value: 6, delta: "2 this week", sub: "1 critical deadline", icon: CalendarDays, tone: "orange" as ColumnTone },
  { label: "Coach Prospects", value: 5, delta: "+2", sub: "3 high priority", icon: Trophy, tone: "green" as ColumnTone },
  { label: "Competitors", value: 5, delta: "Live tracking", sub: "Weekly sweeps", icon: Shield, tone: "violet" as ColumnTone },
]

const INITIAL_COLUMNS: BoardColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    hint: "Needs owner",
    tone: "blue",
    cards: [
      { id: "c1", title: "Launch SA winter combine page", org: "Growth", owner: "MR", due: "Feb 10", priority: "high" },
      { id: "c2", title: "Build coach partner FAQ sequence", org: "Lifecycle", owner: "HN", due: "Feb 12", priority: "medium" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    hint: "Executing now",
    tone: "orange",
    cards: [
      { id: "c3", title: "Easter Classic booth package", org: "Events", owner: "MR", due: "Feb 13", priority: "critical" },
      { id: "c4", title: "Forestville outreach sprint", org: "Sales", owner: "SS", due: "Feb 9", priority: "warm" },
      { id: "c5", title: "Competitor pricing refresh", org: "Research", owner: "AL", due: "Feb 11", priority: "medium" },
    ],
  },
  {
    id: "waiting",
    title: "Waiting",
    hint: "Blocked / external",
    tone: "violet",
    cards: [
      { id: "c6", title: "Nunawading intro approval", org: "Leads", owner: "MR", due: "Feb 14", priority: "contacted" },
      { id: "c7", title: "Ad account whitelist", org: "Ops", owner: "AL", due: "Feb 15", priority: "high" },
    ],
  },
  {
    id: "done",
    title: "Done This Week",
    hint: "Closed loop",
    tone: "green",
    cards: [
      { id: "c8", title: "Melbourne Tigers added", org: "Pipeline", owner: "SS", due: "Done", priority: "new" },
      { id: "c9", title: "Jan analytics baseline", org: "Insights", owner: "HN", due: "Done", priority: "new" },
    ],
  },
]

const CALENDAR_CELLS: ReadonlyArray<{ date: string; day: number; outside?: boolean }> = [
  { date: "2026-02-01", day: 1 },
  { date: "2026-02-02", day: 2 },
  { date: "2026-02-03", day: 3 },
  { date: "2026-02-04", day: 4 },
  { date: "2026-02-05", day: 5 },
  { date: "2026-02-06", day: 6 },
  { date: "2026-02-07", day: 7 },
  { date: "2026-02-08", day: 8 },
  { date: "2026-02-09", day: 9 },
  { date: "2026-02-10", day: 10 },
  { date: "2026-02-11", day: 11 },
  { date: "2026-02-12", day: 12 },
  { date: "2026-02-13", day: 13 },
  { date: "2026-02-14", day: 14 },
  { date: "2026-02-15", day: 15 },
  { date: "2026-02-16", day: 16 },
  { date: "2026-02-17", day: 17 },
  { date: "2026-02-18", day: 18 },
  { date: "2026-02-19", day: 19 },
  { date: "2026-02-20", day: 20 },
  { date: "2026-02-21", day: 21 },
  { date: "2026-02-22", day: 22 },
  { date: "2026-02-23", day: 23 },
  { date: "2026-02-24", day: 24 },
  { date: "2026-02-25", day: 25 },
  { date: "2026-02-26", day: 26 },
  { date: "2026-02-27", day: 27 },
  { date: "2026-02-28", day: 28 },
  { date: "2026-03-01", day: 1, outside: true },
  { date: "2026-03-02", day: 2, outside: true },
  { date: "2026-03-03", day: 3, outside: true },
  { date: "2026-03-04", day: 4, outside: true },
  { date: "2026-03-05", day: 5, outside: true },
  { date: "2026-03-06", day: 6, outside: true },
  { date: "2026-03-07", day: 7, outside: true },
]

const CALENDAR_EVENTS: Record<string, { label: string; tone: BadgeTone }> = {
  "2026-02-03": { label: "Coach campaign launch", tone: "medium" },
  "2026-02-06": { label: "Outreach sprint", tone: "high" },
  "2026-02-13": { label: "Review cycle", tone: "critical" },
  "2026-02-18": { label: "Easter booth payment", tone: "critical" },
  "2026-02-24": { label: "VIC outbound day", tone: "new" },
}

const ACTIVITY_FEED = [
  { text: "Apple Search Ads crossed 161 impressions", time: "2h ago", icon: TrendingUp, tone: "text-velocity-orange" },
  { text: "Melbourne Tigers added to pipeline", time: "5h ago", icon: UserCheck, tone: "text-accent-green" },
  { text: "Competitor update logged for HomeCourt", time: "1d ago", icon: Shield, tone: "text-accent-violet" },
  { text: "Easter Classic registration reminder fired", time: "1d ago", icon: AlertTriangle, tone: "text-accent-red" },
]

const LATEST_ADDITIONS = [
  {
    title: "True Drag-and-Drop Kanban",
    detail: "Cards now move across columns and reorder in-place via drag and drop.",
    time: "Now",
    icon: Activity,
    tone: "text-hyper-blue",
  },
  {
    title: "Calendar Planner",
    detail: "Monthly calendar shows GTM and event deadlines with quick visual priority markers.",
    time: "Today",
    icon: CalendarDays,
    tone: "text-velocity-orange",
  },
  {
    title: "Latest Additions Feed",
    detail: "A dedicated release rail surfaces what changed without scanning commits.",
    time: "Today",
    icon: Star,
    tone: "text-accent-green",
  },
]

const PIPELINE_LEADS = [
  { name: "Forestville Eagles", loc: "SA", status: "warm" as const, contact: "Head Coach", score: 87 },
  { name: "North Adelaide Rockets", loc: "SA", status: "contacted" as const, contact: "President", score: 81 },
  { name: "Melbourne Tigers", loc: "VIC", status: "new" as const, contact: "Youth Director", score: 75 },
  { name: "Sturt Sabres", loc: "SA", status: "new" as const, contact: "Operations Mgr", score: 72 },
  { name: "Nunawading Spectres", loc: "VIC", status: "new" as const, contact: "Head of Programs", score: 70 },
]

function moveCard(
  columns: BoardColumn[],
  fromColumnId: string,
  cardId: string,
  toColumnId: string,
  toIndex: number
): BoardColumn[] {
  const next = columns.map((column) => ({ ...column, cards: [...column.cards] }))
  const fromColumn = next.find((column) => column.id === fromColumnId)
  const toColumn = next.find((column) => column.id === toColumnId)

  if (!fromColumn || !toColumn) return columns

  const fromIndex = fromColumn.cards.findIndex((card) => card.id === cardId)
  if (fromIndex < 0) return columns

  const [card] = fromColumn.cards.splice(fromIndex, 1)
  if (!card) return columns

  let insertAt = Math.max(0, Math.min(toIndex, toColumn.cards.length))
  if (fromColumn.id === toColumn.id && fromIndex < insertAt) insertAt -= 1

  toColumn.cards.splice(insertAt, 0, card)
  return next
}

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
  const toneClass = score >= 80 ? "bg-hyper-blue" : score >= 70 ? "bg-velocity-orange" : "bg-text-muted"
  const textClass = score >= 80 ? "text-hyper-blue" : score >= 70 ? "text-velocity-orange" : "text-text-muted"

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
  const [columns, setColumns] = useState<BoardColumn[]>(INITIAL_COLUMNS)
  const [dragging, setDragging] = useState<{ cardId: string; fromColumnId: string } | null>(null)
  const [dropTarget, setDropTarget] = useState<{ columnId: string; index: number } | null>(null)

  const totalBoardCards = useMemo(() => columns.reduce((sum, column) => sum + column.cards.length, 0), [columns])

  const clearDnDState = () => {
    setDragging(null)
    setDropTarget(null)
  }

  const handleDrop = (toColumnId: string, toIndex: number) => {
    if (!dragging) return

    setColumns((prev) => moveCard(prev, dragging.fromColumnId, dragging.cardId, toColumnId, toIndex))
    clearDnDState()
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">CourtLab Command Center</p>
                <Badge tone="live">Live</Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Out-Operate Every Competitor</h1>
              <p className="mt-1 text-sm text-text-secondary">Tailwind 4 workspace with premium board execution, calendar visibility, and live release updates.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search workspace"
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

        <div className="mb-4 grid gap-4 xl:grid-cols-[1.38fr_0.62fr]">
          <Surface className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <div>
                <h2 className="text-base font-bold text-text-primary">Kanban Execution Board</h2>
                <p className="text-xs text-text-secondary">Drag cards across columns and reorder in place.</p>
              </div>
              <Badge tone="neutral">{totalBoardCards} cards</Badge>
            </div>

            <div className="overflow-x-auto">
              <div className="grid min-w-[1180px] grid-cols-4 gap-3 p-3">
                {columns.map((column) => (
                  <div key={column.id} className="rounded-xl border border-border-subtle bg-bg-primary p-2.5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-text-primary">{column.title}</p>
                        <p className="text-[11px] text-text-muted">{column.hint}</p>
                      </div>
                      <Badge tone="neutral">{column.cards.length}</Badge>
                    </div>

                    <div className="space-y-1.5">
                      {Array.from({ length: column.cards.length + 1 }).map((_, slotIndex) => {
                        const card = slotIndex < column.cards.length ? column.cards[slotIndex] : null
                        const showDropTarget =
                          dropTarget?.columnId === column.id && dropTarget?.index === slotIndex && dragging !== null

                        return (
                          <div key={`${column.id}-slot-${slotIndex}`}>
                            <div
                              className={cn("h-2 rounded-md transition-colors", showDropTarget ? "bg-hyper-blue/35" : "bg-transparent")}
                              onDragOver={(event) => {
                                event.preventDefault()
                                if (!dragging) return
                                event.dataTransfer.dropEffect = "move"
                                setDropTarget({ columnId: column.id, index: slotIndex })
                              }}
                              onDrop={(event) => {
                                event.preventDefault()
                                handleDrop(column.id, slotIndex)
                              }}
                            />

                            {card ? (
                              <article
                                draggable
                                onDragStart={(event) => {
                                  setDragging({ cardId: card.id, fromColumnId: column.id })
                                  event.dataTransfer.effectAllowed = "move"
                                  event.dataTransfer.setData("text/plain", card.id)
                                }}
                                onDragEnd={clearDnDState}
                                className={cn(
                                  "rounded-lg border border-border-default bg-bg-secondary p-2.5 transition-opacity",
                                  dragging?.cardId === card.id ? "opacity-30" : "opacity-100"
                                )}
                              >
                                <p className="text-xs font-semibold text-text-primary">{card.title}</p>
                                <p className="mt-1 text-[11px] text-text-secondary">{card.org}</p>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <Badge tone={card.priority}>{card.priority}</Badge>
                                  <span className="text-[11px] text-text-muted">{card.due}</span>
                                </div>

                                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                                  Owner {card.owner}
                                </div>
                              </article>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Surface>

          <div className="space-y-4">
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
                  return (
                    <div
                      key={cell.date}
                      className={cn(
                        "min-h-12 rounded-lg border p-1.5",
                        cell.outside
                          ? "border-border-subtle/40 bg-bg-primary/30 text-text-muted/60"
                          : "border-border-subtle bg-bg-primary text-text-secondary"
                      )}
                    >
                      <p className="text-[11px] font-semibold">{cell.day}</p>
                      {event ? (
                        <div
                          className={cn(
                            "mt-1 h-1.5 rounded-full",
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

              <div className="mt-3 space-y-2">
                {Object.entries(CALENDAR_EVENTS).slice(0, 3).map(([date, item]) => (
                  <div key={date} className="rounded-lg border border-border-subtle bg-bg-primary px-2.5 py-2">
                    <p className="text-[11px] font-semibold text-text-primary">{item.label}</p>
                    <p className="text-[10px] text-text-muted">{date}</p>
                  </div>
                ))}
              </div>
            </Surface>

            <Surface>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-text-primary">Next Milestones</h2>
                <Clock3 size={14} className="text-text-muted" />
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-border-subtle bg-bg-primary p-2.5">
                  <p className="text-xs font-semibold text-text-primary">Easter Classic booth payment</p>
                  <p className="text-[11px] text-text-secondary">Due February 18, 2026</p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-bg-primary p-2.5">
                  <p className="text-xs font-semibold text-text-primary">VIC outreach day</p>
                  <p className="text-[11px] text-text-secondary">Due February 24, 2026</p>
                </div>
              </div>
            </Surface>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-text-primary">Pipeline Snapshot</h2>
              <Link href="/leads" className="inline-flex items-center gap-1 text-xs font-semibold text-hyper-blue">
                View all <ArrowUpRight size={12} />
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

            <div className="space-y-2 md:hidden">
              {PIPELINE_LEADS.map((lead) => (
                <div key={lead.name} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-text-primary">{lead.name}</p>
                    <Badge tone={lead.status}>{lead.status}</Badge>
                  </div>
                  <p className="mb-2 text-xs text-text-secondary">
                    {lead.contact} · {lead.loc}
                  </p>
                  <ScoreBar score={lead.score} />
                </div>
              ))}
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

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { title: "Events", desc: "Easter Classic in 8 weeks", icon: CalendarDays, href: "/events", tone: "text-velocity-orange" },
                { title: "Leads", desc: "18 clubs across SA + VIC", icon: Users, href: "/leads", tone: "text-hyper-blue" },
                { title: "Competitors", desc: "5 active products tracked", icon: Shield, href: "/competitors", tone: "text-accent-violet" },
                { title: "Coaches", desc: "5 affiliate prospects", icon: Star, href: "/coaches", tone: "text-accent-green" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.title} href={item.href}>
                    <Surface className="transition-colors hover:bg-bg-tertiary/40">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-primary">
                          <Icon size={15} className={item.tone} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-text-primary">{item.title}</p>
                          <p className="text-xs text-text-secondary">{item.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-text-muted" />
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
