"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Play,
  Plus,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
  Twitter,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Platform = "twitter" | "instagram" | "facebook"
type PostType = "feed" | "story" | "reel" | "thread" | "poll"

type CaptionTone = "assistant" | "promotion" | "announcement"

interface GalleryAsset {
  id: string
  type: "image" | "video"
  category: string
  title: string
  prompt: string
  createdAt: string
  useCase: string
  filename: string
  url: string
}

interface QueuePost {
  id: string
  platform: Platform
  type: PostType
  status: "pending" | "approved" | "rejected" | "posted" | "scheduled"
  caption: string
  scheduledTime: string
  mediaUrls?: string[]
  createdAt: string
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>{children}</span>
}

function compact(text: string, max = 90): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3)}...`
}

function firstLine(prompt: string): string {
  const line = prompt
    .split("\n")
    .map((part) => part.trim())
    .find((part) => part.length > 0)
  return line || "CourtLab update"
}

function composeCaption(asset: GalleryAsset, tone: CaptionTone): string {
  const headline = firstLine(asset.prompt)

  if (tone === "promotion") {
    return `${headline}\n\nBuilt for players who want verified improvement, not guesswork.\nBook a demo or trial with CourtLab today.\n\n#CourtLab #BasketballDevelopment #BecomeUndeniable`
  }

  if (tone === "announcement") {
    return `${headline}\n\nNew content is live in CourtLab Ops. Review this asset, tweak the message, and push it to your audience.\n\n#CourtLab #BasketballOps #TeamUpdate`
  }

  return `${headline}\n\nDrafted from your gallery. Update this text with campaign context and approve when ready.\n\n#CourtLab #BecomeUndeniable #Basketball`
}

function nextScheduleISO(): string {
  const next = new Date()
  next.setMinutes(0, 0, 0)
  next.setHours(next.getHours() + 1)
  return next.toISOString()
}

function toLocalInputValue(isoString: string): string {
  const date = new Date(isoString)
  const offset = date.getTimezoneOffset() * 60_000
  const local = new Date(date.getTime() - offset)
  return local.toISOString().slice(0, 16)
}

function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString()
}

export default function ContentPage() {
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([])
  const [queuePosts, setQueuePosts] = useState<QueuePost[]>([])
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all")
  const [platform, setPlatform] = useState<Platform>("twitter")
  const [postType, setPostType] = useState<PostType>("feed")
  const [captionTone, setCaptionTone] = useState<CaptionTone>("assistant")
  const [scheduledTime, setScheduledTime] = useState<string>(toLocalInputValue(nextScheduleISO()))
  const [captionDraft, setCaptionDraft] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const selectedAssets = useMemo(
    () => galleryAssets.filter((asset) => selectedAssetIds.has(asset.id)),
    [galleryAssets, selectedAssetIds]
  )

  const pendingPosts = useMemo(
    () => queuePosts.filter((post) => post.status === "pending"),
    [queuePosts]
  )

  const imagesCount = useMemo(() => galleryAssets.filter((asset) => asset.type === "image").length, [galleryAssets])
  const videosCount = useMemo(() => galleryAssets.filter((asset) => asset.type === "video").length, [galleryAssets])

  useEffect(() => {
    void loadGallery()
    void loadQueue()
  }, [])

  async function loadGallery(customQuery = query, customType = typeFilter): Promise<void> {
    try {
      const params = new URLSearchParams()
      params.set("limit", "160")
      if (customQuery.trim().length > 0) params.set("q", customQuery.trim())
      if (customType !== "all") params.set("type", customType)

      const res = await fetch(`/api/gallery?${params.toString()}`, { cache: "no-store" })
      const data = (await res.json()) as { assets?: GalleryAsset[] }
      setGalleryAssets(Array.isArray(data.assets) ? data.assets : [])
    } catch (error) {
      console.error("Failed to load gallery", error)
      setStatusMessage("Failed to load gallery assets.")
    }
  }

  async function loadQueue(): Promise<void> {
    try {
      const res = await fetch("/api/queue", { cache: "no-store" })
      const data = (await res.json()) as { posts?: QueuePost[] }
      setQueuePosts(Array.isArray(data.posts) ? data.posts : [])
    } catch (error) {
      console.error("Failed to load queue", error)
    }
  }

  function toggleAsset(id: string): void {
    setSelectedAssetIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function generateDraftFromSelection(): void {
    const asset = selectedAssets[0]
    if (!asset) {
      setStatusMessage("Select at least one asset first.")
      return
    }
    setCaptionDraft(composeCaption(asset, captionTone))
    setStatusMessage("Caption drafted from selected gallery asset.")
  }

  async function createPosts(): Promise<void> {
    if (selectedAssets.length === 0) {
      setStatusMessage("Select at least one asset to queue posts.")
      return
    }

    setIsLoading(true)
    setStatusMessage(null)

    try {
      const selectedScheduleIso = fromLocalInputValue(scheduledTime)

      for (const asset of selectedAssets) {
        const caption = captionDraft.trim().length > 0 ? captionDraft : composeCaption(asset, captionTone)

        const payload = {
          platform,
          type: postType,
          caption,
          scheduledTime: selectedScheduleIso,
          mediaUrls: [asset.url],
          hashtags: ["#CourtLab", "#BecomeUndeniable"],
        }

        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const data = (await res.json()) as { error?: string }
          throw new Error(data.error || `Failed to create post for ${asset.title}`)
        }
      }

      setCaptionDraft("")
      setSelectedAssetIds(new Set())
      await loadQueue()
      setStatusMessage(`Queued ${selectedAssets.length} post(s) for review.`)
    } catch (error) {
      console.error("Failed to create posts", error)
      setStatusMessage(error instanceof Error ? error.message : "Failed to create posts")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-[1700px] p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content Generator</p>
                <Badge className="border-accent-green/40 bg-accent-green-muted text-accent-green">
                  <CheckCircle2 size={10} /> Queue Enabled
                </Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Generate Posts From Gallery</h1>
              <p className="mt-1 text-sm text-text-secondary">Build drafts from real gallery assets, then send them to approvals for final review.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  void loadGallery()
                  void loadQueue()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2 text-sm font-semibold text-text-secondary"
              >
                <RefreshCcw size={14} /> Refresh
              </button>
              <Link
                href="/approvals"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white"
              >
                <Send size={14} /> Open Approvals
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Gallery Assets</p>
              <p className="mt-1 text-3xl font-extrabold text-text-primary">{galleryAssets.length}</p>
              <p className="text-xs text-text-secondary">Loaded for generation</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Images</p>
              <p className="mt-1 text-3xl font-extrabold text-accent-green">{imagesCount}</p>
              <p className="text-xs text-text-secondary">Brand + static content</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Videos</p>
              <p className="mt-1 text-3xl font-extrabold text-velocity-orange">{videosCount}</p>
              <p className="text-xs text-text-secondary">Reels and motion clips</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Pending Review</p>
              <p className="mt-1 text-3xl font-extrabold text-accent-amber">{pendingPosts.length}</p>
              <p className="text-xs text-text-secondary">Waiting approval</p>
            </div>
          </div>

          {statusMessage ? <p className="mt-3 text-xs text-text-secondary">{statusMessage}</p> : null}
        </Surface>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Surface>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <label className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                  <Search size={14} className="text-text-muted" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search gallery assets"
                    className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                  />
                </label>

                <div className="flex gap-1">
                  {(["all", "image", "video"] as const).map((value) => (
                    <button
                      key={value}
                      onClick={() => setTypeFilter(value)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs font-medium",
                        typeFilter === value ? "bg-hyper-blue text-white" : "bg-bg-primary text-text-secondary"
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => void loadGallery(query, typeFilter)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-semibold text-text-secondary"
                >
                  <Search size={12} /> Apply
                </button>
              </div>

              <div className="grid max-h-[480px] grid-cols-2 gap-3 overflow-auto md:grid-cols-3 lg:grid-cols-4">
                {galleryAssets.map((asset) => {
                  const selected = selectedAssetIds.has(asset.id)
                  return (
                    <button
                      key={asset.id}
                      onClick={() => toggleAsset(asset.id)}
                      className={cn(
                        "overflow-hidden rounded-xl border text-left transition-all",
                        selected ? "border-hyper-blue bg-hyper-blue/5" : "border-border-subtle bg-bg-primary"
                      )}
                    >
                      <div className="relative h-24 w-full bg-bg-tertiary">
                        {asset.type === "video" ? (
                          <video src={asset.url} className="h-full w-full object-cover" muted />
                        ) : (
                          <img src={asset.url} alt={asset.title} className="h-full w-full object-cover" />
                        )}
                        <span className="absolute right-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[10px] uppercase text-white">{asset.type}</span>
                      </div>
                      <div className="space-y-1 p-2">
                        <p className="line-clamp-1 text-xs font-semibold text-text-primary">{asset.title}</p>
                        <p className="text-[10px] text-text-muted">{asset.category}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Surface>

            <Surface>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-text-primary">Selected Assets</h2>
                <Badge className="border-border-default bg-bg-tertiary text-text-secondary">{selectedAssets.length} selected</Badge>
              </div>

              {selectedAssets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-subtle bg-bg-primary p-6 text-center text-sm text-text-muted">
                  Select gallery assets above to start generating posts.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between rounded-xl border border-border-subtle bg-bg-primary p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">{asset.title}</p>
                        <p className="text-xs text-text-muted">{asset.category} · {new Date(asset.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => toggleAsset(asset.id)}
                        className="rounded-lg p-1.5 text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
                        aria-label="Remove asset"
                      >
                        <Plus size={14} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Surface>
          </div>

          <div className="space-y-4">
            <Surface>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green-muted text-accent-green">
                  <Sparkles size={15} />
                </div>
                <h2 className="text-base font-bold text-text-primary">Post Composer</h2>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1 text-xs text-text-muted">
                    Platform
                    <select
                      value={platform}
                      onChange={(event) => setPlatform(event.target.value as Platform)}
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                    >
                      <option value="twitter">Twitter/X</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-xs text-text-muted">
                    Post Type
                    <select
                      value={postType}
                      onChange={(event) => setPostType(event.target.value as PostType)}
                      className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                    >
                      <option value="feed">Feed</option>
                      <option value="story">Story</option>
                      <option value="reel">Reel</option>
                      <option value="thread">Thread</option>
                      <option value="poll">Poll</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1 text-xs text-text-muted">
                  Caption Tone
                  <select
                    value={captionTone}
                    onChange={(event) => setCaptionTone(event.target.value as CaptionTone)}
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                  >
                    <option value="assistant">Assistant Draft</option>
                    <option value="promotion">Promotion</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </label>

                <label className="space-y-1 text-xs text-text-muted">
                  Scheduled Time
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                  />
                </label>

                <label className="space-y-1 text-xs text-text-muted">
                  Caption Draft (optional override)
                  <textarea
                    value={captionDraft}
                    onChange={(event) => setCaptionDraft(event.target.value)}
                    placeholder="Leave blank to auto-generate from each selected asset"
                    className="min-h-32 w-full rounded-lg border border-border-default bg-bg-primary px-2.5 py-2 text-sm text-text-primary"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={generateDraftFromSelection}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-xs font-semibold text-text-secondary"
                  >
                    <FileText size={13} /> Draft Caption
                  </button>
                  <button
                    onClick={() => void createPosts()}
                    disabled={isLoading || selectedAssets.length === 0}
                    className="inline-flex items-center gap-2 rounded-lg bg-hyper-blue px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    <Send size={13} /> {isLoading ? "Queuing..." : `Queue ${selectedAssets.length || ""} Post(s)`}
                  </button>
                </div>
              </div>
            </Surface>

            <Surface>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-text-primary">Waiting For Review</h2>
                <Link href="/approvals" className="text-xs font-semibold text-hyper-blue hover:underline">
                  Open queue
                </Link>
              </div>

              <div className="space-y-2">
                {pendingPosts.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border-subtle bg-bg-primary px-3 py-4 text-center text-xs text-text-muted">
                    No pending posts yet.
                  </div>
                ) : (
                  pendingPosts.slice(0, 8).map((post) => (
                    <div key={post.id} className="rounded-lg border border-border-subtle bg-bg-primary p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-text-secondary">{post.platform} · {post.type}</p>
                        <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                          <Clock size={10} /> Pending
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-text-primary">{compact(post.caption, 120)}</p>
                      <p className="mt-1 text-[11px] text-text-muted">{new Date(post.scheduledTime).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </Surface>

            <Surface>
              <div className="mb-3 flex items-center gap-2">
                <CalendarClock size={16} className="text-accent-violet" />
                <h2 className="text-base font-bold text-text-primary">Generation Notes</h2>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2"><Twitter size={12} className="mt-0.5 text-hyper-blue" />Twitter drafts are generated as pending and require your approval.</li>
                <li className="flex items-start gap-2"><ImageIcon size={12} className="mt-0.5 text-accent-green" />Media comes directly from your gallery export via API streaming.</li>
                <li className="flex items-start gap-2"><Video size={12} className="mt-0.5 text-velocity-orange" />Use `reel` or `story` for video-first assets before approving.</li>
              </ul>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  )
}
