import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

const BRIEFINGS_DIR = path.join(process.cwd(), "public", "data", "briefings")

export async function GET() {
  try {
    const files = await fs.readdir(BRIEFINGS_DIR)
    const briefingFiles = files.sort().reverse()
    
    // Return all briefing files (both .md and .json)
    return NextResponse.json({ 
      dates: briefingFiles,
      count: briefingFiles.length 
    })
  } catch (error) {
    console.error("Error reading briefings:", error)
    return NextResponse.json({ dates: [], count: 0 })
  }
}
