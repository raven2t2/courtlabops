"use client"

import { useState, useEffect } from "react"
import { BarChart3, Target, Users, Zap, TrendingUp, Clock } from "lucide-react"

export default function MarketingDashboard() {
  const [stats] = useState({
    leadsInProgress: 12,
    leadsSent: 5,
    contentReady: 8,
    campaignsActive: 3,
    responseRate: "32%",
    conversionRate: "18%",
  })

  const leads = [
    {
      id: "1",
      name: "California Elite Basketball",
      type: "Elite AAU",
      status: "drafted",
      painPoint: "Recruitment visibility",
    },
    {
      id: "2",
      name: "Sydney Kings Academy",
      type: "NBL1 Club",
      status: "drafted",
      painPoint: "Multi-tier player tracking",
    },
  ]

  const content = [
    {
      id: "1",
      platform: "twitter",
      title: "Most coaches rate their point guard 'really good...",
      priority: "high",
    },
    {
      id: "2",
      platform: "linkedin",
      title: "Why Objective Data Is Transforming Youth Basketball",
      priority: "high",
    },
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2 text-text-primary">Marketing Command Center</h1>
          <p className="text-text-secondary">Autonomous marketing execution dashboard</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
          <StatCard title="Leads In Progress" value={stats.leadsInProgress} icon={Users} color="blue" />
          <StatCard title="Leads Sent" value={stats.leadsSent} icon={Target} color="green" />
          <StatCard title="Content Ready" value={stats.contentReady} icon={Zap} color="purple" />
          <StatCard title="Active Campaigns" value={stats.campaignsActive} icon={TrendingUp} color="orange" />
          <StatCard title="Response Rate" value={stats.responseRate} icon={Clock} color="yellow" />
          <StatCard title="Conversion Rate" value={stats.conversionRate} icon={BarChart3} color="pink" />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Recent Qualified Leads</h2>
          <div className="bg-bg-secondary border border-border-primary rounded-xl divide-y divide-border-primary">
            {leads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-bg-tertiary transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{lead.name}</h3>
                    <p className="text-sm text-text-secondary mt-1">{lead.type}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                    {lead.status}
                  </span>
                </div>
                <p className="text-text-secondary text-sm">
                  <strong>Focus:</strong> {lead.painPoint}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Content Queue</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {content.map((item) => (
              <div key={item.id} className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary">
                    {item.platform.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400">
                    {item.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-text-primary font-medium mb-4 line-clamp-2">{item.title}</p>
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
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10",
    pink: "text-pink-500 bg-pink-500/10",
  }

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  )
}
