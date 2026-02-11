import { readFile } from "fs/promises"
import { resolve } from "path"

export async function GET() {
  try {
    const filePath = resolve(process.cwd(), "data", "crm", "twitter", "twitter-drafts.json")
    const fileContent = await readFile(filePath, "utf-8")
    const tweetData = JSON.parse(fileContent)
    
    return Response.json(tweetData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    })
  } catch (error) {
    console.error("Error reading tweet drafts:", error)
    return Response.json(
      { error: "Failed to load tweet drafts" },
      { status: 500 }
    )
  }
}
