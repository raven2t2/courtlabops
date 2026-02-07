"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Check,
  Clock,
  Edit3,
  Eye,
  Filter,
  Instagram,
  MessageSquare,
  Play,
  Search,
  ThumbsUp,
  Trash2,
  Twitter,
  X,
  Calendar,
  Image as ImageIcon,
  Send,
  Loader2,
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
  approvedAt?: string
  approvedBy?: string
  notes?: string
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

export default function ApprovalsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all")
  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editedCaption, setEditedCaption] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Load posts on mount
  useEffect(() => {
    loadPosts()
  }, [filterPlatform, filterStatus])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterPlatform !== "all") params.append("platform", filterPlatform)
      if (filterStatus !== "all") params.append("status", filterStatus)
      
      const res = await fetch(`/api/posts?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to load posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const stats = {
    total: posts.length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "approved").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
    posted: posts.filter((p) => p.status === "posted").length,
  }

  const handleApprove = async (postId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, action: 'approve' }),
      })
      if (res.ok) {
        await loadPosts()
        if (selectedPost?.id === postId) {
          setSelectedPost({ ...selectedPost, status: "approved" })
        }
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (postId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, action: 'reject' }),
      })
      if (res.ok) {
        await loadPosts()
        setSelectedPost(null)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditSave = async (postId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, action: 'edit', caption: editedCaption }),
      })
      if (res.ok) {
        setEditMode(false)
        await loadPosts()
        if (selectedPost) {
          setSelectedPost({ ...selectedPost, caption: editedCaption })
        }
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleSchedule = async (postId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, action: 'schedule' }),
      })
      if (res.ok) {
        await loadPosts()
        if (selectedPost?.id === postId) {
          setSelectedPost({ ...selectedPost, status: "scheduled" })
        }
      }
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-AU", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        {/* Header */}
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content Approval Queue</p>
                {stats.pending > 0 && (
                  <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                    {stats.pending} Pending
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Review & Approve Posts</h1>
              <p className="mt-1 text-sm text-text-secondary">Approve, edit, or reject scheduled content across all platforms</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </label>
              <button 
                onClick={loadPosts}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white"
              >
                <Loader2 size={14} className={cn(loading && "animate-spin")} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total", value: stats.total, icon: MessageSquare, tone: "text-text-primary" },
              { label: "Pending", value: stats.pending, icon: Clock, tone: "text-accent-amber" },
              { label: "Approved", value: stats.approved, icon: Check, tone: "text-accent-green" },
              { label: "Rejected", value: stats.rejected, icon: X, tone: "text-accent-red" },
              { label: "Posted", value: stats.posted, icon: Send, tone: "text-hyper-blue" },
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
        </Surface>

        {/* Filters */}
        <Surface className="mb-4 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-text-muted" />
              <span className="text-xs font-semibold text-text-muted">Filter:</span>
            </div>

            {/* Platform Filter */}
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
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => setFilterPlatform(key as Platform)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                      filterPlatform === key ? config.bg : "bg-bg-tertiary hover:bg-bg-primary",
                      filterPlatform === key ? config.color : "text-text-secondary"
                    )}
                  >
                    <Icon size={12} />
                    {config.label}
                  </button>
                )
              })}
            </div>

            <div className="h-4 w-px bg-border-default" />

            {/* Status Filter */}
            <div className="flex gap-1">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key as PostStatus | "all")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    filterStatus === key
                      ? config.tone
                      : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                  )}
                >
                  {config.label}
                </button>
              ))}
              <button
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  filterStatus === "all" ? "border-border-default bg-bg-tertiary text-text-primary" : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                All
              </button>
            </div>
          </div>
        </Surface>

        {/* Posts List */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left: Posts List */}
          <Surface className="max-h-[600px] overflow-auto">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Posts Queue</h2>
              <span className="text-xs text-text-muted">{filteredPosts.length} posts</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-text-muted" />
              </div>
            ) : (
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
                      <div
                        key={post.id}
                        onClick={() => {
                          setSelectedPost(post)
                          setEditMode(false)
                          setEditedCaption(post.caption)
                        }}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 transition-all",
                          selectedPost?.id === post.id
                            ? "border-hyper-blue bg-hyper-blue/5"
                            : "border-border-subtle bg-bg-primary hover:border-border-default"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", platform.bg)}>
                            <PlatformIcon size={18} className={platform.color} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs font-semibold", platform.color)}>{platform.label}</span>
                              <span className="text-text-muted">·</span>
                              <span className="text-xs text-text-muted">{TYPE_LABELS[post.type]}</span>
                              <Badge className={status.tone}>
                                <StatusIcon size={10} className="mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-text-primary">{post.caption}</p>
                            <p className="mt-1 text-xs text-text-muted">{formatTime(post.scheduledTime)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </Surface>

          {/* Right: Post Detail / Editor */}
          <Surface className="max-h-[600px] overflow-auto">
            {selectedPost ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", PLATFORM_CONFIG[selectedPost.platform].bg)}>
                      {(() => {
                        const Icon = PLATFORM_CONFIG[selectedPost.platform].icon
                        return <Icon size={16} className={PLATFORM_CONFIG[selectedPost.platform].color} />
                      })()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{PLATFORM_CONFIG[selectedPost.platform].label}</p>
                      <p className="text-xs text-text-muted">{TYPE_LABELS[selectedPost.type]} · {formatTime(selectedPost.scheduledTime)}</p>
                    </div>
                  </div>
                  <Badge className={STATUS_CONFIG[selectedPost.status].tone}>
                    {(() => {
                      const Icon = STATUS_CONFIG[selectedPost.status].icon
                      return <Icon size={10} className="mr-1" />
                    })()}
                    {STATUS_CONFIG[selectedPost.status].label}
                  </Badge>
                </div>

                {/* Media Preview */}
                {selectedPost.mediaUrls && selectedPost.mediaUrls.length > 0 && (
                  <div className="mb-4 rounded-xl border border-border-subtle bg-bg-tertiary p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Media</p>
                    <div className="flex gap-2">
                      {selectedPost.mediaUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square w-24 rounded-lg bg-bg-primary">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {selectedPost.type === "reel" || url.endsWith(".mp4") ? (
                              <Play size={20} className="text-hyper-blue" />
                            ) : (
                              <ImageIcon size={20} className="text-text-muted" />
                            )}
                          </div>
                          <div className="absolute bottom-1 right-1">
                            <Badge className="border-border-default bg-bg-secondary text-text-secondary">{url.split(".").pop()}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Caption</p>
                    {!editMode && selectedPost.status === "pending" && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-hyper-blue hover:bg-hyper-blue/10"
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedCaption}
                        onChange={(e) => setEditedCaption(e.target.value)}
                        className="min-h-[150px] w-full rounded-xl border border-border-default bg-bg-primary p-3 text-sm text-text-primary outline-none focus:border-hyper-blue"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditMode(false)
                            setEditedCaption(selectedPost.caption)
                          }}
                          disabled={actionLoading}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-tertiary"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSave(selectedPost.id)}
                          disabled={actionLoading}
                          className="rounded-lg bg-hyper-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-hyper-blue/90"
                        >
                          {actionLoading ? <Loader2 size={12} className="animate-spin" /> : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                      <p className="whitespace-pre-wrap text-sm text-text-primary">{selectedPost.caption}</p>
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Hashtags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPost.hashtags.map((tag, idx) => (
                        <span key={idx} className="rounded-lg bg-bg-tertiary px-2 py-1 text-xs text-text-secondary">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedPost.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedPost.id)}
                      disabled={actionLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-green py-3 text-sm font-semibold text-white hover:bg-accent-green/90 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Approve
                    </button>
                    <button
                      onClick={() => setEditMode(true)}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-sm font-semibold text-text-primary hover:bg-bg-tertiary disabled:opacity-50"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleReject(selectedPost.id)}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-accent-red/40 bg-accent-red-muted px-4 py-3 text-sm font-semibold text-accent-red hover:bg-accent-red/20 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Reject
                    </button>
                  </div>
                )}

                {selectedPost.status === "approved" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSchedule(selectedPost.id)}
                      disabled={actionLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-violet py-3 text-sm font-semibold text-white hover:bg-accent-violet/90 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
                      Schedule for {formatTime(selectedPost.scheduledTime).split(",")[1]?.trim()}
                    </button>
                    <button
                      onClick={() => handleReject(selectedPost.id)}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-bg-tertiary disabled:opacity-50"
                    >
                      <X size={16} />
                      Unapprove
                    </button>
                  </div>
                )}

                {selectedPost.notes && (
                  <div className="mt-4 rounded-lg border border-border-subtle bg-bg-tertiary p-3">
                    <p className="text-xs text-text-muted">Notes: {selectedPost.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12">
                <Eye size={48} className="mb-4 text-text-muted" />
                <p className="text-sm font-medium text-text-secondary">Select a post to review</p>
                <p className="text-xs text-text-muted">Click any post from the queue to see details</p>
              </div>
            )}
          </Surface>
        </div>

        {/* Help Text */}
        <div className="mt-4 rounded-xl border border-border-subtle bg-bg-secondary/50 p-4">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-velocity-orange">How it works:</span> Posts queue here for your review. Click any post to see details, edit the caption, or approve/reject. 
            Approved posts get scheduled automatically. Rejected posts are removed from the queue. You can edit any pending post before approving.
          </p>
        </div>
      </div>
    </div>
  )
}
