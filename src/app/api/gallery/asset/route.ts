import fs from "fs/promises"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { findGalleryAssetById, resolveGalleryFilePath } from "@/lib/gallery-store"

function guessMimeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === ".png") return "image/png"
  if (ext === ".webp") return "image/webp"
  if (ext === ".gif") return "image/gif"
  if (ext === ".mov") return "video/quicktime"
  if (ext === ".webm") return "video/webm"
  if (ext === ".mp4") return "video/mp4"
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg"
  return "application/octet-stream"
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const file = searchParams.get("file")

    let targetFilePath: string | null = null

    if (id) {
      const asset = await findGalleryAssetById(id)
      if (asset) {
        targetFilePath = await resolveGalleryFilePath(asset.localPath)
      }
    } else if (file) {
      targetFilePath = await resolveGalleryFilePath(file)
    }

    if (!targetFilePath) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    const content = await fs.readFile(targetFilePath)
    const mimeType = guessMimeFromPath(targetFilePath)

    return new NextResponse(content, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load gallery asset",
      },
      { status: 500 }
    )
  }
}
