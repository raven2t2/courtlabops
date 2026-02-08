import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const BRIEFINGS_DIR = "/data/.openclaw/workspace/courtlab-briefings"

export async function GET() {
  try {
    // Ensure directory exists
    if (!fs.existsSync(BRIEFINGS_DIR)) {
      fs.mkdirSync(BRIEFINGS_DIR, { recursive: true })
      return NextResponse.json({ files: [] })
    }

    // Get all briefing files
    const files = fs.readdirSync(BRIEFINGS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const filePath = path.join(BRIEFINGS_DIR, f)
        const stat = fs.statSync(filePath)
        const dateMatch = f.match(/(\d{4}-\d{2}-\d{2})/)
        return {
          date: dateMatch ? dateMatch[1] : f.replace(".json", ""),
          timestamp: Math.floor(stat.mtimeMs / 1000),
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error reading briefings:", error)
    return NextResponse.json({ files: [], error: "Failed to read briefings" }, { status: 500 })
  }
}
