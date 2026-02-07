import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "kanban.json")

type BoardCard = {
  id: string
  owner: string
}

type BoardColumn = {
  id: string
  cards: BoardCard[]
}

type KanbanData = {
  version: string
  lastUpdated: string
  updatedBy: string
  columns: BoardColumn[]
  owners?: Record<
    string,
    {
      role?: string
      tasks: {
        total: number
        backlog: number
        inProgress: number
        waiting: number
        done: number
      }
    }
  >
}

const COLUMN_TO_BUCKET: Record<string, "backlog" | "inProgress" | "waiting" | "done"> = {
  backlog: "backlog",
  "in-progress": "inProgress",
  waiting: "waiting",
  "done-recent": "done",
}

async function loadKanbanData(): Promise<KanbanData> {
  const data = await readFile(DATA_FILE, "utf-8")
  return JSON.parse(data) as KanbanData
}

function buildOwnerStats(columns: BoardColumn[], existingOwners: KanbanData["owners"] = {}) {
  const owners: NonNullable<KanbanData["owners"]> = {}

  for (const [owner, value] of Object.entries(existingOwners)) {
    owners[owner] = {
      role: value.role,
      tasks: {
        total: 0,
        backlog: 0,
        inProgress: 0,
        waiting: 0,
        done: 0,
      },
    }
  }

  for (const column of columns) {
    const bucket = COLUMN_TO_BUCKET[column.id]
    if (!bucket) continue

    for (const card of column.cards) {
      const ownerName = card.owner || "Unassigned"
      if (!owners[ownerName]) {
        owners[ownerName] = {
          role: ownerName === "Esther" ? "Project Manager / CMO" : ownerName === "Michael" ? "Founder" : "Team Member",
          tasks: {
            total: 0,
            backlog: 0,
            inProgress: 0,
            waiting: 0,
            done: 0,
          },
        }
      }

      owners[ownerName].tasks.total += 1
      owners[ownerName].tasks[bucket] += 1
    }
  }

  return owners
}

export async function GET() {
  try {
    const kanban = await loadKanbanData()
    return NextResponse.json(kanban)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load kanban" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { columns?: BoardColumn[]; updatedBy?: string }
    if (!Array.isArray(body.columns)) {
      return NextResponse.json({ error: "Invalid payload: columns are required" }, { status: 400 })
    }

    const current = await loadKanbanData()
    const updatedBy = typeof body.updatedBy === "string" && body.updatedBy.trim().length > 0 ? body.updatedBy.trim() : "Kanban Board"

    const next: KanbanData = {
      ...current,
      columns: body.columns,
      lastUpdated: new Date().toISOString(),
      updatedBy,
      owners: buildOwnerStats(body.columns, current.owners),
    }

    await writeFile(DATA_FILE, JSON.stringify(next, null, 2))
    return NextResponse.json({ ok: true, kanban: next })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update kanban" }, { status: 500 })
  }
}
