"use client"

import { useState } from "react"
import { LogOut, DollarSign, Users, TrendingUp, Eye } from "lucide-react"

const MOCK_AFFILIATES: Record<string, any> = {
  "aff-coachpro-001": {
    id: "aff-coachpro-001",
    name: "CoachPro Network",
    email: "partnerships@coachpro.com",
    referralsSent: 42,
    conversions: 8,
    commissionRate: 20,
    earnings: 2400,
  },
  "aff-basketball-001": {
    id: "aff-basketball-001",
    name: "BasketballInsiders",
    email: "affiliates@basketballinsiders.com",
    referralsSent: 28,
    conversions: 5,
    commissionRate: 20,
    earnings: 1500,
  },
  "aff-youthsports-001": {
    id: "aff-youthsports-001",
    name: "YouthSports Direct",
    email: "partners@youthsportsdirect.com",
    referralsSent: 15,
    conversions: 3,
    commissionRate: 20,
    earnings: 900,
  },
}

export default function AffiliateDashboard() {
  const [authenticated, setAuthenticated] = useState<string | null>(null)
  const [loginCode, setLoginCode] = useState("")

  const handleLogin = (code: string) => {
    if (MOCK_AFFILIATES[code]) {
      setAuthenticated(code)
      setLoginCode("")
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Affiliate Portal</h1>
            <p className="text-text-secondary mb-8">Track your referrals and earnings</p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter affiliate code"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => handleLogin(loginCode)}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition"
              >
                Access Dashboard
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-border-primary">
              <p className="text-text-secondary text-sm text-center mb-4">Demo codes:</p>
              <div className="space-y-2">
                {Object.entries(MOCK_AFFILIATES).map(([code, aff]) => (
                  <button
                    key={code}
                    onClick={() => handleLogin(code)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-sm transition"
                  >
                    {aff.name} ({code})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const affiliate = MOCK_AFFILIATES[authenticated]
  const conversionRate = ((affiliate.conversions / affiliate.referralsSent) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{affiliate.name}</h1>
            <p className="text-sm text-text-secondary">Partner Dashboard</p>
          </div>
          <button
            onClick={() => setAuthenticated(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary hover:bg-bg-primary text-text-secondary transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Referrals Sent" value={affiliate.referralsSent} icon={Users} color="blue" />
          <MetricCard title="Conversions" value={affiliate.conversions} icon={TrendingUp} color="green" />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={Eye}
            color="purple"
          />
          <MetricCard
            title="Earnings"
            value={`$${affiliate.earnings.toLocaleString()}`}
            icon={DollarSign}
            color="gold"
          />
        </div>

        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase">Email</p>
              <p className="text-text-primary font-medium mt-1">{affiliate.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase">Commission Rate</p>
              <p className="text-text-primary font-medium mt-1">{affiliate.commissionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
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
    gold: "text-yellow-500 bg-yellow-500/10",
  }

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
    </div>
  )
}
