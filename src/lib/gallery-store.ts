import fs from "fs/promises"
import path from "path"

const GALLERY_TOKEN = "21d9a9dc4a781c60ae3b55b059b31890"
const MANIFEST_NAME = "manifest.json"
const CACHE_TTL_MS = 60_000

type SourceType = "shared" | "context" | "none"

interface ManifestFile {
  id?: string
  type?: string
  prompt?: string
  enhancedPrompt?: string
  aspect?: string | null
  duration?: string | null
  createdAt?: string
  localPath?: string
  contentType?: string
  sizeBytes?: number
}

interface ManifestPayload {
  token?: string
  totalItems?: number
  exportedAt?: string
  files?: ManifestFile[]
}

export interface GalleryAsset {
  id: string
  type: "image" | "video"
  category: string
  title: string
  prompt: string
  aspect?: string
  duration?: string
  createdAt: string
  useCase: string
  filename: string
  contentType: string
  sizeBytes: number
  localPath: string
  url: string
}

export interface GalleryData {
  token: string
  source: SourceType
  rootDir: string
  exportedAt: string
  total: number
  assets: GalleryAsset[]
  categories: Record<string, number>
}

let cache: GalleryData | null = null
let cachedAt = 0

const CATEGORY_KEYWORDS: Array<{ category: string; keywords: string[] }> = [
  { category: "testimonial", keywords: ["testimonial", "success story", "interview", "spotlight"] },
  { category: "bts", keywords: ["behind the scenes", "bts", "setup", "backstage"] },
  { category: "combine", keywords: ["combine", "easter classic", "leaderboard", "campbelltown"] },
  { category: "app", keywords: ["app screenshot", "iphone", "android", "dashboard ui", "product ui"] },
  { category: "partner", keywords: ["partner", "partnership", "sponsor", "sponsorship", "logo lockup"] },
  { category: "training", keywords: ["drill", "training", "shooting", "defense", "workout", "coach"] },
]

function isInside(baseDir: string, targetPath: string): boolean {
  const base = path.resolve(baseDir)
  const target = path.resolve(targetPath)
  return target === base || target.startsWith(`${base}${path.sep}`)
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function normalizeAssetType(rawType: string | undefined): "image" | "video" {
  if (rawType?.toLowerCase() === "video") return "video"
  return "image"
}

function firstPromptLine(prompt: string, fallback: string): string {
  const firstLine = prompt
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0)

  if (!firstLine) return fallback
  if (firstLine.length <= 90) return firstLine
  return `${firstLine.slice(0, 87)}...`
}

function deriveCategory(prompt: string, type: "image" | "video"): string {
  const normalized = prompt.toLowerCase()
  for (const candidate of CATEGORY_KEYWORDS) {
    if (candidate.keywords.some((keyword) => normalized.includes(keyword))) {
      return candidate.category
    }
  }
  return type === "video" ? "training" : "brand"
}

function deriveUseCase(category: string): string {
  switch (category) {
    case "combine":
      return "event-promotion"
    case "training":
      return "kennys-tips"
    case "testimonial":
      return "social-proof"
    case "app":
      return "product"
    case "partner":
      return "partnership"
    case "bts":
      return "behind-the-scenes"
    default:
      return "social-media"
  }
}

function guessContentType(type: "image" | "video", filename: string, provided?: string): string {
  if (provided && provided.length > 0) return provided

  const ext = path.extname(filename).toLowerCase()
  if (type === "video") {
    if (ext === ".mov") return "video/quicktime"
    if (ext === ".webm") return "video/webm"
    return "video/mp4"
  }

  if (ext === ".png") return "image/png"
  if (ext === ".webp") return "image/webp"
  return "image/jpeg"
}

function makeAssetUrl(localPath: string): string {
  return `/api/gallery/asset?file=${encodeURIComponent(localPath)}`
}

function buildCategoryCounts(assets: GalleryAsset[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const asset of assets) {
    counts[asset.category] = (counts[asset.category] ?? 0) + 1
  }
  return counts
}

async function resolveGalleryRoot(): Promise<{ source: SourceType; rootDir: string }> {
  const sharedRoot = path.join(process.cwd(), "shared", "gallery", GALLERY_TOKEN)
  const contextRoot = path.join(process.cwd(), ".context", "gallery", GALLERY_TOKEN)

  if (await pathExists(path.join(sharedRoot, MANIFEST_NAME))) {
    return { source: "shared", rootDir: sharedRoot }
  }

  if (await pathExists(path.join(contextRoot, MANIFEST_NAME))) {
    return { source: "context", rootDir: contextRoot }
  }

  return { source: "none", rootDir: "" }
}

async function loadManifest(rootDir: string): Promise<ManifestPayload> {
  const raw = await fs.readFile(path.join(rootDir, MANIFEST_NAME), "utf8")
  return JSON.parse(raw) as ManifestPayload
}

function mapManifestToAssets(manifest: ManifestPayload): GalleryAsset[] {
  const files = Array.isArray(manifest.files) ? manifest.files : []

  return files
    .filter((file): file is ManifestFile & { localPath: string } => typeof file.localPath === "string")
    .map((file, index) => {
      const type = normalizeAssetType(file.type)
      const prompt = (file.prompt || file.enhancedPrompt || "").trim()
      const filename = path.basename(file.localPath)
      const category = deriveCategory(prompt, type)

      return {
        id: (file.id || `asset-${index + 1}`).trim(),
        type,
        category,
        title: firstPromptLine(prompt, filename),
        prompt,
        aspect: file.aspect || undefined,
        duration: file.duration || undefined,
        createdAt: file.createdAt || new Date(0).toISOString(),
        useCase: deriveUseCase(category),
        filename,
        contentType: guessContentType(type, filename, file.contentType),
        sizeBytes: typeof file.sizeBytes === "number" ? file.sizeBytes : 0,
        localPath: file.localPath,
        url: makeAssetUrl(file.localPath),
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getGalleryData(forceRefresh = false): Promise<GalleryData> {
  const now = Date.now()
  if (!forceRefresh && cache && now - cachedAt < CACHE_TTL_MS) {
    return cache
  }

  const { source, rootDir } = await resolveGalleryRoot()
  if (source === "none") {
    const empty: GalleryData = {
      token: GALLERY_TOKEN,
      source,
      rootDir,
      exportedAt: "",
      total: 0,
      assets: [],
      categories: {},
    }
    cache = empty
    cachedAt = now
    return empty
  }

  const manifest = await loadManifest(rootDir)
  const assets = mapManifestToAssets(manifest)
  const total = typeof manifest.totalItems === "number" ? manifest.totalItems : assets.length

  const data: GalleryData = {
    token: manifest.token || GALLERY_TOKEN,
    source,
    rootDir,
    exportedAt: manifest.exportedAt || "",
    total,
    assets,
    categories: buildCategoryCounts(assets),
  }

  cache = data
  cachedAt = now
  return data
}

export async function resolveGalleryFilePath(fileOrLocalPath: string): Promise<string | null> {
  const galleryData = await getGalleryData()
  if (!galleryData.rootDir) return null

  const normalized = fileOrLocalPath.replace(/\\/g, "/").replace(/^\/+/, "")
  if (normalized.includes("..")) return null

  const resolved = path.resolve(galleryData.rootDir, normalized)
  if (!isInside(galleryData.rootDir, resolved)) return null

  if (!(await pathExists(resolved))) return null
  return resolved
}

export async function findGalleryAssetById(id: string): Promise<GalleryAsset | null> {
  const galleryData = await getGalleryData()
  const asset = galleryData.assets.find((entry) => entry.id === id)
  return asset || null
}
