"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon, Video, Check, Plus, Calendar, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

type AssetCategory = "brand" | "combine" | "training" | "app" | "testimonial" | "bts" | "partner"

interface Asset {
  id: string
  type: "image" | "video"
  category: AssetCategory
  title: string
  prompt: string
  aspect?: string
  duration?: string
  createdAt: string
  useCase: string
  filename?: string
  url?: string
  githubUrl?: string
}

interface MediaViewerProps {
  asset: Asset | null
  isOpen: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onSelect: (asset: Asset) => void
  onSchedule: (asset: Asset) => void
  hasPrevious: boolean
  hasNext: boolean
}

export function MediaViewer({
  asset,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onSelect,
  onSchedule,
  hasPrevious,
  hasNext,
}: MediaViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedForPost, setSelectedForPost] = useState(false)

  // Reset state when asset changes
  useEffect(() => {
    setIsPlaying(false)
    setIsLoading(true)
    setSelectedForPost(false)
  }, [asset?.id])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && hasPrevious) onPrevious()
      if (e.key === "ArrowRight" && hasNext) onNext()
      if (e.key === " " && asset?.type === "video") {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, hasPrevious, hasNext, onClose, onPrevious, onNext, asset?.type, isPlaying])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !asset) return null

  const githubAssetUrl =
    asset.url ||
    asset.githubUrl ||
    `https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/${asset.filename || `${asset.id}.${asset.type === "video" ? "mp4" : "jpg"}`}?raw=true`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* Navigation */}
      {hasPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Main content */}
      <div className="flex h-full w-full max-w-7xl flex-col lg:flex-row">
        {/* Media display */}
        <div className="relative flex flex-1 items-center justify-center bg-black p-4">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}

          {asset.type === "image" ? (
            <img
              src={githubAssetUrl}
              alt={asset.title}
              className="max-h-full max-w-full object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          ) : (
            <div className="relative w-full max-w-2xl">
              <video
                src={githubAssetUrl}
                className="w-full rounded-lg"
                controls
                onLoadedData={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </div>
          )}

          {/* Type badge */}
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {asset.type === "video" ? <Video size={12} /> : <ImageIcon size={12} />}
              {asset.type === "video" ? "Video" : "Image"}
              {asset.aspect && ` · ${asset.aspect}`}
            </span>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
              Use ← → arrow keys to navigate
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full border-l border-white/10 bg-[#0F0F11] p-6 lg:w-96">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 rounded-full border border-accent-green/40 bg-accent-green-muted px-2 py-0.5 text-[11px] font-semibold text-accent-green">
              {asset.category}
            </span>
          </div>

          <h2 className="mb-2 text-xl font-bold text-white">{asset.title}</h2>
          <p className="mb-4 text-sm text-text-secondary">{asset.prompt}</p>

          <div className="mb-6 space-y-2 text-xs text-text-muted">
            <div className="flex justify-between">
              <span>Created</span>
              <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>
            {asset.duration && (
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{asset.duration}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ID</span>
              <span className="font-mono">{asset.id.slice(0, 8)}...</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setSelectedForPost(!selectedForPost)
                onSelect(asset)
              }}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                selectedForPost
                  ? "bg-accent-green text-white"
                  : "bg-hyper-blue text-white hover:bg-hyper-blue/90"
              )}
            >
              {selectedForPost ? (
                <>
                  <Check size={16} />
                  Selected for Post
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Use in Post
                </>
              )}
            </button>

            <button
              onClick={() => onSchedule(asset)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-sm font-semibold text-text-primary hover:bg-bg-tertiary"
            >
              <Calendar size={16} />
              Schedule for Later
            </button>

            <a
              href={githubAssetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-bg-tertiary"
            >
              <Twitter size={16} />
              View Raw File
            </a>
          </div>

          {/* Tips */}
          <div className="mt-6 rounded-lg border border-border-subtle bg-bg-primary p-3">
            <p className="text-xs text-text-secondary">
              <span className="font-semibold text-velocity-orange">Tip:</span> Press{" "}
              <kbd className="rounded bg-bg-tertiary px-1 py-0.5 font-mono">Space</kbd> to play/pause videos,{" "}
              <kbd className="rounded bg-bg-tertiary px-1 py-0.5 font-mono">←</kbd>
              <kbd className="rounded bg-bg-tertiary px-1 py-0.5 font-mono">→</kbd> to navigate.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
