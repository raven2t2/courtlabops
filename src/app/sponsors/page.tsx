"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Globe, Mail, Search } from "lucide-react"

type Sponsor = {
  id: string
  companyName: string
  industry: string
  website: string
  contactEmail: string
  contactPerson: string
  currentPartnerships: string
  personalizationAnchor: string
  draftedIntro: string
  status: string
  priority: string
  tags: string[]
  nextAction: string
}

export default function SponsorsPage() {
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [filter, setFilter] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sponsors')
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
      sponsor.industry.toLowerCase().includes(filter.toLowerCase()) ||
      sponsor.personalizationAnchor.toLowerCase().includes(filter.toLowerCase())
    
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Sponsor Pipeline</h1>
          <p className="text-text-secondary">CourtLab combine sponsors. Easter Classic 2026 (Apr 3-6) is priority. Click any sponsor for custom outreach.</p>
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
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                onClick={() => router.push(`/sponsors/${sponsor.id}`)}
                className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-hyper-blue/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{sponsor.companyName}</h3>
                    <p className="text-sm text-text-secondary">{sponsor.industry}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    sponsor.priority === 'Critical' ? 'bg-accent-red/10 text-accent-red' :
                    sponsor.priority === 'High' ? 'bg-accent-amber/10 text-accent-amber' :
                    'bg-hyper-blue/10 text-hyper-blue'
                  }`}>
                    {sponsor.priority}
                  </span>
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                  {sponsor.personalizationAnchor}
                </p>

                <p className="text-xs text-text-muted mb-3">
                  <strong>Current:</strong> {sponsor.currentPartnerships}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {sponsor.tags.slice(0, 3).map(tag => (
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
            <p className="text-text-secondary mb-4">No sponsors match your search</p>
            <button
              onClick={() => setFilter("")}
              className="px-4 py-2 rounded-lg bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
