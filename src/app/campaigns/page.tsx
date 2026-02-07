"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Mail, RefreshCcw, Save, Target, TrendingUp } from "lucide-react"

type CampaignOutreachItem = {
  id: string
  leadName: string
  email: string
  subject: string
  message: string
  status: string
  channel: string
}

type CampaignRecord = {
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
  outreachItems: CampaignOutreachItem[]
}

type CampaignApiResponse = {
  source: "backend" | "local"
  connected: boolean
  total: number
  campaigns: CampaignRecord[]
}

type FormState = {
  status: string
  subject: string
  tailoredOutreach: string
  notes: string
}

const STATUS_COLORS: Record<string, string> = {
  Draft: "text-zinc-300 bg-zinc-700/40 border-zinc-600/60",
  Planning: "text-amber-200 bg-amber-500/15 border-amber-500/40",
  Research: "text-blue-300 bg-blue-500/15 border-blue-500/35",
  Active: "text-emerald-300 bg-emerald-500/15 border-emerald-500/35",
  Paused: "text-purple-300 bg-purple-500/15 border-purple-500/35",
  Completed: "text-green-200 bg-green-600/20 border-green-500/40",
}

const STATUS_OPTIONS = ["Draft", "Planning", "Research", "Active", "Paused", "Completed"]

function formatDate(iso: string | null): string {
  if (!iso) return "Unknown"
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return "Unknown"
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copyKey, setCopyKey] = useState<string | null>(null)
  const [source, setSource] = useState<"backend" | "local">("local")
  const [connected, setConnected] = useState(false)
  const [form, setForm] = useState<FormState>({
    status: "Draft",
    subject: "",
    tailoredOutreach: "",
    notes: "",
  })

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId) ?? null,
    [campaigns, selectedId]
  )

  const stats = useMemo(() => {
    const drafted = campaigns.reduce((sum, campaign) => sum + Math.max(campaign.leadsCount, campaign.outreachItems.length), 0)
    const sent = campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0)
    const replied = campaigns.reduce((sum, campaign) => sum + campaign.repliedCount, 0)
    const meetings = campaigns.reduce((sum, campaign) => sum + campaign.meetingsCount, 0)
    const responseRate = sent > 0 ? Math.round((replied / sent) * 100) : 0

    return { drafted, sent, responseRate, meetings }
  }, [campaigns])

  const isDirty = useMemo(() => {
    if (!selectedCampaign) return false
    return (
      form.status !== selectedCampaign.status ||
      form.subject !== selectedCampaign.subject ||
      form.tailoredOutreach !== selectedCampaign.tailoredOutreach ||
      form.notes !== selectedCampaign.notes
    )
  }, [form, selectedCampaign])

  useEffect(() => {
    if (!selectedCampaign) return
    setForm({
      status: selectedCampaign.status,
      subject: selectedCampaign.subject,
      tailoredOutreach: selectedCampaign.tailoredOutreach,
      notes: selectedCampaign.notes,
    })
  }, [selectedCampaign])

  async function loadCampaigns(preferredId?: string) {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/campaigns", { cache: "no-store" })
      const payload = (await response.json()) as CampaignApiResponse | { error?: string }

      if (!response.ok || !("campaigns" in payload)) {
        setError("error" in payload && payload.error ? payload.error : "Failed to load campaigns")
        return
      }

      setCampaigns(payload.campaigns)
      setSource(payload.source)
      setConnected(payload.connected)

      const keepSelected =
        preferredId && payload.campaigns.some((campaign) => campaign.id === preferredId)
          ? preferredId
          : selectedId && payload.campaigns.some((campaign) => campaign.id === selectedId)
            ? selectedId
            : payload.campaigns[0]?.id ?? ""

      setSelectedId(keepSelected)
    } catch {
      setError("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function saveChanges() {
    if (!selectedCampaign) return
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/campaigns/${encodeURIComponent(selectedCampaign.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          subject: form.subject,
          tailoredOutreach: form.tailoredOutreach,
          notes: form.notes,
        }),
      })

      const payload = (await response.json()) as { error?: string }
      if (!response.ok) {
        setError(payload.error ?? "Failed to save campaign")
        return
      }

      await loadCampaigns(selectedCampaign.id)
    } catch {
      setError("Failed to save campaign")
    } finally {
      setSaving(false)
    }
  }

  function statusChip(status: string) {
    return STATUS_COLORS[status] ?? STATUS_COLORS.Draft
  }

  async function copyMessage(key: string, message: string) {
    if (!message) return
    try {
      await navigator.clipboard.writeText(message)
      setCopyKey(key)
      setTimeout(() => setCopyKey(null), 1400)
    } catch {
      setError("Copy failed")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Campaigns</h1>
          <p className="mt-2 text-base text-zinc-400">
            Click any campaign to review subjects and manage tailored outreach from assistant data.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className={`rounded-full border px-3 py-1 ${connected ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-amber-500/40 bg-amber-500/10 text-amber-300"}`}>
            {connected ? "Backend Connected" : "Local Fallback"}
          </span>
          <button
            onClick={() => void loadCampaigns(selectedCampaign?.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200 hover:border-zinc-500"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        <StatCard icon={Mail} value={String(stats.drafted)} label="Emails Drafted" />
        <StatCard icon={Target} value={String(stats.sent)} label="Emails Sent" />
        <StatCard icon={TrendingUp} value={`${stats.responseRate}%`} label="Response Rate" />
        <StatCard icon={Mail} value={String(stats.meetings)} label="Meetings Set" />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            {loading ? "Loading campaigns..." : `${campaigns.length} Campaigns`}
          </h2>

          <div className="max-h-[72vh] space-y-2 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-2">
            {!loading && campaigns.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">No campaigns found.</div>
            ) : null}

            {campaigns.map((campaign) => {
              const selected = campaign.id === selectedId
              return (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedId(campaign.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selected ? "border-orange-500/50 bg-zinc-900" : "border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900/70"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{campaign.name}</p>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusChip(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-zinc-400">{campaign.subject || "No subject"}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                    <span>{campaign.leadsCount} leads</span>
                    <span>{campaign.sentCount} sent</span>
                    <span>{campaign.progress}% progress</span>
                    <span>{formatDate(campaign.updatedAt)}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          {!selectedCampaign ? (
            <div className="py-16 text-center text-sm text-zinc-500">Select a campaign to review and manage.</div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCampaign.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">Last update: {formatDate(selectedCampaign.updatedAt)}</p>
                </div>

                <button
                  onClick={() => void saveChanges()}
                  disabled={!isDirty || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-orange-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Primary Subject</span>
                  <input
                    value={form.subject}
                    onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                    placeholder="Campaign email subject..."
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
                  />
                </label>
              </div>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Tailored Outreach</span>
                <textarea
                  value={form.tailoredOutreach}
                  onChange={(event) => setForm((prev) => ({ ...prev, tailoredOutreach: event.target.value }))}
                  rows={6}
                  placeholder="Assistant-tailored outreach content..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Internal Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={3}
                  placeholder="Operational notes, approvals, blockers..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-500"
                />
              </label>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Outreach Items</h4>

                {selectedCampaign.outreachItems.length === 0 ? (
                  <p className="text-sm text-zinc-500">No outreach records were provided by the backend for this campaign.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCampaign.outreachItems.map((item) => {
                      const key = `${selectedCampaign.id}-${item.id}`
                      return (
                        <details key={key} className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-zinc-100">{item.subject || "No subject"}</p>
                              <p className="truncate text-xs text-zinc-500">
                                {item.leadName}
                                {item.email ? ` • ${item.email}` : ""}
                                {item.channel ? ` • ${item.channel}` : ""}
                              </p>
                            </div>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusChip(item.status)}`}>
                              {item.status}
                            </span>
                          </summary>

                          <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-300">{item.message || "No outreach message"}</pre>
                            <button
                              onClick={() => void copyMessage(key, item.message)}
                              className="mt-3 inline-flex items-center gap-2 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200 hover:border-zinc-500"
                            >
                              {copyKey === key ? <Check size={13} /> : <Copy size={13} />}
                              {copyKey === key ? "Copied" : "Copy Message"}
                            </button>
                          </div>
                        </details>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <p className="text-xs text-zinc-500">
        Data source: {source === "backend" ? "Connected backend campaigns endpoint" : "Local fallback (templates/followup-sequences.json)"}.
      </p>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: typeof Mail; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-zinc-900 p-2.5">
          <Icon size={20} className="text-zinc-400" />
        </div>
      </div>
      <div className="mt-5">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="mt-1 text-sm text-zinc-500">{label}</div>
      </div>
    </div>
  )
}
