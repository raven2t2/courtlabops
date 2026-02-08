import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"

const KANBAN_FILE = path.join(process.cwd(), "data", "crm", "kanban", "board.json")
const TWITTER_DRAFTS_FILE = path.join(process.cwd(), "twitter-drafts.json")
const AFFILIATE_LEADS_FILE = path.join(process.cwd(), "data", "crm", "affiliate-leads-v1.json")
const SA_CLUB_LEADS_FILE = path.join(process.cwd(), "data", "crm", "leads", "sa-basketball-clubs.json")

interface ApprovalTask {
  id: string
  title: string
  description?: string
  priority: string
  platform?: string
  account?: string
  contact?: string
  owner: string
  type: string
  category: string
  preview: string
  fullText: string
  action: string
  links?: {
    internal: Array<{ label: string; url: string }>
    external: Array<{ label: string; url: string }>
  }
}

interface ApprovalHistory {
  approved: ApprovalTask[]
  rejected: ApprovalTask[]
  totalApproved: number
  totalRejected: number
}

interface KanbanTask {
  title?: string
  description?: string
  priority?: string
  platform?: string
  account?: string
  contact?: string
  owner?: string
  type?: string
  category?: string
  preview?: string
  action?: string
  status?: string
  links?: {
    internal?: Array<{ label: string; url: string }>
    external?: Array<{ label: string; url: string }>
  }
}

interface KanbanData {
  version: string
  columns: Array<{
    id: string
    name: string
    color: string
    leads: string[]
    tasks: string[]
  }>
  tasks: Record<string, KanbanTask>
  lastUpdated: string
}

interface TwitterDraft {
  text?: string
}

interface TwitterDraftFile {
  courtlabapp_tweets?: TwitterDraft[]
  esthercourtlab_tweets?: TwitterDraft[]
}

interface AffiliateLead {
  handle?: string
  outreach_draft?: string
}

interface AffiliateLeadsFile {
  leads?: AffiliateLead[]
}

interface ClubLead {
  clubName?: string
  contactEmail?: string
  draftedIntro?: string
}

interface ClubLeadsFile {
  leads?: ClubLead[]
}

async function loadJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await readFile(filePath, "utf-8")
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function parseTaskNumber(taskId: string, prefix: string): number | null {
  const match = taskId.match(new RegExp(`^${prefix}-(\\d{3})$`))
  if (!match) return null
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

function resolveTwitterMessage(taskId: string, drafts: TwitterDraftFile | null): string | null {
  if (!drafts) return null

  const taskNumber = parseTaskNumber(taskId, "APPROVAL-TW")
  if (!taskNumber) return null

  if (taskNumber >= 1 && taskNumber <= 3) {
    return drafts.courtlabapp_tweets?.[taskNumber - 1]?.text?.trim() || null
  }

  if (taskNumber >= 4 && taskNumber <= 6) {
    return drafts.esthercourtlab_tweets?.[taskNumber - 4]?.text?.trim() || null
  }

  return null
}

function extractHandle(task: KanbanTask): string | null {
  const fromLink = task.links?.external?.[0]?.label
  if (fromLink && fromLink.startsWith("@")) {
    return normalize(fromLink)
  }

  if (task.account && task.account.startsWith("@")) {
    return normalize(task.account)
  }

  const titleMatch = task.title?.match(/@[A-Za-z0-9_]+/)
  if (!titleMatch) return null
  return normalize(titleMatch[0])
}

function extractClubName(task: KanbanTask): string | null {
  if (!task.title) return null

  const beforeDivider = task.title.split("—")[0] || task.title
  const cleaned = beforeDivider.replace(/^[^A-Za-z0-9]+/, "").trim()
  if (!cleaned) return null

  return normalize(cleaned)
}

function computeFullText(
  taskId: string,
  task: KanbanTask,
  twitterDrafts: TwitterDraftFile | null,
  affiliateDraftByHandle: Map<string, string>,
  clubDraftByEmail: Map<string, string>,
  clubDraftByName: Map<string, string>
): string {
  if (taskId.startsWith("APPROVAL-TW-")) {
    const twitterText = resolveTwitterMessage(taskId, twitterDrafts)
    if (twitterText) return twitterText
  }

  if (taskId.startsWith("APPROVAL-AFF-")) {
    const handle = extractHandle(task)
    if (handle && affiliateDraftByHandle.has(handle)) {
      return affiliateDraftByHandle.get(handle) || ""
    }
  }

  if (taskId.startsWith("APPROVAL-EMAIL-")) {
    const contact = task.contact ? normalize(task.contact) : null
    if (contact && clubDraftByEmail.has(contact)) {
      return clubDraftByEmail.get(contact) || ""
    }

    const clubName = extractClubName(task)
    if (clubName && clubDraftByName.has(clubName)) {
      return clubDraftByName.get(clubName) || ""
    }
  }

  return task.preview?.trim() || task.description?.trim() || ""
}

function moveTask(kanban: KanbanData, taskId: string, sourceColumnId: string, destinationColumnId: string): boolean {
  const sourceColumn = kanban.columns.find((column) => column.id === sourceColumnId)
  const destinationColumn = kanban.columns.find((column) => column.id === destinationColumnId)

  if (!sourceColumn || !destinationColumn || !sourceColumn.tasks.includes(taskId)) {
    return false
  }

  sourceColumn.tasks = sourceColumn.tasks.filter((existingTaskId) => existingTaskId !== taskId)
  if (!destinationColumn.tasks.includes(taskId)) {
    destinationColumn.tasks.push(taskId)
  }

  return true
}

function buildApprovalTask(
  kanban: KanbanData,
  taskId: string,
  twitterDrafts: TwitterDraftFile | null,
  affiliateDraftByHandle: Map<string, string>,
  clubDraftByEmail: Map<string, string>,
  clubDraftByName: Map<string, string>
): ApprovalTask | null {
  const task = kanban.tasks[taskId]
  if (!task) return null

  const fullText = computeFullText(taskId, task, twitterDrafts, affiliateDraftByHandle, clubDraftByEmail, clubDraftByName)

  return {
    id: taskId,
    title: task.title || taskId,
    description: task.description,
    priority: task.priority || "low",
    platform: task.platform,
    account: task.account,
    contact: task.contact,
    owner: task.owner || "Michael",
    type: task.type || "approval",
    category: task.category || "outreach",
    preview: task.preview || task.description?.slice(0, 140) || fullText.slice(0, 140),
    fullText,
    action: task.action || "Review and approve",
    links: {
      internal: task.links?.internal || [],
      external: task.links?.external || [],
    },
  }
}

function buildTasksFromIds(
  kanban: KanbanData,
  taskIds: string[],
  twitterDrafts: TwitterDraftFile | null,
  affiliateDraftByHandle: Map<string, string>,
  clubDraftByEmail: Map<string, string>,
  clubDraftByName: Map<string, string>
): ApprovalTask[] {
  return taskIds.flatMap((taskId) => {
    const mapped = buildApprovalTask(kanban, taskId, twitterDrafts, affiliateDraftByHandle, clubDraftByEmail, clubDraftByName)
    return mapped ? [mapped] : []
  })
}

export async function GET() {
  try {
    const [kanbanRaw, twitterDrafts, affiliateLeads, clubLeads] = await Promise.all([
      readFile(KANBAN_FILE, "utf-8"),
      loadJsonFile<TwitterDraftFile>(TWITTER_DRAFTS_FILE),
      loadJsonFile<AffiliateLeadsFile>(AFFILIATE_LEADS_FILE),
      loadJsonFile<ClubLeadsFile>(SA_CLUB_LEADS_FILE),
    ])

    const kanban = JSON.parse(kanbanRaw) as KanbanData
    const awaitingApprovalColumn = kanban.columns.find((column) => column.id === "awaiting-approval")

    if (!awaitingApprovalColumn) {
      return NextResponse.json({
        approvals: [],
        totalCount: 0,
        message: "No awaiting-approval column found",
      })
    }

    const affiliateDraftByHandle = new Map<string, string>()
    for (const lead of affiliateLeads?.leads ?? []) {
      if (!lead.handle || !lead.outreach_draft) continue
      affiliateDraftByHandle.set(normalize(lead.handle), lead.outreach_draft)
    }

    const clubDraftByEmail = new Map<string, string>()
    const clubDraftByName = new Map<string, string>()
    for (const lead of clubLeads?.leads ?? []) {
      if (lead.contactEmail && lead.draftedIntro) {
        clubDraftByEmail.set(normalize(lead.contactEmail), lead.draftedIntro)
      }

      if (lead.clubName && lead.draftedIntro) {
        clubDraftByName.set(normalize(lead.clubName), lead.draftedIntro)
      }
    }

    const approvalTasks = buildTasksFromIds(
      kanban,
      awaitingApprovalColumn.tasks,
      twitterDrafts,
      affiliateDraftByHandle,
      clubDraftByEmail,
      clubDraftByName
    )

    const priorityOrder: Record<string, number> = { highest: 0, high: 1, medium: 2, low: 3 }
    const sorted = approvalTasks.sort((a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4))

    const sentColumn = kanban.columns.find((column) => column.id === "sent")
    const rejectedColumn = kanban.columns.find((column) => column.id === "closed-lost")

    const history: ApprovalHistory = {
      approved: buildTasksFromIds(
        kanban,
        [...(sentColumn?.tasks || [])].reverse().slice(0, 8),
        twitterDrafts,
        affiliateDraftByHandle,
        clubDraftByEmail,
        clubDraftByName
      ),
      rejected: buildTasksFromIds(
        kanban,
        [...(rejectedColumn?.tasks || [])].reverse().slice(0, 8),
        twitterDrafts,
        affiliateDraftByHandle,
        clubDraftByEmail,
        clubDraftByName
      ),
      totalApproved: sentColumn?.tasks.length || 0,
      totalRejected: rejectedColumn?.tasks.length || 0,
    }

    return NextResponse.json({
      approvals: sorted,
      history,
      totalCount: sorted.length,
      lastUpdated: kanban.lastUpdated,
      stats: {
        social: sorted.filter((task) => task.category === "social").length,
        outreach: sorted.filter((task) => task.category === "outreach").length,
        highest: sorted.filter((task) => task.priority === "highest").length,
        high: sorted.filter((task) => task.priority === "high").length,
        medium: sorted.filter((task) => task.priority === "medium").length,
        low: sorted.filter((task) => task.priority === "low").length,
      },
    })
  } catch (error) {
    console.error("Approvals load error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load approvals",
        approvals: [],
        totalCount: 0,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { taskId, action } = (await request.json()) as {
      taskId?: string
      action?: "approve" | "reject" | "revise"
    }

    if (!taskId || !action) {
      return NextResponse.json({ error: "taskId and action are required" }, { status: 400 })
    }

    const kanbanRaw = await readFile(KANBAN_FILE, "utf-8")
    const kanban = JSON.parse(kanbanRaw) as KanbanData

    let changed = false

    if (action === "approve") {
      changed = moveTask(kanban, taskId, "awaiting-approval", "sent")
    }

    if (action === "reject") {
      changed = moveTask(kanban, taskId, "awaiting-approval", "closed-lost")
    }

    if (action === "revise") {
      const task = kanban.tasks[taskId]
      if (task) {
        task.status = "revision-requested"
        changed = true
      }
    }

    if (!changed) {
      return NextResponse.json({ error: `Unable to ${action} task ${taskId}` }, { status: 400 })
    }

    kanban.lastUpdated = new Date().toISOString()
    await writeFile(KANBAN_FILE, JSON.stringify(kanban, null, 2))

    const actionMessage =
      action === "approve"
        ? "Task approved and moved to Sent"
        : action === "reject"
          ? "Task rejected and moved to Closed - Lost"
          : "Task marked for revision"

    return NextResponse.json({
      success: true,
      message: actionMessage,
      taskId,
      action,
    })
  } catch (error) {
    console.error("Approval action error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process approval",
      },
      { status: 500 }
    )
  }
}
