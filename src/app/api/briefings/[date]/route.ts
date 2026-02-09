import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const BRIEFINGS_DIR = path.join(process.cwd(), "..", "courtlab-briefings")

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params
    const filePath = path.join(BRIEFINGS_DIR, `${date}.json`)

    try {
      const content = await fs.readFile(filePath, "utf-8")
      const briefing = JSON.parse(content)
      return NextResponse.json(briefing)
    } catch {
      return NextResponse.json(
        { error: "Briefing not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error("Error reading briefing:", error)
    return NextResponse.json(
      { error: "Failed to read briefing" },
      { status: 500 }
    )
  }
}
