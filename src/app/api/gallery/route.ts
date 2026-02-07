import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { getGalleryData } from "@/lib/gallery-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const type = searchParams.get("type") || "all"
    const query = (searchParams.get("q") || "").trim().toLowerCase()
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 120), 1), 400)
    const offset = Math.max(Number(searchParams.get("offset") || 0), 0)

    const galleryData = await getGalleryData()

    let assets = galleryData.assets

    if (category !== "all") {
      assets = assets.filter((asset) => asset.category === category)
    }

    if (type === "image" || type === "video") {
      assets = assets.filter((asset) => asset.type === type)
    }

    if (query.length > 0) {
      assets = assets.filter((asset) => {
        const haystack = `${asset.title} ${asset.prompt} ${asset.id} ${asset.filename} ${asset.category}`.toLowerCase()
        return haystack.includes(query)
      })
    }

    const pagedAssets = assets.slice(offset, offset + limit)
    const folderPath = galleryData.rootDir ? path.relative(process.cwd(), galleryData.rootDir) : null

    return NextResponse.json({
      token: galleryData.token,
      source: galleryData.source,
      connected: galleryData.source !== "none",
      exportedAt: galleryData.exportedAt,
      total: galleryData.total,
      loaded: assets.length,
      categories: galleryData.categories,
      folderPath,
      assetsFolderPath: folderPath ? `${folderPath}/assets` : null,
      assets: pagedAssets,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load gallery",
      },
      { status: 500 }
    )
  }
}
