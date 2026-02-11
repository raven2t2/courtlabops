import { readFile, writeFile } from "fs/promises"
import { resolve } from "path"

// Try workspace location first (dev), then fallback to project data dir (prod)
const getTwitterFile = () => {
  const workspacePath = "/data/.openclaw/workspace/courtlabops-repo/data/crm/twitter/twitter-drafts.json"
  const projectPath = resolve(process.cwd(), "data", "crm", "twitter", "twitter-drafts.json")
  return [workspacePath, projectPath]
}

const TWEETS_FILES = getTwitterFile()

async function getTweetsFile() {
  for (const filePath of TWEETS_FILES) {
    try {
      await readFile(filePath, "utf-8")
      return filePath
    } catch {}
  }
  // Default to first path if none exist
  return TWEETS_FILES[0]
}

async function readTweets() {
  const filePath = await getTweetsFile()
  const content = await readFile(filePath, "utf-8")
  return JSON.parse(content)
}

async function writeTweets(data: any) {
  const filePath = await getTweetsFile()
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const tweetData = await readTweets()
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

export async function POST(request: Request) {
  try {
    const { account, text, type, status } = await request.json()
    const tweetData = await readTweets()
    
    // Generate a simple ID
    const accountKey = account as "courtlabapp_tweets" | "esthercourtlab_tweets"
    const prefix = accountKey === "courtlabapp_tweets" ? "cla" : "est"
    const nextId = Math.max(
      ...tweetData[accountKey].map((t: any) => {
        const match = t.id.match(/-(\d+)$/)
        return match ? parseInt(match[1]) : 0
      }),
      0
    ) + 1
    
    const newTweet = {
      id: `${prefix}-${nextId}`,
      type: type || "regular",
      text,
      status: status || "ready_for_posting"
    }
    
    tweetData[accountKey].push(newTweet)
    tweetData.created_at = new Date().toISOString()
    
    await writeTweets(tweetData)
    return Response.json(tweetData)
  } catch (error) {
    console.error("Error creating tweet:", error)
    return Response.json(
      { error: "Failed to create tweet" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, account, text, type, status } = await request.json()
    const tweetData = await readTweets()
    
    const accountKey = account as "courtlabapp_tweets" | "esthercourtlab_tweets"
    const tweetIndex = tweetData[accountKey].findIndex((t: any) => t.id === id)
    
    if (tweetIndex === -1) {
      return Response.json(
        { error: "Tweet not found" },
        { status: 404 }
      )
    }
    
    tweetData[accountKey][tweetIndex] = {
      id,
      type: type || "regular",
      text,
      status: status || "ready_for_posting"
    }
    
    tweetData.created_at = new Date().toISOString()
    await writeTweets(tweetData)
    
    return Response.json(tweetData)
  } catch (error) {
    console.error("Error updating tweet:", error)
    return Response.json(
      { error: "Failed to update tweet" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, account } = await request.json()
    const tweetData = await readTweets()
    
    const accountKey = account as "courtlabapp_tweets" | "esthercourtlab_tweets"
    const tweetIndex = tweetData[accountKey].findIndex((t: any) => t.id === id)
    
    if (tweetIndex === -1) {
      return Response.json(
        { error: "Tweet not found" },
        { status: 404 }
      )
    }
    
    tweetData[accountKey].splice(tweetIndex, 1)
    tweetData.created_at = new Date().toISOString()
    
    await writeTweets(tweetData)
    return Response.json(tweetData)
  } catch (error) {
    console.error("Error deleting tweet:", error)
    return Response.json(
      { error: "Failed to delete tweet" },
      { status: 500 }
    )
  }
}
