"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Link2, Mail, Copy, Check, Filter, Search } from "lucide-react"

type Affiliate = {
  id: string
  type: string
  name: string
  email?: string
  commission: string
  affiliateLink: string
  status: string
  priority: string
  platform?: string
  followers?: string
  category?: string
  organization?: string
  outreachTemplate: string
}

const COMMISSION_COLORS: Record<string, string> = {
  '15%': 'bg-amber-500/10 text-amber-700',
  '20%': 'bg-blue-500/10 text-blue-700',
  '25%': 'bg-purple-500/10 text-purple-700',
  '30%': 'bg-green-500/10 text-green-700'
}

export default function AffiliatesPage() {
  const router = useRouter()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<"ALL" | "COACHES" | "INFLUENCERS" | "MEDIA" | "FACILITIES" | "VENDORS" | "ORGS">("ALL")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/affiliates-complete')
      .then(res => res.json())
      .then(data => {
        // Flatten affiliate data
        const flattened: Affiliate[] = []
        
        if (data.affiliates) {
          data.affiliates.COACHES?.forEach((aff: any) => flattened.push({ ...aff, type: 'COACH' }))
          data.affiliates.INFLUENCERS?.forEach((aff: any) => flattened.push({ ...aff, type: 'INFLUENCER' }))
          data.affiliates.MEDIA?.forEach((aff: any) => flattened.push({ ...aff, type: 'MEDIA' }))
          data.affiliates.FACILITIES?.forEach((aff: any) => flattened.push({ ...aff, type: 'FACILITY' }))
          data.affiliates.VENDORS?.forEach((aff: any) => flattened.push({ ...aff, type: 'VENDOR' }))
          data.affiliates.BASKETBALL_ORGS?.forEach((aff: any) => flattened.push({ ...aff, type: 'ORG' }))
        }
        
        setAffiliates(flattened)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load affiliates:', err)
        setIsLoading(false)
      })
  }, [])

  const filteredAffiliates = affiliates.filter(aff => {
    const matchesSearch = filter === "" || 
      aff.name.toLowerCase().includes(filter.toLowerCase()) ||
      (aff.category && aff.category.toLowerCase().includes(filter.toLowerCase()))
    
    const matchesType = typeFilter === "ALL" || 
      (typeFilter === "COACHES" && aff.type === "COACH") ||
      (typeFilter === "INFLUENCERS" && aff.type === "INFLUENCER") ||
      (typeFilter === "MEDIA" && aff.type === "MEDIA") ||
      (typeFilter === "FACILITIES" && aff.type === "FACILITY") ||
      (typeFilter === "VENDORS" && aff.type === "VENDOR") ||
      (typeFilter === "ORGS" && aff.type === "ORG")
    
    return matchesSearch && matchesType
  })

  const typeCounts = {
    COACHES: affiliates.filter(a => a.type === 'COACH').length,
    INFLUENCERS: affiliates.filter(a => a.type === 'INFLUENCER').length,
    MEDIA: affiliates.filter(a => a.type === 'MEDIA').length,
    FACILITIES: affiliates.filter(a => a.type === 'FACILITY').length,
    VENDORS: affiliates.filter(a => a.type === 'VENDOR').length,
    ORGS: affiliates.filter(a => a.type === 'ORG').length
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Affiliate Program</h1>
          <p className="text-text-secondary">20-30% commission on converted users. Coaches → Influencers → Media → Facilities → Vendors → Organizations.</p>
        </div>

        {/* Commission Info */}
        <div className="mb-6 rounded-xl border border-border-default bg-bg-secondary p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">Commission Structure</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <div className="text-xs font-bold text-text-muted mb-1">Coaches</div>
              <div className="text-lg font-bold text-text-primary">20%</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-text-muted mb-1">Influencers</div>
              <div className="text-lg font-bold text-text-primary">25%</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-text-muted mb-1">Media</div>
              <div className="text-lg font-bold text-text-primary">20%</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-text-muted mb-1">Facilities</div>
              <div className="text-lg font-bold text-text-primary">15%</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-text-muted mb-1">Vendors</div>
              <div className="text-lg font-bold text-text-primary">20%</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-text-muted mb-1">Organizations</div>
              <div className="text-lg font-bold text-text-primary">25-30%</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                typeFilter === "ALL" 
                  ? "bg-hyper-blue text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              All ({affiliates.length})
            </button>
            <button
              onClick={() => setTypeFilter("COACHES")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                typeFilter === "COACHES" 
                  ? "bg-blue-600 text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              Coaches ({typeCounts.COACHES})
            </button>
            <button
              onClick={() => setTypeFilter("INFLUENCERS")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                typeFilter === "INFLUENCERS" 
                  ? "bg-purple-600 text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              Influencers ({typeCounts.INFLUENCERS})
            </button>
            <button
              onClick={() => setTypeFilter("MEDIA")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                typeFilter === "MEDIA" 
                  ? "bg-orange-600 text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              Media ({typeCounts.MEDIA})
            </button>
            <button
              onClick={() => setTypeFilter("VENDORS")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                typeFilter === "VENDORS" 
                  ? "bg-pink-600 text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              Vendors ({typeCounts.VENDORS})
            </button>
            <button
              onClick={() => setTypeFilter("ORGS")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                typeFilter === "ORGS" 
                  ? "bg-green-600 text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              Orgs ({typeCounts.ORGS})
            </button>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-secondary px-4 py-3 max-w-sm">
            <Search size={14} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search affiliates..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>
        </div>

        {/* Affiliates Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-hyper-blue border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAffiliates.map((affiliate) => (
              <div
                key={affiliate.id}
                onClick={() => router.push(`/affiliates/${affiliate.id}`)}
                className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-hyper-blue/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{affiliate.name}</h3>
                    <p className="text-xs text-text-muted capitalize">{affiliate.type.toLowerCase()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${COMMISSION_COLORS[affiliate.commission]}`}>
                    {affiliate.commission} commission
                  </span>
                </div>

                {affiliate.category && (
                  <p className="text-sm text-text-secondary mb-2">{affiliate.category}</p>
                )}

                {affiliate.followers && (
                  <p className="text-xs text-text-muted mb-2">{affiliate.followers} followers</p>
                )}

                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <span className={`px-2 py-0.5 rounded ${
                    affiliate.status === 'Active' ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'
                  }`}>
                    {affiliate.status}
                  </span>
                  <span className="text-text-muted capitalize">{affiliate.priority} priority</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Link2 size={12} className="text-text-muted" />
                    <Mail size={12} className="text-text-muted" />
                  </div>
                  <span className="text-hyper-blue text-xs font-semibold">Click for details →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAffiliates.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-4">No affiliates match your filters</p>
            <button
              onClick={() => { setFilter(""); setTypeFilter("ALL"); }}
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
