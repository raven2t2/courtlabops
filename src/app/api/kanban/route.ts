import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// Load CRM kanban (copied from courtlab-crm/kanban/board.json)
const DATA_FILE = path.join(process.cwd(), "data", "kanban-crm.json")

type CRMTask = {
  title: string
  description?: string
  priority: string
  platform?: string
  account?: string
  type?: string
  lead_id?: string
  links?: {
    internal: Array<{ label: string; url: string }>
    external: Array<{ label: string; url: string }>
  }
}

type CRMColumn = {
  id: string
  name: string
  color: string
  leads: string[]
  tasks: string[]
}

type CRMKanban = {
  version: string
  columns: CRMColumn[]
  tasks: Record<string, CRMTask>
  lastUpdated: string
}

type FrontendCard = {
  id: string
  title: string
  description?: string
  org: string
  owner: string
  due: string
  priority: string
  tags?: string[]
  links?: {
    internal: Array<{ label: string; url: string }>
    external: Array<{ label: string; url: string }>
  }
}

type FrontendColumn = {
  id: string
  title: string
  hint: string
  tone: string
  cards: FrontendCard[]
}

type FrontendKanban = {
  version: string
  lastUpdated: string
  updatedBy: string
  columns: FrontendColumn[]
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
}

const COLUMN_MAPPING: Record<string, { title: string; hint: string; tone: string }> = {
  drafted: { title: "📋 Drafted", hint: "Ready to execute", tone: "blue" },
  sent: { title: "📤 Sent", hint: "Awaiting response", tone: "orange" },
  replied: { title: "💬 Replied", hint: "Engagement active", tone: "violet" },
  meeting: { title: "📅 Meeting Scheduled", hint: "Next step planned", tone: "green" },
  "closed-won": { title: "✅ Closed - Won", hint: "Successful outcome", tone: "green" },
  "closed-lost": { title: "❌ Closed - Lost", hint: "Archived", tone: "neutral" }
}

function transformTask(taskId: string, task: CRMTask): FrontendCard {
  return {
    id: taskId,
    title: task.title,
    description: task.description,
    org: task.platform === "twitter" ? "Social" : task.type === "affiliate_outreach" ? "Outreach" : "General",
    owner: "Michael", // Default for now
    due: "Pending", // No due dates in CRM kanban yet
    priority: task.priority,
    tags: task.account ? [task.account.replace("@", "")] : task.lead_id ? [task.lead_id] : [],
    links: task.links
  }
}

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, "utf-8")
    const crmKanban = JSON.parse(data) as CRMKanban

    const frontendColumns: FrontendColumn[] = crmKanban.columns.map(col => {
      const mapping = COLUMN_MAPPING[col.id] || { title: col.name, hint: "", tone: "blue" }
      const cards: FrontendCard[] = col.tasks.map(taskId => {
        const task = crmKanban.tasks[taskId]
        return task ? transformTask(taskId, task) : null
      }).filter((c): c is FrontendCard => c !== null)

      return {
        id: col.id,
        title: mapping.title,
        hint: mapping.hint,
        tone: mapping.tone,
        cards
      }
    })

    const frontendKanban: FrontendKanban = {
      version: crmKanban.version,
      lastUpdated: crmKanban.lastUpdated || new Date().toISOString(),
      updatedBy: "CourtLab CRM",
      columns: frontendColumns,
      owners: {
        Michael: {
          role: "Founder",
          tasks: { total: 0, backlog: 0, inProgress: 0, waiting: 0, done: 0 }
        },
        Esther: {
          role: "CMO / PM",
          tasks: { total: 0, backlog: 0, inProgress: 0, waiting: 0, done: 0 }
        }
      }
    }

    return NextResponse.json(frontendKanban)
  } catch (error) {
    console.error("Kanban load error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to load kanban",
      path: DATA_FILE 
    }, { status: 500 })
  }
}
