import fs from "fs"
import path from "path"

export interface CampaignOutreachItem {
  id: string
  leadName: string
  email: string
  subject: string
  message: string
  status: string
  channel: string
}

export interface CampaignRecord {
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

export interface CampaignsDataResult {
  source: "backend" | "local"
  campaigns: CampaignRecord[]
  connected: boolean
}

const LOCAL_TEMPLATE_PATH = path.join(process.cwd(), "templates", "followup-sequences.json")
const LOCAL_OVERRIDES_PATH = path.join(process.cwd(), ".context", "campaign-overrides.json")

const BACKEND_URL_KEYS = ["CAMPAIGNS_BACKEND_URL", "CAMPAIGNS_API_URL", "BACKEND_API_URL"] as const
const BACKEND_TOKEN_KEYS = ["CAMPAIGNS_BACKEND_TOKEN", "CAMPAIGNS_API_TOKEN", "BACKEND_API_TOKEN"] as const

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value.trim()
  }
  return ""
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function getBackendBaseUrl(): string {
  for (const key of BACKEND_URL_KEYS) {
    const value = process.env[key]
    if (typeof value === "string" && value.trim().length > 0) return value.trim()
  }
  return ""
}

function getBackendToken(): string {
  for (const key of BACKEND_TOKEN_KEYS) {
    const value = process.env[key]
    if (typeof value === "string" && value.trim().length > 0) return value.trim()
  }
  return ""
}

function resolveListUrls(baseUrl: string): string[] {
  const normalized = baseUrl.replace(/\/+$/, "")
  if (!normalized) return []

  if (normalized.includes("{id}")) {
    return uniqueStrings([
      normalized.replace(/\/?\{id\}/, ""),
      normalized.replace("{id}", ""),
    ])
  }

  if (/\/api\/campaigns$/.test(normalized) || /\/campaigns$/.test(normalized)) {
    return [normalized]
  }

  return uniqueStrings([`${normalized}/api/campaigns`, `${normalized}/campaigns`])
}

function resolveDetailUrls(baseUrl: string, id: string): string[] {
  const normalized = baseUrl.replace(/\/+$/, "")
  if (!normalized) return []

  if (normalized.includes("{id}")) {
    return [normalized.replace("{id}", encodeURIComponent(id))]
  }

  if (/\/api\/campaigns$/.test(normalized) || /\/campaigns$/.test(normalized)) {
    return [`${normalized}/${encodeURIComponent(id)}`]
  }

  return uniqueStrings([
    `${normalized}/api/campaigns/${encodeURIComponent(id)}`,
    `${normalized}/campaigns/${encodeURIComponent(id)}`,
  ])
}

function requestHeaders(): HeadersInit {
  const token = getBackendToken()
  if (!token) return { "Content-Type": "application/json" }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

function parseCampaignCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.campaigns)) return record.campaigns
    if (Array.isArray(record.items)) return record.items
    if (record.data && typeof record.data === "object") {
      const data = record.data as Record<string, unknown>
      if (Array.isArray(data.campaigns)) return data.campaigns
      if (Array.isArray(data.items)) return data.items
    }
  }
  return []
}

function normalizeOutreachItem(raw: unknown, index: number): CampaignOutreachItem {
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const id = firstString(record.id, record.messageId, record.draftId, `outreach-${index + 1}`) || `outreach-${index + 1}`

  return {
    id,
    leadName: firstString(record.leadName, record.recipientName, record.name, record.clubName) || "Unknown lead",
    email: firstString(record.email, record.recipientEmail, record.contactEmail),
    subject: firstString(record.subject, record.emailSubject, record.title),
    message: firstString(record.message, record.body, record.template, record.tailoredOutreach),
    status: firstString(record.status, record.stage, "Draft") || "Draft",
    channel: firstString(record.channel, "Email") || "Email",
  }
}

function normalizeCampaign(raw: unknown, index: number): CampaignRecord {
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const name = firstString(record.name, record.title, record.campaignName) || `Campaign ${index + 1}`
  const id = firstString(record.id, record.campaignId, record._id, slugify(name)) || `campaign-${index + 1}`

  const outreachSource =
    (Array.isArray(record.outreachItems) ? record.outreachItems : null) ||
    (Array.isArray(record.outreach) ? record.outreach : null) ||
    (Array.isArray(record.messages) ? record.messages : null) ||
    (Array.isArray(record.drafts) ? record.drafts : null) ||
    (Array.isArray(record.steps) ? record.steps : null) ||
    []

  const outreachItems = outreachSource.map((item, outreachIndex) => normalizeOutreachItem(item, outreachIndex))

  const leadsCountRaw =
    asNumber(record.leadsCount, NaN) ||
    asNumber(record.totalLeads, NaN) ||
    (Array.isArray(record.leads) ? record.leads.length : NaN)

  const sentCount = asNumber(record.sentCount, asNumber(record.totalSent, 0))
  const repliedCount = asNumber(record.repliedCount, asNumber(record.totalReplies, 0))
  const meetingsCount = asNumber(record.meetingsCount, asNumber(record.totalMeetings, 0))
  const leadsCount = Number.isFinite(leadsCountRaw) ? leadsCountRaw : outreachItems.length

  const progressRaw = asNumber(record.progress, NaN)
  const responseRateRaw = asNumber(record.responseRate, NaN)
  const responseRate = Number.isFinite(responseRateRaw)
    ? clampPercent(responseRateRaw)
    : sentCount > 0
      ? clampPercent((repliedCount / sentCount) * 100)
      : 0

  return {
    id,
    name,
    status: firstString(record.status, record.stage, record.state, "Draft") || "Draft",
    subject:
      firstString(record.subject, record.emailSubject, record.outreachSubject, outreachItems[0]?.subject) || "No subject yet",
    tailoredOutreach:
      firstString(
        record.tailoredOutreach,
        record.personalizedOutreach,
        record.outreachBody,
        record.assistantOutreach,
        outreachItems[0]?.message
      ) || "",
    notes: firstString(record.notes, record.internalNotes),
    leadsCount,
    sentCount,
    repliedCount,
    meetingsCount,
    progress: Number.isFinite(progressRaw) ? clampPercent(progressRaw) : leadsCount > 0 ? clampPercent((sentCount / leadsCount) * 100) : 0,
    responseRate,
    updatedAt: firstString(record.updatedAt, record.lastUpdated, record.modifiedAt) || null,
    outreachItems,
  }
}

function readJson(filePath: string): unknown {
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function loadLocalOverrides(): Record<string, Partial<CampaignRecord>> {
  const content = readJson(LOCAL_OVERRIDES_PATH)
  if (!content || typeof content !== "object" || Array.isArray(content)) return {}
  return content as Record<string, Partial<CampaignRecord>>
}

function applyLocalOverrides(campaigns: CampaignRecord[]): CampaignRecord[] {
  const overrides = loadLocalOverrides()
  return campaigns.map((campaign) => {
    const override = overrides[campaign.id]
    if (!override) return campaign
    return {
      ...campaign,
      ...override,
      outreachItems: Array.isArray(override.outreachItems) ? override.outreachItems : campaign.outreachItems,
    }
  })
}

function loadLocalCampaigns(): CampaignRecord[] {
  const local = readJson(LOCAL_TEMPLATE_PATH) as { sequences?: Array<Record<string, unknown>> } | null
  const sequences = Array.isArray(local?.sequences) ? local.sequences : []

  const mapped = sequences.map((sequence, index) => {
    const sequenceName = firstString(sequence.name, sequence.title) || `Campaign ${index + 1}`
    const sequenceId = slugify(sequenceName) || `campaign-${index + 1}`
    const steps = Array.isArray(sequence.steps) ? sequence.steps : []

    const outreachItems = steps.map((step, stepIndex) => {
      const stepRecord = step as Record<string, unknown>
      return {
        id: `${sequenceId}-step-${stepIndex + 1}`,
        leadName: "Pending lead assignment",
        email: "",
        subject: firstString(stepRecord.subject),
        message: firstString(stepRecord.template),
        status: "Draft",
        channel: firstString(stepRecord.channel, "Email") || "Email",
      }
    })

    return normalizeCampaign(
      {
        id: sequenceId,
        name: sequenceName,
        status: "Draft",
        leadsCount: asNumber(sequence.leadsCount, 0),
        sentCount: 0,
        repliedCount: 0,
        meetingsCount: 0,
        subject: outreachItems[0]?.subject ?? "",
        tailoredOutreach: outreachItems[0]?.message ?? "",
        notes: firstString(sequence.description),
        outreachItems,
      },
      index
    )
  })

  return applyLocalOverrides(mapped)
}

async function fetchBackendCampaigns(): Promise<CampaignRecord[] | null> {
  const baseUrl = getBackendBaseUrl()
  if (!baseUrl) return null

  const urls = resolveListUrls(baseUrl)
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: requestHeaders(),
        cache: "no-store",
      })
      if (!res.ok) continue

      const payload = (await res.json()) as unknown
      const collection = parseCampaignCollection(payload)
      const normalized = collection.map((item, index) => normalizeCampaign(item, index))
      return normalized
    } catch {
      continue
    }
  }

  return null
}

export async function getCampaignsData(): Promise<CampaignsDataResult> {
  const backendCampaigns = await fetchBackendCampaigns()
  if (backendCampaigns && backendCampaigns.length > 0) {
    return {
      source: "backend",
      campaigns: backendCampaigns,
      connected: true,
    }
  }

  return {
    source: "local",
    campaigns: loadLocalCampaigns(),
    connected: false,
  }
}

function writeLocalOverride(id: string, patch: Partial<CampaignRecord>): void {
  const current = loadLocalOverrides()
  current[id] = {
    ...(current[id] ?? {}),
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  fs.mkdirSync(path.dirname(LOCAL_OVERRIDES_PATH), { recursive: true })
  fs.writeFileSync(LOCAL_OVERRIDES_PATH, JSON.stringify(current, null, 2))
}

export async function saveCampaignPatch(
  id: string,
  patch: Partial<CampaignRecord>
): Promise<{ source: "backend" | "local"; campaign: CampaignRecord | null; connected: boolean }> {
  const baseUrl = getBackendBaseUrl()
  if (baseUrl) {
    const detailUrls = resolveDetailUrls(baseUrl, id)
    for (const url of detailUrls) {
      try {
        const res = await fetch(url, {
          method: "PATCH",
          headers: requestHeaders(),
          body: JSON.stringify(patch),
          cache: "no-store",
        })
        if (!res.ok) continue

        let campaign: CampaignRecord | null = null
        try {
          const payload = (await res.json()) as unknown
          const collection = parseCampaignCollection(payload)
          if (collection.length > 0) campaign = normalizeCampaign(collection[0], 0)
          if (!campaign && payload && typeof payload === "object") {
            campaign = normalizeCampaign(payload, 0)
          }
        } catch {
          campaign = null
        }

        return {
          source: "backend",
          campaign,
          connected: true,
        }
      } catch {
        continue
      }
    }
  }

  writeLocalOverride(id, patch)
  const localCampaign = loadLocalCampaigns().find((campaign) => campaign.id === id) ?? null
  return {
    source: "local",
    campaign: localCampaign,
    connected: false,
  }
}
