import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

const BRIEFINGS_DIR = path.join(process.cwd(), "..", "courtlab-briefings")

export async function GET() {
  try {
    const files = await fs.readdir(BRIEFINGS_DIR)
    const jsonFiles = files.filter((f) => f.endsWith(".json")).sort().reverse()
    const dates = jsonFiles.map((f) => f.replace(".json", ""))

    return NextResponse.json({ dates })
  } catch (error) {
    return NextResponse.json({ dates: [] })
  }
}
