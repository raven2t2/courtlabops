"use client"

import { useEffect, useState } from "react"
import { BarChart3, Target, Users, Zap, TrendingUp, Clock } from "lucide-react"

interface MarketingStats {
  leadsInProgress: number
  leadsSent: number
  contentReady: number
  campaignsActive: number
  conversionRate: string
  responseRate: string
}

interface Lead {
  id: string
  name: string
  type: string
  status: "drafted" | "sent" | "replied" | "meeting" | "closed-won" | "closed-lost"
  painPoint: string
  approach: string
}

interface ContentItem {
  id: string
  platform: string
  pillar: string
  type: string
  content: string
  status: "todo" | "approved" | "scheduled" | "posted"
  priority: "high" | "medium" | "low"
}

export default function MarketingDashboard() {
  const [stats, setStats] = useState<MarketingStats | null>(null)
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [recentContent, setRecentContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // In production, this would fetch from your API
      // For now, using mock data based on your Kanban structure
      const mockStats: MarketingStats = {
        leadsInProgress: 12,
        leadsSent: 5,
        contentReady: 8,
        campaignsActive: 3,
        conversionRate: "18%",
        responseRate: "32%",
      }

      const mockLeads: Lead[] = [
        {
          id: "LEAD-AAU-001",
          name: "California Elite Basketball",
          type: "elite_aau",
          status: "drafted",
          painPoint: "Recruitment visibility for college-bound seniors",
          approach: "Free trial for recruitment season",
        },
        {
          id: "LEAD-NBL-001",
          name: "Sydney Kings Academy",
          type: "nbl1_clubs",
          status: "drafted",
          painPoint: "Unified player tracking across 3 tiers",
          approach: "Local case study + partnership angle",
        },
      ]

      const mockContent: ContentItem[] = [
        {
          id: "SOCIAL-001",
          platform: "twitter",
          pillar: "the_truth",
          type: "stat",
          content: "Most coaches rate their point guard 'really good.' Data says 4th best...",
          status: "todo",
          priority: "high",
        },
        {
          id: "SOCIAL-004",
          platform: "linkedin",
          pillar: "thought_leadership",
          type: "article",
          content: "Why Objective Data Is Transforming Youth Basketball",
          status: "todo",
          priority: "high",
        },
      ]

      setStats(mockStats)
      setRecentLeads(mockLeads)
      setRecentContent(mockContent)
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2 text-text-primary">Marketing Command Center</h1>
          <p className="text-text-secondary">Autonomous marketing execution dashboard</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
          <StatCard
            title="Leads In Progress"
            value={stats?.leadsInProgress || 0}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Leads Sent"
            value={stats?.leadsSent || 0}
            icon={<Target className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Content Ready"
            value={stats?.contentReady || 0}
            icon={<Zap className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="Active Campaigns"
            value={stats?.campaignsActive || 0}
            icon={<TrendingUp className="w-5 h-5" />}
            color="orange"
          />
          <StatCard
            title="Response Rate"
            value={stats?.responseRate || "-"}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            title="Conversion Rate"
            value={stats?.conversionRate || "-"}
            icon={<BarChart3 className="w-5 h-5" />}
            color="pink"
          />
        </div>

        {/* Recent Leads */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Recent Qualified Leads</h2>
          <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
            {recentLeads.length > 0 ? (
              <div className="divide-y divide-border-primary">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-6 hover:bg-bg-tertiary transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{lead.name}</h3>
                        <p className="text-sm text-text-secondary capitalize mt-1">{lead.type.replace("_", " ")}</p>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-2">
                      <strong>Pain Point:</strong> {lead.painPoint}
                    </p>
                    <p className="text-text-secondary text-sm">
                      <strong>Approach:</strong> {lead.approach}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-text-secondary">No leads generated yet</div>
            )}
          </div>
        </div>

        {/* Content Queue */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Content Ready for Approval</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentContent.map((item) => (
              <div key={item.id} className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary">
                      {item.platform.toUpperCase()}
                    </span>
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-500/20 text-purple-400">
                      {item.pillar}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-text-primary font-medium mb-3 line-clamp-3">{item.content}</p>
                <button className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition">
                  Approve & Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: "blue" | "green" | "purple" | "orange" | "yellow" | "pink"
}) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10",
    pink: "text-pink-500 bg-pink-500/10",
  }

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>{icon}</div>
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  )
}
