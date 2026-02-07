"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Check,
  Clock,
  Edit3,
  Eye,
  Filter,
  Image as ImageIcon,
  Instagram,
  Play,
  Search,
  Send,
  ThumbsUp,
  Trash2,
  Twitter,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Platform = "twitter" | "instagram" | "facebook"
type PostStatus = "pending" | "approved" | "rejected" | "posted" | "scheduled"
type PostType = "feed" | "story" | "reel" | "thread" | "poll"

interface Post {
  id: string
  platform: Platform
  type: PostType
  status: PostStatus
  scheduledTime: string
  caption: string
  mediaUrls?: string[]
  hashtags?: string[]
  mentions?: string[]
  link?: string
  createdAt: string
  postedAt?: string
  postedUrl?: string
  error?: string
}

interface QueueStats {
  total: number
  pending: number
  approved: number
  rejected: number
  posted: number
  scheduled: number
}

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

const PLATFORM_CONFIG: Record<Platform, { label: string; icon: typeof Twitter; color: string; bg: string }> = {
  twitter: { label: "Twitter/X", icon: Twitter, color: "text-sky-400", bg: "bg-sky-500/10" },
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-500", bg: "bg-pink-500/10" },
  facebook: { label: "Facebook", icon: ThumbsUp, color: "text-blue-500", bg: "bg-blue-500/10" },
}

const STATUS_CONFIG: Record<PostStatus, { label: string; tone: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", tone: "border-accent-amber/40 bg-accent-amber-muted text-accent-amber", icon: Clock },
  approved: { label: "Approved", tone: "border-accent-green/40 bg-accent-green-muted text-accent-green", icon: Check },
  rejected: { label: "Rejected", tone: "border-accent-red/40 bg-accent-red-muted text-accent-red", icon: X },
  posted: { label: "Posted", tone: "border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue", icon: Send },
  scheduled: { label: "Scheduled", tone: "border-accent-violet/40 bg-accent-violet-muted text-accent-violet", icon: Calendar },
}

const TYPE_LABELS: Record<PostType, string> = {
  feed: "Feed Post",
  story: "Story",
  reel: "Reel",
  thread: "Thread",
  poll: "Poll",
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>
      {children}
    </span>
  )
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function isVideoUrl(url: string): boolean {
  const decoded = decodeURIComponent(url).toLowerCase()
  return decoded.includes(".mp4") || decoded.includes(".mov") || decoded.includes(".webm")
}

function compact(text: string, max = 90): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 3)}...`
}

export default function ApprovalsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all")
  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [galleryQuery, setGalleryQuery] = useState("")
  const [galleryType, setGalleryType] = useState<"all" | "image" | "video">("all")
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([])
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedCaption, setEditedCaption] = useState("")
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGalleryLoading, setIsGalleryLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [stats, setStats] = useState<QueueStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    posted: 0,
    scheduled: 0,
  })

  const selectedPost = useMemo(() => posts.find((post) => post.id === selectedPostId) || null, [posts, selectedPostId])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesPlatform = filterPlatform === "all" || post.platform === filterPlatform
      const matchesStatus = filterStatus === "all" || post.status === filterStatus
      const searchable = `${post.caption} ${post.id}`.toLowerCase()
      const matchesSearch = searchable.includes(searchQuery.toLowerCase())
      return matchesPlatform && matchesStatus && matchesSearch
    })
  }, [posts, filterPlatform, filterStatus, searchQuery])

  useEffect(() => {
    void loadPosts()
    void loadStats()
    void loadGallery()
  }, [])

  useEffect(() => {
    if (!selectedPost) {
      setEditedCaption("")
      setSelectedMediaUrls([])
      setEditMode(false)
      return
    }

    setEditedCaption(selectedPost.caption)
    setSelectedMediaUrls(selectedPost.mediaUrls || [])
    setEditMode(false)
  }, [selectedPostId, selectedPost])

  async function loadPosts(): Promise<void> {
    try {
      const res = await fetch("/api/queue", { cache: "no-store" })
      const data = (await res.json()) as { posts?: Post[] }
      const nextPosts = Array.isArray(data.posts) ? data.posts : []
      setPosts(nextPosts)

      if (nextPosts.length > 0 && (!selectedPostId || !nextPosts.some((post) => post.id === selectedPostId))) {
        setSelectedPostId(nextPosts[0].id)
      }

      if (nextPosts.length === 0) {
        setSelectedPostId(null)
      }
    } catch (error) {
      console.error("Failed to load posts", error)
      setStatusMessage("Failed to load review queue.")
    }
  }

  async function loadStats(): Promise<void> {
    try {
      const res = await fetch("/api/post", { cache: "no-store" })
      const data = (await res.json()) as { stats?: QueueStats }
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to load queue stats", error)
    }
  }

  async function loadGallery(query = galleryQuery, type = galleryType): Promise<void> {
    setIsGalleryLoading(true)

    try {
      const params = new URLSearchParams()
      params.set("limit", "120")
      if (query.trim().length > 0) params.set("q", query.trim())
      if (type !== "all") params.set("type", type)

      const res = await fetch(`/api/gallery?${params.toString()}`, { cache: "no-store" })
      const data = (await res.json()) as { assets?: GalleryAsset[] }
      setGalleryAssets(Array.isArray(data.assets) ? data.assets : [])
    } catch (error) {
      console.error("Failed to load gallery", error)
      setStatusMessage("Gallery is unavailable right now.")
    } finally {
      setIsGalleryLoading(false)
    }
  }

  async function updatePost(postId: string, action: "approve" | "reject" | "edit", edits?: Partial<Post>): Promise<void> {
    setIsLoading(true)

    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action, edits }),
      })

      if (!res.ok) {
        const payload = (await res.json()) as { error?: string }
        throw new Error(payload.error || "Failed to update post")
      }

      await loadPosts()
      await loadStats()
      setStatusMessage("Post updated.")
    } catch (error) {
      console.error("Failed to update post", error)
      setStatusMessage(error instanceof Error ? error.message : "Failed to update post")
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePublishNow(postId: string): Promise<void> {
    setIsLoading(true)

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      })

      const data = (await res.json()) as { success?: boolean; posted?: number; results?: Array<{ error?: string }> }
      if (!data.success) {
        throw new Error(data.results?.[0]?.error || "Post failed")
      }

      await loadPosts()
      await loadStats()
      setStatusMessage(`Published ${data.posted || 0} post(s).`)
    } catch (error) {
      console.error("Failed to publish", error)
      setStatusMessage(error instanceof Error ? error.message : "Failed to publish")
    } finally {
      setIsLoading(false)
    }
  }

  function toggleAsset(asset: GalleryAsset): void {
    setSelectedMediaUrls((current) => {
      if (current.includes(asset.url)) {
        return current.filter((url) => url !== asset.url)
      }
      const next = [...current, asset.url]
      return next.slice(0, 4)
    })
  }

  const mediaChanged = useMemo(() => {
    if (!selectedPost) return false
    const existing = selectedPost.mediaUrls || []
    if (existing.length !== selectedMediaUrls.length) return true
    return existing.some((url, index) => url !== selectedMediaUrls[index])
  }, [selectedPost, selectedMediaUrls])

  const captionChanged = useMemo(() => {
    if (!selectedPost) return false
    return editedCaption !== selectedPost.caption
  }, [selectedPost, editedCaption])

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-[1700px] p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content Approval Queue</p>
                {stats.pending > 0 ? (
                  <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">{stats.pending} Pending</Badge>
                ) : null}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Review, Edit, Approve</h1>
              <p className="mt-1 text-sm text-text-secondary">Swap text and gallery media, then approve for scheduled auto-posting.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </label>
              <button
                onClick={() => {
                  void loadPosts()
                  void loadStats()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white"
              >
                <Send size={14} /> Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { label: "Total", value: stats.total, icon: Eye, tone: "text-text-primary" },
              { label: "Pending", value: stats.pending, icon: Clock, tone: "text-accent-amber" },
              { label: "Approved", value: stats.approved, icon: Check, tone: "text-accent-green" },
              { label: "Scheduled", value: stats.scheduled, icon: Calendar, tone: "text-accent-violet" },
              { label: "Posted", value: stats.posted, icon: Send, tone: "text-hyper-blue" },
              { label: "Rejected", value: stats.rejected, icon: X, tone: "text-accent-red" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{item.label}</p>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-bg-tertiary", item.tone)}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <p className={cn("text-3xl font-extrabold", item.tone)}>{item.value}</p>
                </div>
              )
            })}
          </div>

          {statusMessage ? <p className="mt-3 text-xs text-text-secondary">{statusMessage}</p> : null}
        </Surface>

        <Surface className="mb-4 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-text-muted" />
              <span className="text-xs font-semibold text-text-muted">Filter:</span>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setFilterPlatform("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  filterPlatform === "all" ? "bg-hyper-blue text-white" : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                All Platforms
              </button>
              {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => {
                const Icon = PLATFORM_CONFIG[platform].icon
                return (
                  <button
                    key={platform}
                    onClick={() => setFilterPlatform(platform)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                      filterPlatform === platform ? PLATFORM_CONFIG[platform].bg : "bg-bg-tertiary hover:bg-bg-primary",
                      filterPlatform === platform ? PLATFORM_CONFIG[platform].color : "text-text-secondary"
                    )}
                  >
                    <Icon size={12} />
                    {PLATFORM_CONFIG[platform].label}
                  </button>
                )
              })}
            </div>

            <div className="h-4 w-px bg-border-default" />

            <div className="flex gap-1">
              {(["pending", "approved", "posted", "rejected", "all"] as Array<PostStatus | "all">).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    filterStatus === status
                      ? status === "all"
                        ? "bg-hyper-blue text-white"
                        : STATUS_CONFIG[status].tone
                      : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                  )}
                >
                  {status === "all" ? "All" : STATUS_CONFIG[status].label}
                </button>
              ))}
            </div>
          </div>
        </Surface>

        <div className="grid gap-4 lg:grid-cols-2">
          <Surface className="max-h-[760px] overflow-auto">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Posts Queue</h2>
              <span className="text-xs text-text-muted">{filteredPosts.length} posts</span>
            </div>

            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-primary py-12">
                  <Clock size={32} className="mb-2 text-text-muted" />
                  <p className="text-sm text-text-secondary">No posts match your filters</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const platform = PLATFORM_CONFIG[post.platform]
                  const status = STATUS_CONFIG[post.status]
                  const StatusIcon = status.icon
                  const PlatformIcon = platform.icon

                  return (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPostId(post.id)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition-all",
                        selectedPostId === post.id
                          ? "border-hyper-blue bg-hyper-blue/5"
                          : "border-border-subtle bg-bg-primary hover:border-border-default"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", platform.bg)}>
                          <PlatformIcon size={18} className={platform.color} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("text-xs font-semibold", platform.color)}>{platform.label}</span>
                            <span className="text-xs text-text-muted">{TYPE_LABELS[post.type]}</span>
                            <Badge className={status.tone}>
                              <StatusIcon size={10} className="mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-text-primary">{post.caption}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                            <span>{formatDate(post.scheduledTime)}</span>
                            <span>·</span>
                            <span>{post.mediaUrls?.length || 0} media</span>
                          </div>
                          {post.error ? <p className="mt-1 text-xs text-accent-red">Error: {post.error}</p> : null}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </Surface>

          <Surface className="max-h-[760px] overflow-auto">
            {selectedPost ? (
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", PLATFORM_CONFIG[selectedPost.platform].bg)}>
                      {(() => {
                        const Icon = PLATFORM_CONFIG[selectedPost.platform].icon
                        return <Icon size={16} className={PLATFORM_CONFIG[selectedPost.platform].color} />
                      })()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{PLATFORM_CONFIG[selectedPost.platform].label}</p>
                      <p className="text-xs text-text-muted">{TYPE_LABELS[selectedPost.type]} · {formatDate(selectedPost.scheduledTime)}</p>
                    </div>
                  </div>
                  <Badge className={STATUS_CONFIG[selectedPost.status].tone}>{STATUS_CONFIG[selectedPost.status].label}</Badge>
                </div>

                <div className="mb-4 rounded-xl border border-border-subtle bg-bg-tertiary p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Media ({selectedMediaUrls.length})</p>
                    <button
                      onClick={() => setGalleryOpen((open) => !open)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border-default bg-bg-primary px-2 py-1 text-xs font-medium text-text-secondary hover:bg-bg-secondary"
                    >
                      <ImageIcon size={12} /> {galleryOpen ? "Close Gallery" : "Swap Media"}
                    </button>
                  </div>

                  {selectedMediaUrls.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border-default bg-bg-primary px-3 py-4 text-center text-xs text-text-muted">
                      No media attached.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {selectedMediaUrls.map((url) => (
                        <div key={url} className="overflow-hidden rounded-lg border border-border-subtle bg-bg-primary">
                          {isVideoUrl(url) ? (
                            <video src={url} controls className="h-24 w-full object-cover" />
                          ) : (
                            <img src={url} alt="Selected media" className="h-24 w-full object-cover" />
                          )}
                          <div className="flex items-center justify-between border-t border-border-subtle px-2 py-1">
                            <p className="line-clamp-1 text-[10px] text-text-muted">{compact(decodeURIComponent(url).split("/").pop() || "media")}</p>
                            <button
                              onClick={() => setSelectedMediaUrls((current) => current.filter((item) => item !== url))}
                              className="rounded-md p-1 text-text-muted hover:bg-bg-tertiary hover:text-text-primary"
                              aria-label="Remove media"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPost.status !== "posted" && mediaChanged ? (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => void updatePost(selectedPost.id, "edit", { mediaUrls: selectedMediaUrls })}
                        disabled={isLoading}
                        className="rounded-lg bg-hyper-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-hyper-blue/90 disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save Media"}
                      </button>
                    </div>
                  ) : null}
                </div>

                {galleryOpen ? (
                  <div className="mb-4 rounded-xl border border-border-subtle bg-bg-primary p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border-default bg-bg-secondary px-2 py-1.5">
                        <Search size={12} className="text-text-muted" />
                        <input
                          value={galleryQuery}
                          onChange={(event) => setGalleryQuery(event.target.value)}
                          placeholder="Search gallery"
                          className="w-full bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted"
                        />
                      </label>

                      <div className="flex gap-1">
                        {(["all", "image", "video"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setGalleryType(type)}
                            className={cn(
                              "rounded-lg px-2.5 py-1.5 text-xs font-medium",
                              galleryType === type ? "bg-hyper-blue text-white" : "bg-bg-secondary text-text-secondary"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => void loadGallery(galleryQuery, galleryType)}
                        className="rounded-lg border border-border-default bg-bg-secondary px-2.5 py-1.5 text-xs font-semibold text-text-secondary"
                      >
                        Apply
                      </button>
                    </div>

                    {isGalleryLoading ? (
                      <div className="py-4 text-center text-xs text-text-muted">Loading gallery...</div>
                    ) : (
                      <div className="grid max-h-64 grid-cols-2 gap-2 overflow-auto md:grid-cols-3">
                        {galleryAssets.map((asset) => {
                          const selected = selectedMediaUrls.includes(asset.url)
                          return (
                            <button
                              key={asset.id}
                              onClick={() => toggleAsset(asset)}
                              className={cn(
                                "overflow-hidden rounded-lg border text-left",
                                selected ? "border-hyper-blue" : "border-border-subtle"
                              )}
                            >
                              <div className="relative h-20 w-full bg-bg-tertiary">
                                {asset.type === "video" ? (
                                  <video src={asset.url} className="h-full w-full object-cover" muted />
                                ) : (
                                  <img src={asset.url} alt={asset.title} className="h-full w-full object-cover" />
                                )}
                                <span className="absolute right-1 top-1 rounded bg-black/70 px-1 py-0.5 text-[10px] uppercase text-white">{asset.type}</span>
                              </div>
                              <div className="space-y-0.5 p-2">
                                <p className="line-clamp-1 text-xs font-semibold text-text-primary">{asset.title}</p>
                                <p className="text-[10px] text-text-muted">{asset.category}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Caption</p>
                    {!editMode && selectedPost.status !== "posted" ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-hyper-blue hover:bg-hyper-blue/10"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                    ) : null}
                  </div>

                  {editMode ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedCaption}
                        onChange={(event) => setEditedCaption(event.target.value)}
                        className="min-h-[160px] w-full rounded-xl border border-border-default bg-bg-primary p-3 text-sm text-text-primary outline-none focus:border-hyper-blue"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditMode(false)
                            setEditedCaption(selectedPost.caption)
                          }}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-tertiary"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => void updatePost(selectedPost.id, "edit", { caption: editedCaption })}
                          disabled={isLoading || !captionChanged}
                          className="rounded-lg bg-hyper-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-hyper-blue/90 disabled:opacity-50"
                        >
                          {isLoading ? "Saving..." : "Save Caption"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                      <p className="whitespace-pre-wrap text-sm text-text-primary">{selectedPost.caption}</p>
                    </div>
                  )}
                </div>

                {selectedPost.hashtags && selectedPost.hashtags.length > 0 ? (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Hashtags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPost.hashtags.map((tag) => (
                        <span key={tag} className="rounded-lg bg-bg-tertiary px-2 py-1 text-xs text-text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selectedPost.postedUrl ? (
                  <div className="mb-4 rounded-lg border border-accent-green/40 bg-accent-green-muted p-3 text-xs text-accent-green">
                    Posted: <a href={selectedPost.postedUrl} target="_blank" rel="noreferrer" className="underline">{selectedPost.postedUrl}</a>
                  </div>
                ) : null}

                {selectedPost.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => void updatePost(selectedPost.id, "approve")}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-green py-3 text-sm font-semibold text-white hover:bg-accent-green/90 disabled:opacity-50"
                    >
                      <Check size={16} /> {isLoading ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => void updatePost(selectedPost.id, "reject")}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-accent-red/40 bg-accent-red-muted px-4 py-3 text-sm font-semibold text-accent-red hover:bg-accent-red/20 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Reject
                    </button>
                  </div>
                ) : null}

                {selectedPost.status === "approved" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => void handlePublishNow(selectedPost.id)}
                      disabled={isLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-hyper-blue py-3 text-sm font-semibold text-white hover:bg-hyper-blue/90 disabled:opacity-50"
                    >
                      <Send size={16} /> {isLoading ? "Posting..." : "Post Now"}
                    </button>
                    <button
                      onClick={() => void updatePost(selectedPost.id, "reject")}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-bg-tertiary disabled:opacity-50"
                    >
                      <X size={16} /> Unapprove
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <Eye size={48} className="mb-4 text-text-muted" />
                <p className="text-sm font-medium text-text-secondary">Select a post to review</p>
                <p className="text-xs text-text-muted">Your queue is ready for caption and media edits.</p>
              </div>
            )}
          </Surface>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green/10">
                <Calendar size={20} className="text-accent-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Daily Review Window</p>
                <p className="mt-1 text-xs text-text-secondary">Posts generated from gallery assets arrive as pending items. Approve before publish windows to keep automation flowing.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-hyper-blue/10">
                <Play size={20} className="text-hyper-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Media Swap Enabled</p>
                <p className="mt-1 text-xs text-text-secondary">Use the gallery panel to replace post media with any of your 207 exported assets, then save without leaving approvals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
