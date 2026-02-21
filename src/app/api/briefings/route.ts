import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Read the pre-generated index file (updated by cron jobs)
    const indexPath = path.join(process.cwd(), "public", "data", "briefings-index.json")
    const indexData = await fs.readFile(indexPath, "utf-8")
    const index = JSON.parse(indexData)
    
    return NextResponse.json({ 
      briefings: index.briefings,
      count: index.count,
      lastUpdated: index.lastUpdated
    })
  } catch (error) {
    console.error("Error reading briefings index:", error)
    return NextResponse.json({ 
      briefings: [], 
      count: 0,
      error: "Could not load briefings index"
    })
  }
}
