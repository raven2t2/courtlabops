import { promises as fs } from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

const BRIEFINGS_DIR = path.join(process.cwd(), "..", "courtlab-briefings")

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await context.params
    const filePath = path.join(BRIEFINGS_DIR, `${date}.json`)
    const data = await fs.readFile(filePath, "utf-8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 })
  }
}
