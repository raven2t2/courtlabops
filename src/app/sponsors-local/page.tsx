"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe, Mail, Search, Filter } from "lucide-react"

type LocalSponsor = {
  id: string
  tier: string
  companyName: string
  industry: string
  website: string
  contactEmail: string
  contactPerson: string
  personalizationAnchor: string
  draftedIntro: string
  status: string
  priority: string
  tags: string[]
  nextAction: string
}

const TIER_COLORS: Record<string, string> = {
  'BRONZE': 'bg-amber-900/10 text-amber-900 border-amber-900/20',
  'SILVER': 'bg-slate-400/10 text-slate-600 border-slate-400/20',
  'GOLD': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  'PLATINUM': 'bg-purple-500/10 text-purple-700 border-purple-500/20'
}

export default function LocalSponsorsPage() {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<LocalSponsor[]>([])
  const [filter, setFilter] = useState("")
  const [tierFilter, setTierFilter] = useState<"ALL" | "BRONZE" | "SILVER" | "GOLD">("ALL")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sponsors-local')
      .then(res => res.json())
      .then(data => {
        setSponsors(data.sponsors || [])
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load sponsors:', err)
        setIsLoading(false)
      })
  }, [])

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = filter === "" || 
      sponsor.companyName.toLowerCase().includes(filter.toLowerCase()) ||
      sponsor.industry.toLowerCase().includes(filter.toLowerCase())
    
    const matchesTier = tierFilter === "ALL" || sponsor.tier === tierFilter
    
    return matchesSearch && matchesTier
  })

  const tierCounts = {
    BRONZE: sponsors.filter(s => s.tier === 'BRONZE').length,
    SILVER: sponsors.filter(s => s.tier === 'SILVER').length,
    GOLD: sponsors.filter(s => s.tier === 'GOLD').length
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Local Adelaide Sponsors</h1>
          <p className="text-text-secondary">Realistic tier structure for CourtLab Live Combines. Bronze → Silver → Gold (Platinum is dream tier).</p>
        </div>

        {/* Tier Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setTierFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tierFilter === "ALL" 
                ? "bg-hyper-blue text-white" 
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            All ({sponsors.length})
          </button>
          <button
            onClick={() => setTierFilter("BRONZE")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tierFilter === "BRONZE" 
                ? "bg-amber-900 text-white" 
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            Bronze ({tierCounts.BRONZE})
          </button>
          <button
            onClick={() => setTierFilter("SILVER")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tierFilter === "SILVER" 
                ? "bg-slate-400 text-white" 
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            Silver ({tierCounts.SILVER})
          </button>
          <button
            onClick={() => setTierFilter("GOLD")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tierFilter === "GOLD" 
                ? "bg-yellow-600 text-white" 
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
            }`}
          >
            Gold ({tierCounts.GOLD})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-secondary px-4 py-3 max-w-md">
            <Search size={16} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search sponsors..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>
        </div>

        {/* Sponsors Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-hyper-blue border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                onClick={() => router.push(`/sponsors-local/${sponsor.id}`)}
                className={`rounded-xl border ${TIER_COLORS[sponsor.tier]} p-4 hover:border-hyper-blue/50 transition-all cursor-pointer bg-bg-secondary`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{sponsor.companyName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${TIER_COLORS[sponsor.tier]}`}>
                    {sponsor.tier}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mb-2">{sponsor.industry}</p>

                <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                  {sponsor.personalizationAnchor}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {sponsor.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-bg-tertiary text-text-muted text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Globe size={12} className="text-text-muted" />
                    <Mail size={12} className="text-text-muted" />
                  </div>
                  <span className="text-hyper-blue text-xs font-semibold">Click for pitch →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSponsors.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-4">No sponsors match your filters</p>
            <button
              onClick={() => { setFilter(""); setTierFilter("ALL"); }}
              className="px-4 py-2 rounded-lg bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
