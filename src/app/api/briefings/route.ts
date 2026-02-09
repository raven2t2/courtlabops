import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const BRIEFINGS_DIR = path.join(process.cwd(), "..", "courtlab-briefings")

export async function GET() {
  try {
    try {
      const files = await fs.readdir(BRIEFINGS_DIR)
      const jsonFiles = files
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""))
        .sort()
        .reverse()

      return NextResponse.json({ dates: jsonFiles })
    } catch {
      // Directory doesn't exist yet
      return NextResponse.json({ dates: [] })
    }
  } catch (error) {
    console.error("Error reading briefings:", error)
    return NextResponse.json({ dates: [], error: "Failed to read briefings" }, { status: 500 })
  }
}
