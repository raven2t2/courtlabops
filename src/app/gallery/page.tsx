"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  FileText,
  Filter,
  Image as ImageIcon,
  PenTool,
  Play,
  Search,
  Twitter,
  User,
  Users,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"

type BadgeTone = "critical" | "high" | "medium" | "warm" | "contacted" | "new" | "live" | "neutral"
type AssetType = "image" | "video"
type AssetCategory = "brand" | "combine" | "training" | "app" | "testimonial" | "bts" | "partner"

// Placeholder data structure - will be populated from manifest.json
const ASSETS: {
  id: string
  type: AssetType
  category: AssetCategory
  title: string
  prompt: string
  aspect?: string
  duration?: string
  createdAt: string
  useCase: string
}[] = [
  {
    id: "bFA7kaudBWW8x5ch03Qi",
    type: "image",
    category: "brand",
    title: "Youth Elite Lookbook - Total Orange",
    prompt: "Photorealistic studio portrait of two young basketball players in CourtLab uniforms with Nike Kobe 6 Protro Total Orange shoes...",
    aspect: "9/16",
    createdAt: "2026-01-26T14:00:00.350Z",
    useCase: "social-media",
  },
  // Will be populated from manifest.json (207 total items)
]

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  brand: "Brand Assets",
  combine: "Combine Events",
  training: "Training/Drills",
  app: "App Screenshots",
  testimonial: "Testimonials",
  bts: "Behind the Scenes",
  partner: "Partnerships",
}

const CATEGORY_TONES: Record<AssetCategory, BadgeTone> = {
  brand: "new",
  combine: "warm",
  training: "medium",
  app: "high",
  testimonial: "contacted",
  bts: "neutral",
  partner: "live",
}

const STATS = [
  { label: "Total Assets", value: 207, sub: "105 images + 102 videos", icon: ImageIcon, tone: "text-accent-green" },
  { label: "Images", value: 105, sub: "Ready for posts", icon: ImageIcon, tone: "text-hyper-blue" },
  { label: "Videos", value: 102, sub: "Ready for posts", icon: Video, tone: "text-velocity-orange" },
  { label: "Scheduled", value: 0, sub: "Waiting for approval", icon: Clock, tone: "text-text-muted" },
]

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        tone === "critical" && "border-accent-red/40 bg-accent-red-muted text-accent-red",
        tone === "high" && "border-accent-amber/40 bg-accent-amber-muted text-accent-amber",
        tone === "medium" && "border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue",
        tone === "warm" && "border-velocity-orange/40 bg-velocity-orange-muted text-velocity-orange",
        tone === "contacted" && "border-accent-violet/40 bg-accent-violet-muted text-accent-violet",
        tone === "new" && "border-accent-green/40 bg-accent-green-muted text-accent-green",
        tone === "live" && "border-accent-green/40 bg-accent-green-muted text-accent-green",
        tone === "neutral" && "border-border-default bg-bg-tertiary text-text-secondary"
      )}
    >
      {tone === "live" ? <span className="h-1.5 w-1.5 rounded-full bg-accent-green" /> : null}
      {children}
    </span>
  )
}

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all")
  const [selectedType, setSelectedType] = useState<AssetType | "all">("all")

  const filteredAssets = ASSETS.filter((asset) => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    const matchesType = selectedType === "all" || asset.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        {/* Header */}
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content Library</p>
                <Badge tone="live">207 Assets</Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Gallery & Asset Management</h1>
              <p className="mt-1 text-sm text-text-secondary">AI-generated brand assets, combine footage, and marketing content</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-hyper-blue px-3 py-2 text-sm font-semibold text-white">
                <Play size={14} /> Schedule All
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{item.label}</p>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-bg-tertiary", item.tone)}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-text-primary">{item.value}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                    <span>{item.sub}</span>
                  </div>
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
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedCategory === "all"
                    ? "bg-hyper-blue text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                All
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as AssetCategory)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    selectedCategory === key
                      ? "bg-hyper-blue text-white"
                      : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-border-default" />

            {/* Type Filter */}
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedType("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedType === "all"
                    ? "bg-accent-green text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                All Types
              </button>
              <button
                onClick={() => setSelectedType("image")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedType === "image"
                    ? "bg-accent-green text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                <ImageIcon size={12} className="inline mr-1" />
                Images
              </button>
              <button
                onClick={() => setSelectedType("video")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedType === "video"
                    ? "bg-accent-green text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                )}
              >
                <Video size={12} className="inline mr-1" />
                Videos
              </button>
            </div>
          </div>
        </Surface>

        {/* Gallery Grid */}
        <Surface className="min-h-[400px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-text-primary">Asset Gallery</h2>
              <p className="text-xs text-text-muted">
                {filteredAssets.length === 0 
                  ? "207 assets available — pull from repo to view"
                  : `Showing ${filteredAssets.length} assets`
                }
              </p>
            </div>
            <Badge tone="neutral">
              {selectedCategory !== "all" ? CATEGORY_LABELS[selectedCategory] : "All Categories"}
            </Badge>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-primary py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary">
                <ImageIcon size={32} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Assets Loading</h3>
              <p className="mt-1 max-w-md text-center text-sm text-text-secondary">
                207 assets (105 images, 102 videos) are in the repository at{" "}
                <code className="rounded bg-bg-tertiary px-1 py-0.5 text-xs">shared/gallery/</code>
                <br />
                Run git pull to load the full manifest and preview all assets.
              </p>
              <div className="mt-4 flex gap-2">
                <Link 
                  href="https://github.com/raven2t2/courtlabops/tree/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-bg-tertiary"
                >
                  <FileText size={14} />
                  View on GitHub
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group overflow-hidden rounded-xl border border-border-subtle bg-bg-primary transition-all hover:border-hyper-blue/50"
                >
                  {/* Thumbnail Placeholder */}
                  <div className="relative aspect-video bg-bg-tertiary">
                    {asset.type === "video" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hyper-blue/20">
                          <Play size={20} className="text-hyper-blue" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon size={32} className="text-text-muted" />
                      </div>
                    )}
                    <div className="absolute left-2 top-2">
                      <Badge tone={CATEGORY_TONES[asset.category]}>
                        {CATEGORY_LABELS[asset.category]}
                      </Badge>
                    </div>
                    <div className="absolute right-2 top-2">
                      <Badge tone="neutral">
                        {asset.type === "video" ? <Video size={10} className="mr-1" /> : <ImageIcon size={10} className="mr-1" />}
                        {asset.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="truncate text-sm font-semibold text-text-primary">{asset.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{asset.prompt.slice(0, 100)}...</p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-text-muted">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <button className="rounded-lg p-1.5 text-text-muted hover:bg-bg-tertiary hover:text-text-primary">
                          <Twitter size={14} />
                        </button>
                        <button className="rounded-lg p-1.5 text-text-muted hover:bg-bg-tertiary hover:text-text-primary">
                          <PenTool size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Surface>

        {/* Asset Categories Overview */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { category: "brand" as AssetCategory, count: 30, desc: "Brand assets, logos, campaign imagery", icon: ImageIcon },
            { category: "combine" as AssetCategory, count: 45, desc: "Combine event footage and photos", icon: Video },
            { category: "training" as AssetCategory, count: 50, desc: "Drills, workouts, skill development", icon: Play },
            { category: "testimonial" as AssetCategory, count: 25, desc: "User stories and success stories", icon: Users },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Surface key={item.category} className="transition-all hover:bg-bg-tertiary/40">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-primary">
                    <Icon size={18} className="text-hyper-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-text-primary">{CATEGORY_LABELS[item.category]}</p>
                      <Badge tone={CATEGORY_TONES[item.category]}>{item.count}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              </Surface>
            )
          })}
        </div>
      </div>
    </div>
  )
}
