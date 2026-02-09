import { promises as fs } from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

const AUTO_CONTENT_FILE = path.join(process.cwd(), "..", "courtlab-crm", "social-content-queue", "auto-generated.json")

interface AutoContent {
  id: string
  platform: "twitter" | "linkedin" | "instagram" | "tiktok"
  title: string
  content: string
  priority: "high" | "medium" | "low"
  tags: string[]
  source: string
}

export async function GET() {
  try {
    const data = await fs.readFile(AUTO_CONTENT_FILE, "utf-8")
    const content = JSON.parse(data) as AutoContent[]
    return NextResponse.json({ content, count: content.length })
  } catch (error) {
    return NextResponse.json({ content: [], count: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!Array.isArray(content)) {
      return NextResponse.json({ error: "Content must be an array" }, { status: 400 })
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(AUTO_CONTENT_FILE)
    await fs.mkdir(dir, { recursive: true })

    // Save content
    await fs.writeFile(AUTO_CONTENT_FILE, JSON.stringify(content, null, 2))

    return NextResponse.json({
      success: true,
      count: content.length,
      message: `Saved ${content.length} auto-generated content pieces`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
