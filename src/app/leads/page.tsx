"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, ExternalLink, Search, Plus, Download, MapPin } from "lucide-react"

type Lead = {
  id: string
  clubName: string
  location: string
  state: string
  tier: string
  contactEmail: string
  website: string
  facebook?: string
  instagram?: string
  personalizationAnchor: string
  draftedIntro: string
  status: string
  lastContact: string | null
  nextAction: string
  priority: string
  notes: string
  tags: string[]
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState("")
  const [stateFilter, setStateFilter] = useState<"ALL" | "SA" | "VIC">("ALL")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await fetch('/api/leads')
        const data = await res.json()
        setLeads(Array.isArray(data.leads) ? data.leads : [])
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load leads:', err)
        setLeads([])
        setIsLoading(false)
      }
    }
    loadLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = filter === "" || 
      lead.clubName.toLowerCase().includes(filter.toLowerCase()) ||
      lead.location.toLowerCase().includes(filter.toLowerCase()) ||
      lead.personalizationAnchor.toLowerCase().includes(filter.toLowerCase())
    
    const matchesState = stateFilter === "ALL" || lead.state === stateFilter
    
    return matchesSearch && matchesState
  })

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Lead Pipeline</h1>
          <p className="text-text-secondary">SA clubs (priority) → VIC expansion. Click any lead for custom outreach.</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setStateFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                stateFilter === "ALL" 
                  ? "bg-hyper-blue text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              All ({leads.length})
            </button>
            <button
              onClick={() => setStateFilter("SA")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                stateFilter === "SA" 
                  ? "bg-accent-green text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              SA ({leads.filter(l => l.state === "SA").length})
            </button>
            <button
              onClick={() => setStateFilter("VIC")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                stateFilter === "VIC" 
                  ? "bg-velocity-orange text-white" 
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              VIC ({leads.filter(l => l.state === "VIC").length})
            </button>
          </div>

          <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-secondary px-3 py-2">
            <Search size={14} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-64"
            />
          </label>
        </div>

        {/* Leads Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-hyper-blue border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => router.push(`/leads/${lead.id}`)}
                className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-hyper-blue/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-base font-bold text-text-primary">{lead.clubName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    lead.priority === 'High' ? 'bg-accent-red/10 text-accent-red' :
                    lead.priority === 'Medium' ? 'bg-accent-amber/10 text-accent-amber' :
                    'bg-hyper-blue/10 text-hyper-blue'
                  }`}>
                    {lead.priority}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <MapPin size={12} />
                  {lead.location}, {lead.state}
                </div>

                <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                  {lead.personalizationAnchor}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {lead.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-bg-tertiary text-text-muted text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">{lead.tier}</span>
                  <span className="text-hyper-blue font-semibold">Click for outreach →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredLeads.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-4">No leads match your filters</p>
            <button
              onClick={() => { setFilter(""); setStateFilter("ALL"); }}
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
