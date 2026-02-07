"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Check,
  Clock,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  Play,
  Plus,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MediaViewer } from "@/components/MediaViewer"

type BadgeTone = "critical" | "high" | "medium" | "warm" | "contacted" | "new" | "live" | "neutral"
type AssetType = "image" | "video"
type AssetCategory = "brand" | "combine" | "training" | "app" | "testimonial" | "bts" | "partner"

interface Asset {
  id: string
  type: AssetType
  category: AssetCategory
  title: string
  prompt: string
  aspect?: string
  duration?: string
  createdAt: string
  useCase: string
  filename?: string
  githubUrl?: string
}

const CATEGORY_LABELS: Record<AssetCategory | "all", string> = {
  all: "All Categories",
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
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0)
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [assets, setAssets] = useState<Asset[]>([])
  const [totalAssets, setTotalAssets] = useState(207)
  const [isLoading, setIsLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  // Fetch assets from API
  useEffect(() => {
    loadAssets()
  }, [selectedCategory, selectedType])

  const loadAssets = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedType !== 'all') params.append('type', selectedType)
      
      const res = await fetch(`/api/gallery?${params}`)
      const data = await res.json()
      
      if (data.assets) {
        setAssets(data.assets)
        setTotalAssets(data.total)
        setCategoryCounts(data.categories || {})
      }
    } catch (err) {
      console.error('Failed to load assets:', err)
    }
    setIsLoading(false)
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const currentAsset = filteredAssets[currentAssetIndex]

  const openViewer = (index: number) => {
    setCurrentAssetIndex(index)
    setViewerOpen(true)
  }

  const handlePrevious = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex(currentAssetIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentAssetIndex < filteredAssets.length - 1) {
      setCurrentAssetIndex(currentAssetIndex + 1)
    }
  }

  const handleSelect = (asset: Asset) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(asset.id)) {
        newSet.delete(asset.id)
      } else {
        newSet.add(asset.id)
      }
      return newSet
    })
  }

  const handleSchedule = (asset: Asset) => {
    handleSelect(asset)
    alert(`Asset "${asset.title}" added to content queue!`)
  }

  const clearSelection = () => {
    setSelectedAssets(new Set())
  }

  const selectedCount = selectedAssets.size
  
  const imageCount = assets.filter(a => a.type === 'image').length
  const videoCount = assets.filter(a => a.type === 'video').length

  const stats = [
    { label: "Total Assets", value: totalAssets, sub: "105 images + 102 videos", icon: ImageIcon, tone: "text-accent-green" },
    { label: "Images", value: imageCount || 105, sub: "Ready for posts", icon: ImageIcon, tone: "text-hyper-blue" },
    { label: "Videos", value: videoCount || 102, sub: "Ready for posts", icon: Video, tone: "text-velocity-orange" },
    { label: "Selected", value: selectedCount, sub: "For upcoming posts", icon: Check, tone: "text-accent-green" },
  ]

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        {/* Header */}
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Content Library</p>
                <Badge tone="live">{totalAssets} Assets</Badge>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Gallery & Asset Management</h1>
              <p className="mt-1 text-sm text-text-secondary">Click any asset to preview, then select for posts</p>
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
              {selectedCount > 0 && (
                <button 
                  onClick={clearSelection}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent-red/40 bg-accent-red-muted px-3 py-2 text-sm font-semibold text-accent-red"
                >
                  <Trash2 size={14} />
                  Clear ({selectedCount})
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
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

        {/* Selected Assets Bar */}
        {selectedCount > 0 && (
          <Surface className="mb-4 border-accent-green/40 bg-accent-green-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green">
                  <Check size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{selectedCount} assets selected</p>
                  <p className="text-xs text-text-secondary">Ready to use in upcoming posts</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/content"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-green px-4 py-2 text-sm font-semibold text-white hover:bg-accent-green/90"
                >
                  <CalendarDays size={14} />
                  Schedule Posts
                </Link>
              </div>
            </div>
          </Surface>
        )}

        {/* Filters */}
        <Surface className="mb-4 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-text-muted" />
              <span className="text-xs font-semibold text-text-muted">Filter:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as AssetCategory | "all")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    selectedCategory === key
                      ? "bg-hyper-blue text-white"
                      : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                  )}
                >
                  {label}
                  {key !== 'all' && categoryCounts[key] && (
                    <span className="ml-1 opacity-70">({categoryCounts[key]})</span>
                  )}
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
                {isLoading 
                  ? "Loading assets..."
                  : filteredAssets.length === 0 
                    ? "No assets match your filters"
                    : `Showing ${filteredAssets.length} of ${totalAssets} assets · Click to preview`
                }
              </p>
            </div>
            <Badge tone="neutral">
              {selectedCategory !== "all" ? CATEGORY_LABELS[selectedCategory] : "All Categories"}
            </Badge>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-hyper-blue border-t-transparent" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-primary py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary">
                <ImageIcon size={32} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">No Assets Found</h3>
              <p className="mt-1 max-w-md text-center text-sm text-text-secondary">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map((asset, index) => {
                const isSelected = selectedAssets.has(asset.id)
                const githubAssetUrl = asset.githubUrl || `https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/${asset.filename || asset.id}.${asset.type === "video" ? "mp4" : "jpg"}?raw=true`
                
                return (
                  <div
                    key={asset.id}
                    onClick={() => openViewer(index)}
                    className={cn(
                      "group cursor-pointer overflow-hidden rounded-xl border bg-bg-primary transition-all hover:border-hyper-blue/50",
                      isSelected ? "border-accent-green shadow-lg shadow-accent-green/10" : "border-border-subtle"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-bg-tertiary overflow-hidden">
                      {/* Try to load actual image */}
                      <img
                        src={githubAssetUrl}
                        alt={asset.title}
                        className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      
                      {/* Play button for videos */}
                      {asset.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hyper-blue/80 backdrop-blur">
                            <Play size={20} className="text-white" />
                          </div>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                          <Eye size={24} className="text-white" />
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="absolute left-2 top-2">
                        <Badge tone={CATEGORY_TONES[asset.category]}>
                          {CATEGORY_LABELS[asset.category]}
                        </Badge>
                      </div>

                      {/* Type badge */}
                      <div className="absolute right-2 top-2">
                        <Badge tone="neutral">
                          {asset.type === "video" ? <Video size={10} className="mr-1" /> : <ImageIcon size={10} className="mr-1" />}
                          {asset.type}
                        </Badge>
                      </div>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute right-2 bottom-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-green">
                            <Check size={14} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="truncate text-sm font-semibold text-text-primary">{asset.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{asset.prompt.slice(0, 80)}...</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-text-muted">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelect(asset)
                          }}
                          className={cn(
                            "rounded-lg px-2 py-1 text-xs font-medium transition-all",
                            isSelected
                              ? "bg-accent-green text-white"
                              : "bg-bg-tertiary text-text-secondary hover:bg-hyper-blue hover:text-white"
                          )}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Surface>
      </div>

      {/* Media Viewer Modal */}
      <MediaViewer
        asset={currentAsset}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelect={handleSelect}
        onSchedule={handleSchedule}
        hasPrevious={currentAssetIndex > 0}
        hasNext={currentAssetIndex < filteredAssets.length - 1}
      />
    </div>
  )
}
