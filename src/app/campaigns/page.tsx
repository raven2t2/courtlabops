"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  RefreshCcw,
  Save,
  Search,
  Send,
  Target,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OutreachItem {
  id: string
  leadName: string
  email: string
  subject: string
  message: string
  status: string
  channel: string
}

interface Campaign {
  id: string
  name: string
  status: string
  subject: string
  tailoredOutreach: string
  notes: string
  leadsCount: number
  sentCount: number
  repliedCount: number
  meetingsCount: number
  progress: number
  responseRate: number
  updatedAt: string | null
  outreachItems: OutreachItem[]
}

interface CampaignsApiResponse {
  source?: "backend" | "local"
  connected?: boolean
  campaigns?: Campaign[]
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>{children}</span>
}

function compact(text: string, max = 100): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3)}...`
}

function normalizeStatus(status: string): string {
  const normalized = status.trim().toLowerCase()
  if (!normalized) return "draft"
  return normalized
}

function statusTone(status: string): string {
  const normalized = normalizeStatus(status)
  if (normalized.includes("ready") || normalized.includes("approved")) {
    return "border-accent-green/40 bg-accent-green-muted text-accent-green"
  }
  if (normalized.includes("send") || normalized.includes("live")) {
    return "border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue"
  }
  if (normalized.includes("draft") || normalized.includes("review")) {
    return "border-accent-amber/40 bg-accent-amber-muted text-accent-amber"
  }
  return "border-border-default bg-bg-tertiary text-text-secondary"
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [source, setSource] = useState<"backend" | "local" | "unknown">("unknown")
  const [connected, setConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "ready" | "sent">("all")
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [editedStatus, setEditedStatus] = useState("")
  const [editedSubject, setEditedSubject] = useState("")
  const [editedOutreach, setEditedOutreach] = useState("")
  const [editedNotes, setEditedNotes] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedCampaignId) || null,
    [campaigns, selectedCampaignId]
  )

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const haystack = `${campaign.name} ${campaign.subject} ${campaign.tailoredOutreach}`.toLowerCase()
      const matchesSearch = haystack.includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false
      if (statusFilter === "all") return true

      const status = normalizeStatus(campaign.status)
      if (statusFilter === "sent") return status.includes("send") || status.includes("live")
      return status.includes(statusFilter)
    })
  }, [campaigns, searchQuery, statusFilter])

  const summary = useMemo(() => {
    return campaigns.reduce(
      (acc, campaign) => {
        acc.totalCampaigns += 1
        acc.totalLeads += campaign.leadsCount
        acc.totalSent += campaign.sentCount
        acc.totalReplies += campaign.repliedCount
        acc.totalMeetings += campaign.meetingsCount
        return acc
      },
      { totalCampaigns: 0, totalLeads: 0, totalSent: 0, totalReplies: 0, totalMeetings: 0 }
    )
  }, [campaigns])

  useEffect(() => {
    void loadCampaigns()
  }, [])

  useEffect(() => {
    if (!selectedCampaign) {
      setEditedStatus("")
      setEditedSubject("")
      setEditedOutreach("")
      setEditedNotes("")
      return
    }

    setEditedStatus(selectedCampaign.status)
    setEditedSubject(selectedCampaign.subject)
    setEditedOutreach(selectedCampaign.tailoredOutreach)
    setEditedNotes(selectedCampaign.notes)
  }, [selectedCampaign])

  async function loadCampaigns(): Promise<void> {
    setIsLoading(true)

    try {
      const res = await fetch("/api/campaigns", { cache: "no-store" })
      const data = (await res.json()) as CampaignsApiResponse
      const nextCampaigns = Array.isArray(data.campaigns) ? data.campaigns : []

      setCampaigns(nextCampaigns)
      setSource(data.source || "unknown")
      setConnected(Boolean(data.connected))

      if (nextCampaigns.length > 0 && (!selectedCampaignId || !nextCampaigns.some((campaign) => campaign.id === selectedCampaignId))) {
        setSelectedCampaignId(nextCampaigns[0].id)
      }

      if (nextCampaigns.length === 0) {
        setSelectedCampaignId(null)
      }
    } catch (error) {
      console.error("Failed to load campaigns", error)
      setStatusMessage("Failed to load campaigns.")
    } finally {
      setIsLoading(false)
    }
  }

  async function saveCampaign(): Promise<void> {
    if (!selectedCampaign) return

    setIsSaving(true)
    setStatusMessage(null)

    try {
      const payload = {
        status: editedStatus,
        subject: editedSubject,
        tailoredOutreach: editedOutreach,
        notes: editedNotes,
        updatedAt: new Date().toISOString(),
      }

      const res = await fetch(`/api/campaigns/${selectedCampaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error || "Failed to save campaign")
      }

      const data = (await res.json()) as { campaign?: Campaign; source?: "backend" | "local"; connected?: boolean }
      if (data.campaign) {
        setCampaigns((current) => current.map((campaign) => (campaign.id === data.campaign?.id ? data.campaign : campaign)))
      }
      if (data.source) setSource(data.source)
      if (typeof data.connected === "boolean") setConnected(data.connected)

      setStatusMessage("Campaign changes saved.")
    } catch (error) {
      console.error("Failed to save campaign", error)
      setStatusMessage(error instanceof Error ? error.message : "Failed to save campaign")
    } finally {
      setIsSaving(false)
    }
  }

  function loadOutreachDraft(item: OutreachItem): void {
    setEditedSubject(item.subject || editedSubject)
    setEditedOutreach(item.message || editedOutreach)
    setStatusMessage(`Loaded outreach draft for ${item.leadName}.`)
  }

  const hasEdits = selectedCampaign
    ? editedStatus !== selectedCampaign.status ||
      editedSubject !== selectedCampaign.subject ||
      editedOutreach !== selectedCampaign.tailoredOutreach ||
      editedNotes !== selectedCampaign.notes
    : false

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-[1700px] p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Campaign Manager</p>
                <Badge className={connected ? "border-accent-green/40 bg-accent-green-muted text-accent-green" : "border-accent-amber/40 bg-accent-amber-muted text-accent-amber"}>
                  {connected ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {connected ? "Backend Connected" : "Local Fallback"}
                </Badge>
                <Badge className="border-border-default bg-bg-tertiary text-text-secondary">{source}</Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Review and Manage Campaigns</h1>
              <p className="mt-1 text-sm text-text-secondary">Edit subject lines and tailored outreach before approving campaign execution.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search campaigns"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </label>
              <button
                onClick={() => void loadCampaigns()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary"
              >
                <RefreshCcw size={14} /> Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Campaigns", value: summary.totalCampaigns, icon: Target, tone: "text-text-primary" },
              { label: "Leads", value: summary.totalLeads, icon: Users, tone: "text-hyper-blue" },
              { label: "Sent", value: summary.totalSent, icon: Send, tone: "text-accent-green" },
              { label: "Replies", value: summary.totalReplies, icon: MessageSquare, tone: "text-velocity-orange" },
              { label: "Meetings", value: summary.totalMeetings, icon: CheckCircle2, tone: "text-accent-violet" },
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
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-text-muted" />
              <span className="text-xs font-semibold text-text-muted">Status</span>
            </div>
            {(["all", "draft", "ready", "sent"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  statusFilter === status ? "bg-hyper-blue text-white" : "bg-bg-tertiary text-text-secondary"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </Surface>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Surface className="max-h-[760px] overflow-auto">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Campaigns</h2>
              <span className="text-xs text-text-muted">{filteredCampaigns.length} items</span>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-sm text-text-muted">Loading campaigns...</div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary py-12 text-center text-sm text-text-muted">
                No campaigns found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCampaigns.map((campaign) => {
                  const active = campaign.id === selectedCampaignId
                  return (
                    <button
                      key={campaign.id}
                      onClick={() => setSelectedCampaignId(campaign.id)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition-all",
                        active ? "border-hyper-blue bg-hyper-blue/5" : "border-border-subtle bg-bg-primary"
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <Badge className={statusTone(campaign.status)}>{campaign.status || "Draft"}</Badge>
                        <span className="text-[11px] text-text-muted">{campaign.leadsCount} leads</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary">{campaign.name}</p>
                      <p className="mt-1 text-xs text-text-secondary">{compact(campaign.subject || "No subject")}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-text-muted">
                        <span>Sent: {campaign.sentCount}</span>
                        <span>Replies: {campaign.repliedCount}</span>
                        <span>Progress: {campaign.progress}%</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Surface>

          <Surface className="max-h-[760px] overflow-auto">
            {!selectedCampaign ? (
              <div className="flex h-full items-center justify-center py-12 text-sm text-text-muted">Select a campaign to review.</div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Campaign Detail</p>
                    <h2 className="text-xl font-bold text-text-primary">{selectedCampaign.name}</h2>
                    <p className="text-xs text-text-muted">Updated {selectedCampaign.updatedAt ? new Date(selectedCampaign.updatedAt).toLocaleString() : "-"}</p>
                  </div>
                  <Badge className={statusTone(editedStatus || selectedCampaign.status)}>{editedStatus || selectedCampaign.status}</Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs text-text-muted">
                    Status
                    <input
                      value={editedStatus}
                      onChange={(event) => setEditedStatus(event.target.value)}
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                    />
                  </label>
                  <label className="space-y-1 text-xs text-text-muted">
                    Response Rate
                    <input
                      value={`${selectedCampaign.responseRate}%`}
                      readOnly
                      className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-2.5 py-2 text-sm text-text-secondary"
                    />
                  </label>
                </div>

                <label className="space-y-1 text-xs text-text-muted">
                  Subject
                  <input
                    value={editedSubject}
                    onChange={(event) => setEditedSubject(event.target.value)}
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                  />
                </label>

                <label className="space-y-1 text-xs text-text-muted">
                  Tailored Outreach
                  <textarea
                    value={editedOutreach}
                    onChange={(event) => setEditedOutreach(event.target.value)}
                    className="min-h-36 w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                  />
                </label>

                <label className="space-y-1 text-xs text-text-muted">
                  Notes
                  <textarea
                    value={editedNotes}
                    onChange={(event) => setEditedNotes(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => void saveCampaign()}
                    disabled={isSaving || !hasEdits}
                    className="inline-flex items-center gap-2 rounded-lg bg-hyper-blue px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    <Save size={13} /> {isSaving ? "Saving..." : "Save Campaign"}
                  </button>
                  <button
                    onClick={() => {
                      setEditedStatus(selectedCampaign.status)
                      setEditedSubject(selectedCampaign.subject)
                      setEditedOutreach(selectedCampaign.tailoredOutreach)
                      setEditedNotes(selectedCampaign.notes)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-semibold text-text-secondary"
                  >
                    <RefreshCcw size={13} /> Reset
                  </button>
                </div>

                <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">Outreach Drafts</h3>
                    <span className="text-xs text-text-muted">{selectedCampaign.outreachItems.length} items</span>
                  </div>

                  {selectedCampaign.outreachItems.length === 0 ? (
                    <p className="text-xs text-text-muted">No outreach items found for this campaign.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedCampaign.outreachItems.slice(0, 12).map((item) => (
                        <div key={item.id} className="rounded-lg border border-border-subtle bg-bg-secondary p-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-text-primary">{item.leadName || "Unnamed Lead"}</p>
                              <p className="text-[11px] text-text-muted">{item.email || "No email"} · {item.channel || "Email"}</p>
                            </div>
                            <Badge className={statusTone(item.status || "draft")}>{item.status || "Draft"}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-text-secondary">{compact(item.subject || "No subject")}</p>
                          <p className="mt-1 text-[11px] text-text-muted">{compact(item.message || "", 180)}</p>
                          <button
                            onClick={() => loadOutreachDraft(item)}
                            className="mt-2 inline-flex items-center gap-1 rounded-md border border-border-default bg-bg-primary px-2 py-1 text-[11px] font-semibold text-text-secondary"
                          >
                            <Mail size={11} /> Load into editor
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Surface>
        </div>
      </div>
    </div>
  )
}
