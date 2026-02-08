"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Eye, Filter, Search, X, AlertCircle, ArrowRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApprovalTask {
  id: string
  title: string
  description?: string
  priority: string
  platform?: string
  account?: string
  owner: string
  type: string
  category: string
  preview: string
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
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>
      {children}
    </section>
  )
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>
      {children}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { bg: string; text: string; icon: string }> = {
    highest: { bg: "bg-accent-red-muted", text: "text-accent-red border-accent-red/40", icon: "🔴" },
    high: { bg: "bg-accent-orange-muted", text: "text-accent-orange border-accent-orange/40", icon: "🟠" },
    medium: { bg: "bg-accent-amber-muted", text: "text-accent-amber border-accent-amber/40", icon: "🟡" },
    low: { bg: "bg-accent-green-muted", text: "text-accent-green border-accent-green/40", icon: "🟢" },
  }

  const c = config[priority] || config.low

  return (
    <Badge className={`border ${c.text}`}>
      {c.icon} {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

export default function ApprovalsQueuePage() {
  const [approvals, setApprovals] = useState<ApprovalTask[]>([])
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<"all" | "social" | "outreach">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "highest" | "high" | "medium">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [actionInProgress, setActionInProgress] = useState(false)

  useEffect(() => {
    void loadApprovals()
  }, [])

  async function loadApprovals() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/approvals", { cache: "no-store" })
      const data = (await res.json()) as { approvals?: ApprovalTask[]; stats?: ApprovalStats }
      const approvalList = data.approvals ?? []
      setApprovals(approvalList)
      setStats(data.stats || null)
      if (approvalList.length > 0) {
        setSelectedTaskId(approvalList[0].id)
      }
    } catch (error) {
      console.error("Failed to load approvals", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredApprovals = useMemo(() => {
    return approvals.filter((task) => {
      const matchesCategory = filterCategory === "all" || task.category === filterCategory
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      const searchable = `${task.title} ${task.description} ${task.preview}`.toLowerCase()
      const matchesSearch = searchable.includes(searchQuery.toLowerCase())
      return matchesCategory && matchesPriority && matchesSearch
    })
  }, [approvals, filterCategory, filterPriority, searchQuery])

  const selectedTask = useMemo(() => approvals.find((t) => t.id === selectedTaskId) || null, [approvals, selectedTaskId])

  async function handleApprove() {
    if (!selectedTaskId) return
    setActionInProgress(true)
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selectedTaskId, action: "approve" }),
      })
      if (res.ok) {
        await loadApprovals()
        setSelectedTaskId(null)
      }
    } catch (error) {
      console.error("Approval failed", error)
    } finally {
      setActionInProgress(false)
    }
  }

  async function handleReject() {
    if (!selectedTaskId) return
    setActionInProgress(true)
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selectedTaskId, action: "reject" }),
      })
      if (res.ok) {
        await loadApprovals()
        setSelectedTaskId(null)
      }
    } catch (error) {
      console.error("Rejection failed", error)
    } finally {
      setActionInProgress(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-[1700px] p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">⏳ Your Approval Queue</p>
                <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                  <Clock size={10} /> {approvals.length} Pending
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Social + Outreach Approvals</h1>
              <p className="mt-1 text-sm text-text-secondary">Review and approve Twitter posts, affiliate DMs, and email outreach before execution.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => void loadApprovals()}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary disabled:opacity-50"
              >
                🔄 {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {stats && (
            <div className="grid gap-3 sm:grid-cols-5">
              <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Total</p>
                <p className="mt-1 text-3xl font-extrabold text-text-primary">{approvals.length}</p>
                <p className="text-xs text-text-secondary">Awaiting approval</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">🔴 Highest</p>
                <p className="mt-1 text-3xl font-extrabold text-accent-red">{stats.highest}</p>
                <p className="text-xs text-text-secondary">Critical priority</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">🟠 High</p>
                <p className="mt-1 text-3xl font-extrabold text-accent-orange">{stats.high}</p>
                <p className="text-xs text-text-secondary">Important items</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">📱 Social</p>
                <p className="mt-1 text-3xl font-extrabold text-hyper-blue">{stats.social}</p>
                <p className="text-xs text-text-secondary">Twitter posts</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">💌 Outreach</p>
                <p className="mt-1 text-3xl font-extrabold text-accent-violet">{stats.outreach}</p>
                <p className="text-xs text-text-secondary">DMs + Emails</p>
              </div>
            </div>
          )}
        </Surface>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <Surface>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <label className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                  <Search size={14} className="text-text-muted" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search approvals..."
                    className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                  />
                </label>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="social">📱 Social</option>
                  <option value="outreach">💌 Outreach</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-medium text-text-primary"
                >
                  <option value="all">All Priorities</option>
                  <option value="highest">🔴 Highest</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                </select>
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary p-6 text-center text-sm text-text-muted">
                    Loading approvals...
                  </div>
                ) : filteredApprovals.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary p-6 text-center text-sm text-text-muted">
                    {approvals.length === 0 ? "All caught up! No pending approvals." : "No approvals match your filters."}
                  </div>
                ) : (
                  filteredApprovals.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition-all",
                        selectedTaskId === task.id
                          ? "border-hyper-blue bg-hyper-blue/5"
                          : "border-border-subtle bg-bg-primary hover:border-border-hover"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-text-primary">{task.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{task.preview}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <PriorityBadge priority={task.priority} />
                            {task.platform && (
                              <Badge className="border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue">{task.platform}</Badge>
                            )}
                            {task.category && (
                              <Badge className="border-border-default bg-bg-tertiary text-text-secondary text-capitalize">
                                {task.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-text-muted" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Surface>
          </div>

          <div className="space-y-4">
            {selectedTask ? (
              <>
                <Surface className="border-hyper-blue">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-text-primary">{selectedTask.title}</h2>
                      <p className="mt-1 text-xs text-text-muted">{selectedTask.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedTaskId(null)}
                      className="rounded-lg p-1 text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">📌 Content to Send</p>
                      <div className="mt-2 rounded-lg border border-border-subtle bg-bg-primary p-3">
                        <p className="whitespace-pre-wrap text-sm text-text-primary">{selectedTask.preview || selectedTask.description || "No content available"}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedTask.preview || selectedTask.description || "")
                          alert("Copied to clipboard!")
                        }}
                        className="mt-2 rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-bg-tertiary"
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>

                    {selectedTask.description && selectedTask.description !== selectedTask.preview && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">ℹ️ Context</p>
                        <p className="mt-1 text-sm text-text-secondary">{selectedTask.description}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">🎯 How to Send</p>
                      <div className="mt-2 rounded-lg border border-border-subtle bg-bg-primary p-3 text-xs text-text-secondary space-y-2">
                        {selectedTask.platform === "twitter" ? (
                          <div>
                            <p className="font-semibold text-text-primary">Twitter/X ({selectedTask.account})</p>
                            <ol className="mt-1 space-y-1 ml-4 list-decimal">
                              <li>Go to <strong>{selectedTask.account}</strong> profile</li>
                              <li>Copy the content above</li>
                              <li>Post manually via Twitter web interface</li>
                              <li>Reply here when done: "Sent ✅"</li>
                            </ol>
                          </div>
                        ) : selectedTask.category === "outreach" ? (
                          <div>
                            <p className="font-semibold text-text-primary">Direct Message / Email</p>
                            <ol className="mt-1 space-y-1 ml-4 list-decimal">
                              <li>Open Twitter DM or Gmail</li>
                              <li>Copy content above</li>
                              <li>Paste into DM/email and customize if needed</li>
                              <li>Send manually</li>
                              <li>Reply here when done: "Sent ✅"</li>
                            </ol>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-text-primary">Manual Send Required</p>
                            <p className="mt-1">Copy the content above and send via your preferred channel. No API automation available yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedTask.links?.external && selectedTask.links.external.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">🔗 Resources</p>
                        <div className="mt-2 space-y-1">
                          {selectedTask.links.external.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-hyper-blue hover:underline"
                            >
                              {link.label} <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => void handleApprove()}
                        disabled={actionInProgress}
                        className="flex-1 rounded-lg bg-accent-green px-3 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} className="inline mr-1" /> {actionInProgress ? "..." : "✅ Ready to Send"}
                      </button>
                      <button
                        onClick={() => void handleReject()}
                        disabled={actionInProgress}
                        className="flex-1 rounded-lg border border-accent-red/40 bg-accent-red-muted px-3 py-2 text-sm font-semibold text-accent-red transition-opacity disabled:opacity-50"
                      >
                        <X size={14} className="inline mr-1" /> Reject
                      </button>
                    </div>
                  </div>
                </Surface>
              </>
            ) : (
              <Surface className="border-dashed border-border-subtle text-center">
                <Eye size={24} className="mx-auto text-text-muted" />
                <p className="mt-2 text-sm text-text-secondary">Click an item to view full message, copy to clipboard, and mark as ready to send.</p>
              </Surface>
            )}

            <Surface>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Quick Help</p>
              <ul className="mt-2 space-y-1 text-xs text-text-secondary">
                <li>✅ <strong>Approve</strong> → Post goes to "Sent" column</li>
                <li>❌ <strong>Reject</strong> → Task moved to "Closed - Lost"</li>
                <li>📱 All social posts require your approval before posting</li>
                <li>💌 All emails + DMs require your approval before sending</li>
              </ul>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  )
}
