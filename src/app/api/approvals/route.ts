import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// Load kanban board and extract "awaiting-approval" column tasks
const KANBAN_FILE = path.join(process.cwd(), "data", "crm", "kanban", "board.json")

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

interface KanbanData {
  version: string
  columns: Array<{
    id: string
    name: string
    color: string
    leads: string[]
    tasks: string[]
  }>
  tasks: Record<string, any>
  lastUpdated: string
}

export async function GET(request: NextRequest) {
  try {
    const data = await readFile(KANBAN_FILE, "utf-8")
    const kanban = JSON.parse(data) as KanbanData

    // Find the "awaiting-approval" column
    const awaitingApprovalColumn = kanban.columns.find((col) => col.id === "awaiting-approval")

    if (!awaitingApprovalColumn) {
      return NextResponse.json({
        approvals: [],
        totalCount: 0,
        message: "No awaiting-approval column found",
      })
    }

    // Extract all tasks in the awaiting-approval column
    const approvalTasks: ApprovalTask[] = awaitingApprovalColumn.tasks
      .map((taskId) => {
        const task = kanban.tasks[taskId]
        if (!task) return null

        return {
          id: taskId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          platform: task.platform,
          account: task.account,
          owner: task.owner || "Michael",
          type: task.type,
          category: task.category,
          preview: task.preview || task.description?.slice(0, 100) || "",
          action: task.action || "Review and approve",
          links: task.links,
        }
      })
      .filter((task): task is ApprovalTask => task !== null)

    // Sort by priority (highest first)
    const priorityOrder = { highest: 0, high: 1, medium: 2, low: 3 }
    const sorted = approvalTasks.sort(
      (a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4)
    )

    return NextResponse.json({
      approvals: sorted,
      totalCount: sorted.length,
      lastUpdated: kanban.lastUpdated,
      stats: {
        social: sorted.filter((t) => t.type === "approval" && t.category === "social").length,
        outreach: sorted.filter((t) => t.type === "approval" && t.category === "outreach").length,
        highest: sorted.filter((t) => t.priority === "highest").length,
        high: sorted.filter((t) => t.priority === "high").length,
        medium: sorted.filter((t) => t.priority === "medium").length,
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

// POST /api/approvals/approve - Mark task as approved
export async function POST(request: NextRequest) {
  try {
    const { taskId, action } = await request.json()

    const data = await readFile(KANBAN_FILE, "utf-8")
    const kanban = JSON.parse(data) as KanbanData

    // Find the task and move it based on action
    if (action === "approve") {
      // Move from awaiting-approval to "sent" or "posted"
      const awaitingCol = kanban.columns.find((c) => c.id === "awaiting-approval")
      const sentCol = kanban.columns.find((c) => c.id === "sent")

      if (awaitingCol && sentCol && awaitingCol.tasks.includes(taskId)) {
        awaitingCol.tasks = awaitingCol.tasks.filter((t) => t !== taskId)
        sentCol.tasks.push(taskId)
        kanban.lastUpdated = new Date().toISOString()
      }
    } else if (action === "reject") {
      // Move from awaiting-approval to closed-lost
      const awaitingCol = kanban.columns.find((c) => c.id === "awaiting-approval")
      const closedCol = kanban.columns.find((c) => c.id === "closed-lost")

      if (awaitingCol && closedCol && awaitingCol.tasks.includes(taskId)) {
        awaitingCol.tasks = awaitingCol.tasks.filter((t) => t !== taskId)
        closedCol.tasks.push(taskId)
        kanban.lastUpdated = new Date().toISOString()
      }
    } else if (action === "revise") {
      // Stay in awaiting-approval but mark for revision
      const task = kanban.tasks[taskId]
      if (task) {
        task.status = "revision-requested"
        kanban.lastUpdated = new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      message: `Task ${action}d successfully`,
      taskId,
    })
  } catch (error) {
    console.error("Approval action error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process approval" },
      { status: 500 }
    )
  }
}
