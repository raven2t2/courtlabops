"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Copy,
  Eye,
  Filter,
  Mail,
  RefreshCcw,
  Search,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ApprovalCategory = "social" | "outreach"
type ApprovalPriority = "highest" | "high" | "medium" | "low"
type ApprovalAction = "approve" | "reject"

interface ApprovalTask {
  id: string
  title: string
  description?: string
  priority: ApprovalPriority | string
  platform?: string
  account?: string
  contact?: string
  owner: string
  type: string
  category: ApprovalCategory | string
  preview: string
  fullText?: string
  action: string
  links?: {
    internal: Array<{ label: string; url: string }>
    external: Array<{ label: string; url: string }>
  }
}

interface ApprovalStats {
  social: number
  outreach: number
  highest: number
  high: number
  medium: number
  low: number
}

interface ApprovalHistory {
  approved: ApprovalTask[]
  rejected: ApprovalTask[]
  totalApproved: number
  totalRejected: number
}

type TaskOutcome = "pending" | "approved" | "rejected"

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>
      {children}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { tone: string; label: string }> = {
    highest: { tone: "border-accent-red/40 bg-accent-red-muted text-accent-red", label: "Highest" },
    high: { tone: "border-accent-orange/40 bg-accent-orange-muted text-accent-orange", label: "High" },
    medium: { tone: "border-accent-amber/40 bg-accent-amber-muted text-accent-amber", label: "Medium" },
    low: { tone: "border-accent-green/40 bg-accent-green-muted text-accent-green", label: "Low" },
  }

  const current = config[priority] || config.low
  return <Badge className={current.tone}>{current.label}</Badge>
}

function getPlatformLabel(platform?: string): string {
  if (!platform) return "Unknown"
  if (platform === "twitter") return "Twitter/X"
  if (platform === "email") return "Email"
  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

function compact(text: string, max = 120): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3)}...`
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalTask[]>([])
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [history, setHistory] = useState<ApprovalHistory>({
    approved: [],
    rejected: [],
    totalApproved: 0,
    totalRejected: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<"all" | ApprovalCategory>("all")
  const [filterPriority, setFilterPriority] = useState<"all" | ApprovalPriority>("all")
  const [filterPlatform, setFilterPlatform] = useState<"all" | string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [actionInProgress, setActionInProgress] = useState<ApprovalAction | null>(null)

  useEffect(() => {
    void loadApprovals()
  }, [])

  async function loadApprovals(): Promise<void> {
    setIsLoading(true)

    try {
      const response = await fetch("/api/approvals", { cache: "no-store" })
      const data = (await response.json()) as {
        approvals?: ApprovalTask[]
        stats?: ApprovalStats
        history?: ApprovalHistory
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to load approvals")
      }

      const nextApprovals = data.approvals || []
      const nextHistory: ApprovalHistory = {
        approved: data.history?.approved || [],
        rejected: data.history?.rejected || [],
        totalApproved: data.history?.totalApproved || 0,
        totalRejected: data.history?.totalRejected || 0,
      }

      setApprovals(nextApprovals)
      setStats(data.stats || null)
      setHistory(nextHistory)

      setSelectedTaskId((current) => {
        const isInPending = current ? nextApprovals.some((task) => task.id === current) : false
        const isInApprovedHistory = current ? nextHistory.approved.some((task) => task.id === current) : false
        const isInRejectedHistory = current ? nextHistory.rejected.some((task) => task.id === current) : false

        if (current && (isInPending || isInApprovedHistory || isInRejectedHistory)) {
          return current
        }

        return nextApprovals[0]?.id || nextHistory.approved[0]?.id || nextHistory.rejected[0]?.id || null
      })
    } catch (error) {
      console.error("Failed to load approvals", error)
      setStatusMessage(error instanceof Error ? error.message : "Failed to load approvals")
    } finally {
      setIsLoading(false)
    }
  }

  async function submitAction(action: ApprovalAction): Promise<void> {
    if (!selectedTaskId) return

    setActionInProgress(action)
    setStatusMessage(null)

    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selectedTaskId, action }),
      })

      const data = (await response.json()) as { success?: boolean; message?: string; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${action} task`)
      }

      setStatusMessage(data.message || `Task ${action}d`)
      await loadApprovals()
    } catch (error) {
      console.error(`Failed to ${action} task`, error)
      setStatusMessage(error instanceof Error ? error.message : `Failed to ${action} task`)
    } finally {
      setActionInProgress(null)
    }
  }

  async function copySelectedMessage(): Promise<void> {
    if (!selectedTask) return

    const message = selectedTask.fullText || selectedTask.preview || selectedTask.description || ""
    if (!message.trim()) {
      setStatusMessage("No message text available to copy.")
      return
    }

    try {
      await navigator.clipboard.writeText(message)
      setStatusMessage("Copied full message to clipboard.")
    } catch (error) {
      console.error("Copy failed", error)
      setStatusMessage("Unable to copy to clipboard in this browser context.")
    }
  }

  const platformOptions = useMemo(() => {
    const unique = new Set<string>()
    for (const approval of approvals) {
      if (approval.platform) unique.add(approval.platform)
    }
    return Array.from(unique).sort()
  }, [approvals])

  const filteredApprovals = useMemo(() => {
    return approvals.filter((task) => {
      const matchesCategory = filterCategory === "all" || task.category === filterCategory
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      const matchesPlatform = filterPlatform === "all" || task.platform === filterPlatform
      const searchable = `${task.title} ${task.description || ""} ${task.preview || ""} ${task.fullText || ""}`.toLowerCase()
      const matchesSearch = searchable.includes(searchQuery.toLowerCase())
      return matchesCategory && matchesPriority && matchesPlatform && matchesSearch
    })
  }, [approvals, filterCategory, filterPriority, filterPlatform, searchQuery])

  const allTasksById = useMemo(() => {
    const map = new Map<string, ApprovalTask>()
    for (const task of approvals) map.set(task.id, task)
    for (const task of history.approved) {
      if (!map.has(task.id)) map.set(task.id, task)
    }
    for (const task of history.rejected) {
      if (!map.has(task.id)) map.set(task.id, task)
    }
    return map
  }, [approvals, history.approved, history.rejected])

  const selectedTask = useMemo(() => (selectedTaskId ? allTasksById.get(selectedTaskId) || null : null), [allTasksById, selectedTaskId])

  const pendingTaskIds = useMemo(() => new Set(approvals.map((task) => task.id)), [approvals])
  const approvedTaskIds = useMemo(() => new Set(history.approved.map((task) => task.id)), [history.approved])
  const rejectedTaskIds = useMemo(() => new Set(history.rejected.map((task) => task.id)), [history.rejected])

  const selectedTaskOutcome: TaskOutcome | null = useMemo(() => {
    if (!selectedTask) return null
    if (pendingTaskIds.has(selectedTask.id)) return "pending"
    if (approvedTaskIds.has(selectedTask.id)) return "approved"
    if (rejectedTaskIds.has(selectedTask.id)) return "rejected"
    return null
  }, [approvedTaskIds, pendingTaskIds, rejectedTaskIds, selectedTask])

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-[1700px] p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Unified Approval Queue</p>
                <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                  <Clock size={10} /> {approvals.length} Pending
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Review, Copy, Approve</h1>
              <p className="mt-1 text-sm text-text-secondary">One place for social drafts, DMs, and email outreach approvals.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => void loadApprovals()}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary disabled:opacity-50"
              >
                <RefreshCcw size={14} /> {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { label: "Total", value: approvals.length, tone: "text-text-primary", icon: Eye },
              { label: "Highest", value: stats?.highest ?? 0, tone: "text-accent-red", icon: AlertCircle },
              { label: "High", value: stats?.high ?? 0, tone: "text-accent-orange", icon: Clock },
              { label: "Medium", value: stats?.medium ?? 0, tone: "text-accent-amber", icon: Filter },
              { label: "Social", value: stats?.social ?? 0, tone: "text-hyper-blue", icon: Check },
              { label: "Outreach", value: stats?.outreach ?? 0, tone: "text-accent-violet", icon: Mail },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{item.label}</p>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-bg-tertiary", item.tone)}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <p className={cn("text-3xl font-extrabold", item.tone)}>{item.value}</p>
                </div>
              )
            })}
          </div>

          {statusMessage ? <p className="mt-3 text-xs text-text-secondary">{statusMessage}</p> : null}
        </Surface>

        <Surface className="mb-4 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-3 py-2">
              <Search size={14} className="text-text-muted" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search approvals"
                className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
            </label>

            <div className="h-4 w-px bg-border-default" />

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-text-muted" />
              <span className="text-xs font-semibold text-text-muted">Filters</span>
            </div>

            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value as "all" | ApprovalCategory)}
              className="rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary"
            >
              <option value="all">All Categories</option>
              <option value="social">Social</option>
              <option value="outreach">Outreach</option>
            </select>

            <select
              value={filterPriority}
              onChange={(event) => setFilterPriority(event.target.value as "all" | ApprovalPriority)}
              className="rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary"
            >
              <option value="all">All Priorities</option>
              <option value="highest">Highest</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterPlatform}
              onChange={(event) => setFilterPlatform(event.target.value)}
              className="rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary"
            >
              <option value="all">All Platforms</option>
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {getPlatformLabel(platform)}
                </option>
              ))}
            </select>
          </div>
        </Surface>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Surface className="max-h-[760px] overflow-auto">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Approval Items</h2>
              <span className="text-xs text-text-muted">{filteredApprovals.length} items</span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary py-10 text-center text-sm text-text-muted">Loading approvals...</div>
              ) : filteredApprovals.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary py-10 text-center text-sm text-text-muted">
                  {approvals.length === 0 ? "All caught up. No pending approvals." : "No approvals match your filters."}
                </div>
              ) : (
                filteredApprovals.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-left transition-all",
                      selectedTaskId === task.id ? "border-hyper-blue bg-hyper-blue/5" : "border-border-subtle bg-bg-primary hover:border-border-default"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text-primary">{task.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{compact(task.preview || task.description || "", 160)}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          <PriorityBadge priority={task.priority} />
                          <Badge className="border-border-default bg-bg-tertiary text-text-secondary capitalize">{task.category}</Badge>
                          {task.platform ? (
                            <Badge className="border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue">{getPlatformLabel(task.platform)}</Badge>
                          ) : null}
                        </div>
                      </div>

                      <ArrowRight size={16} className="shrink-0 text-text-muted" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </Surface>

          <Surface className="max-h-[760px] overflow-auto">
            {selectedTask ? (
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Selected Item</p>
                    <h2 className="mt-1 text-lg font-bold text-text-primary">{selectedTask.title}</h2>
                    <p className="text-xs text-text-muted">{selectedTask.id}</p>
                  </div>
                  <PriorityBadge priority={selectedTask.priority} />
                </div>

                <div className="mb-4 grid gap-2 rounded-xl border border-border-subtle bg-bg-primary p-3 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-text-muted" /> Owner: {selectedTask.owner}
                  </div>
                  <div>Platform: {getPlatformLabel(selectedTask.platform)}</div>
                  {selectedTask.account ? <div>Account: {selectedTask.account}</div> : null}
                  {selectedTask.contact ? <div>Contact: {selectedTask.contact}</div> : null}
                  <div>Action: {selectedTask.action}</div>
                </div>

                <div className="mb-4 rounded-xl border border-border-subtle bg-bg-tertiary p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Full Message</p>
                    <button
                      onClick={() => void copySelectedMessage()}
                      className="inline-flex items-center gap-1 rounded-lg border border-border-default bg-bg-primary px-2 py-1 text-xs font-medium text-text-secondary hover:bg-bg-secondary"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>

                  <div className="max-h-80 overflow-auto rounded-lg border border-border-subtle bg-bg-primary p-3">
                    <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-text-primary">
                      {selectedTask.fullText || selectedTask.preview || selectedTask.description || "No content available."}
                    </p>
                  </div>
                </div>

                {selectedTask.description ? (
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">Context</p>
                    <p className="text-sm text-text-secondary">{selectedTask.description}</p>
                  </div>
                ) : null}

                {selectedTask.links?.external?.length ? (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Resources</p>
                    <div className="space-y-1">
                      {selectedTask.links.external.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-xs font-medium text-hyper-blue hover:underline"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selectedTaskOutcome === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => void submitAction("approve")}
                      disabled={actionInProgress !== null}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-green py-3 text-sm font-semibold text-white hover:bg-accent-green/90 disabled:opacity-50"
                    >
                      <Check size={16} /> {actionInProgress === "approve" ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => void submitAction("reject")}
                      disabled={actionInProgress !== null}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent-red/40 bg-accent-red-muted py-3 text-sm font-semibold text-accent-red hover:bg-accent-red/20 disabled:opacity-50"
                    >
                      <X size={16} /> {actionInProgress === "reject" ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-semibold",
                      selectedTaskOutcome === "approved"
                        ? "border-accent-green/40 bg-accent-green-muted text-accent-green"
                        : selectedTaskOutcome === "rejected"
                          ? "border-accent-red/40 bg-accent-red-muted text-accent-red"
                          : "border-border-subtle bg-bg-primary text-text-secondary"
                    )}
                  >
                    {selectedTaskOutcome === "approved"
                      ? "This item is already approved and moved to Sent."
                      : selectedTaskOutcome === "rejected"
                        ? "This item is already rejected and moved to Closed - Lost."
                        : "This item is not in the active approval queue."}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Eye size={48} className="mb-4 text-text-muted" />
                <p className="text-sm font-medium text-text-secondary">Select an approval item</p>
                <p className="text-xs text-text-muted">Full message and approve/reject actions appear here.</p>
              </div>
            )}
          </Surface>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Surface>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Recently Approved</h2>
              <Badge className="border-accent-green/40 bg-accent-green-muted text-accent-green">{history.totalApproved} Total</Badge>
            </div>

            <div className="space-y-2">
              {history.approved.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border-subtle bg-bg-primary px-3 py-4 text-center text-xs text-text-muted">
                  No approved items yet.
                </div>
              ) : (
                history.approved.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={cn(
                      "w-full rounded-lg border bg-bg-primary px-3 py-2 text-left transition-all",
                      selectedTaskId === task.id ? "border-accent-green/50" : "border-border-subtle hover:border-border-default"
                    )}
                  >
                    <p className="text-sm font-semibold text-text-primary">{task.title}</p>
                    <p className="mt-1 text-xs text-text-secondary">{compact(task.preview || task.description || "", 120)}</p>
                  </button>
                ))
              )}
            </div>
          </Surface>

          <Surface>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Recently Rejected</h2>
              <Badge className="border-accent-red/40 bg-accent-red-muted text-accent-red">{history.totalRejected} Total</Badge>
            </div>

            <div className="space-y-2">
              {history.rejected.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border-subtle bg-bg-primary px-3 py-4 text-center text-xs text-text-muted">
                  No rejected items yet.
                </div>
              ) : (
                history.rejected.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={cn(
                      "w-full rounded-lg border bg-bg-primary px-3 py-2 text-left transition-all",
                      selectedTaskId === task.id ? "border-accent-red/50" : "border-border-subtle hover:border-border-default"
                    )}
                  >
                    <p className="text-sm font-semibold text-text-primary">{task.title}</p>
                    <p className="mt-1 text-xs text-text-secondary">{compact(task.preview || task.description || "", 120)}</p>
                  </button>
                ))
              )}
            </div>
          </Surface>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10">
                <Clock size={20} className="text-accent-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Single Approval Workflow</p>
                <p className="mt-1 text-xs text-text-secondary">Social, DM, and email drafts now flow through one queue and one set of actions.</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hyper-blue/10">
                <Copy size={20} className="text-hyper-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Full Prompt Visibility</p>
                <p className="mt-1 text-xs text-text-secondary">Each task includes full text ready to copy and send, not just a shortened holding preview.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
