"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, Users, DollarSign, Eye, LogOut, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AffiliateData {
  id: string
  name: string
  affiliateCode: string
  email: string
  joinDate: string
  status: "active" | "inactive"
  referralsSent: number
  conversions: number
  commissionRate: number
  estimatedEarnings: number
}

const MOCK_AFFILIATES: Record<string, AffiliateData> = {
  "aff-coachpro-001": {
    id: "aff-coachpro-001",
    name: "CoachPro Network",
    affiliateCode: "aff-coachpro-001",
    email: "partnerships@coachpro.com",
    joinDate: "2025-11-15",
    status: "active",
    referralsSent: 42,
    conversions: 8,
    commissionRate: 20,
    estimatedEarnings: 2400,
  },
  "aff-basketball-001": {
    id: "aff-basketball-001",
    name: "BasketballInsiders",
    affiliateCode: "aff-basketball-001",
    email: "affiliates@basketballinsiders.com",
    joinDate: "2025-12-01",
    status: "active",
    referralsSent: 28,
    conversions: 5,
    commissionRate: 20,
    estimatedEarnings: 1500,
  },
  "aff-youthsports-001": {
    id: "aff-youthsports-001",
    name: "YouthSports Direct",
    affiliateCode: "aff-youthsports-001",
    email: "partners@youthsportsdirect.com",
    joinDate: "2026-01-10",
    status: "active",
    referralsSent: 15,
    conversions: 3,
    commissionRate: 20,
    estimatedEarnings: 900,
  },
}

export default function AffiliateDashboard() {
  const [authenticatedCode, setAuthenticatedCode] = useState<string | null>(null)
  const [loginCode, setLoginCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (MOCK_AFFILIATES[loginCode]) {
        setAuthenticatedCode(loginCode)
        setLoginCode("")
      } else {
        setError("Invalid affiliate code. Please check and try again.")
      }
      setLoading(false)
    }, 500)
  }

  const handleLogout = () => {
    setAuthenticatedCode(null)
  }

  if (!authenticatedCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-bg-secondary border border-border-primary rounded-2xl p-8 shadow-xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Affiliate Portal</h1>
              <p className="text-text-secondary">Track your referrals and earnings</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Affiliate Code</label>
                <input
                  type="text"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                  placeholder="e.g., aff-coachpro-001"
                  className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  disabled={loading}
                />
              </div>

              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={loading || !loginCode}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {loading ? "Signing in..." : "Access Dashboard"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border-primary">
              <p className="text-text-secondary text-sm text-center mb-3">Demo codes:</p>
              <div className="space-y-2">
                {Object.keys(MOCK_AFFILIATES).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLoginCode(code)
                      setAuthenticatedCode(code)
                      setError("")
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-bg-tertiary hover:bg-bg-primary text-text-secondary hover:text-primary text-sm transition"
                  >
                    {MOCK_AFFILIATES[code].name} ({code})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const affiliate = MOCK_AFFILIATES[authenticatedCode]!
  const conversionRate = ((affiliate.conversions / affiliate.referralsSent) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{affiliate.name}</h1>
            <p className="text-sm text-text-secondary">Partner Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary hover:bg-bg-primary text-text-secondary hover:text-text-primary transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Referrals Sent"
            value={affiliate.referralsSent}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Conversions"
            value={affiliate.conversions}
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={<BarChart3 className="w-5 h-5" />}
            color="purple"
          />
          <MetricCard
            title="Estimated Earnings"
            value={`$${affiliate.estimatedEarnings.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            color="gold"
          />
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <div className="lg:col-span-1">
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Account Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email</p>
                  <p className="text-text-primary font-medium mt-1">{affiliate.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Affiliate Code</p>
                  <p className="text-text-primary font-mono text-sm mt-1 break-all">{affiliate.affiliateCode}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Commission Rate</p>
                  <p className="text-text-primary font-medium mt-1">{affiliate.commissionRate}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Member Since</p>
                  <p className="text-text-primary font-medium mt-1">
                    {new Date(affiliate.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance & Next Steps */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Performance Insights</h2>
              <div className="space-y-4">
                <InsightRow
                  label="Top Performing Pitch"
                  value="Youth development/pathways programs"
                  icon="🎯"
                />
                <InsightRow
                  label="Recommended Next Move"
                  value="Focus on NBL1 clubs — highest conversion rate"
                  icon="📊"
                />
                <InsightRow
                  label="Avg Days to Conversion"
                  value="14 days from referral to trial"
                  icon="⏱️"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Need Help?</h2>
              <p className="text-text-secondary text-sm mb-4">Questions about your dashboard or referral program?</p>
              <Link
                href="mailto:partnerships@courtlab.app"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition"
              >
                Contact Us
                <ChevronRight className="w-4 h-4" />
              </Link>
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
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: "blue" | "green" | "purple" | "gold"
}) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    gold: "text-yellow-500 bg-yellow-500/10",
  }

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", colorClasses[color])}>
        {icon}
      </div>
      <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
    </div>
  )
}

function InsightRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-border-primary last:border-0 last:pb-0">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-text-primary font-medium mt-1">{value}</p>
      </div>
    </div>
  )
}
