import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const BRIEFINGS_DIR = "/data/.openclaw/workspace/courtlab-briefings"

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params
    const filePath = path.join(BRIEFINGS_DIR, `briefing-${date}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Briefing not found" },
        { status: 404 }
      )
    }

    const content = fs.readFileSync(filePath, "utf-8")
    const briefing = JSON.parse(content)

    return NextResponse.json(briefing)
  } catch (error) {
    console.error("Error reading briefing:", error)
    return NextResponse.json(
      { error: "Failed to read briefing" },
      { status: 500 }
    )
  }
}
