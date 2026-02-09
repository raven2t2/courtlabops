/**
 * Utility functions for briefing system
 */

export interface BriefingMetrics {
  signups: number
  signupsChange: number
  demos: number
  demosChange: number
  trials: number
  trialsChange: number
}

export interface HotLead {
  name: string
  source: string
  temp: "hot" | "warm" | "cold"
  score: number
}

export interface Affiliate {
  name: string
  conversions: number
  revenue: number
}

export interface CompetitiveNews {
  title: string
  source: string
  date: string
}

export interface ContentPost {
  title: string
  platform: string
  engagement: number
}

export interface CalendarEvent {
  title: string
  time: string
  attendees: string
}

export interface Weather {
  condition: string
  temp: number
  humidity: number
  forecast: string
}

export interface BriefingSection {
  metrics: BriefingMetrics
  leads: { hot: HotLead[] }
  affiliates: { topPerformers: Affiliate[] }
  competitive: { news: CompetitiveNews[] }
  content: { topPosts: ContentPost[] }
  ops: { blockers: string[]; deployments: string[] }
  calendar: { events: CalendarEvent[] }
  weather: Weather
}

export interface Briefing {
  date: string
  generatedAt?: string
  sections: BriefingSection
}

/**
 * Format a date as a readable string
 */
export function formatBriefingDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Get tone color for a metric change
 */
export function getMetricTone(change: number): "green" | "red" | "neutral" {
  if (change > 5) return "green"
  if (change < -5) return "red"
  return "neutral"
}

/**
 * Get badge tone for lead temperature
 */
export function getLeadTone(temp: string): "red" | "orange" | "blue" {
  switch (temp) {
    case "hot":
      return "red"
    case "warm":
      return "orange"
    default:
      return "blue"
  }
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-AU").format(num)
}

/**
 * Calculate engagement rank
 */
export function getEngagementRank(
  engagement: number,
  allEngagements: number[]
): "gold" | "silver" | "bronze" | "standard" {
  const sorted = [...allEngagements].sort((a, b) => b - a)
  const rank = sorted.indexOf(engagement)

  if (rank === 0) return "gold"
  if (rank === 1) return "silver"
  if (rank === 2) return "bronze"
  return "standard"
}

/**
 * Get time period label
 */
export function getTimePeriod(): string {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 12) return "Morning"
  if (hour < 18) return "Afternoon"
  return "Evening"
}

/**
 * Check if briefing is from today
 */
export function isTodayBriefing(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0]
  return dateStr === today
}

/**
 * Get relative date string (e.g., "2 days ago")
 */
export function getRelativeDateString(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

/**
 * Export briefing as CSV
 */
export function exportBriefingAsCSV(briefing: Briefing): string {
  const lines: string[] = []

  // Header
  lines.push(`CourtLab Daily Briefing - ${formatBriefingDate(briefing.date)}`)
  lines.push("")

  // Metrics
  lines.push("METRICS")
  const { metrics } = briefing.sections
  lines.push(`New Signups,${metrics.signups},${metrics.signupsChange}%`)
  lines.push(`Demo Requests,${metrics.demos},${metrics.demosChange}%`)
  lines.push(`Trial Activations,${metrics.trials},${metrics.trialsChange}%`)
  lines.push("")

  // Leads
  lines.push("HOT LEADS")
  briefing.sections.leads.hot.forEach((lead) => {
    lines.push(`${lead.name},${lead.temp},${lead.score},${lead.source}`)
  })
  lines.push("")

  // Affiliates
  lines.push("TOP AFFILIATES")
  briefing.sections.affiliates.topPerformers.forEach((aff) => {
    lines.push(`${aff.name},${aff.conversions},${aff.revenue}`)
  })
  lines.push("")

  // Content
  lines.push("TOP CONTENT")
  briefing.sections.content.topPosts.forEach((post) => {
    lines.push(`${post.title},${post.platform},${post.engagement}`)
  })

  return lines.join("\n")
}

/**
 * Get briefing summary for notifications
 */
export function getBriefingSummary(briefing: Briefing): string {
  const date = formatBriefingDate(briefing.date)
  const { metrics, leads, affiliates } = briefing.sections

  return `Good morning! Here's your CourtLab briefing for ${date}:

📊 Metrics: ${metrics.signups} new signups (${metrics.signupsChange >= 0 ? "+" : ""}${metrics.signupsChange}%), ${metrics.demos} demos, ${metrics.trials} trials

🔥 Hot Leads: ${leads.hot.length} prospects

⚡ Top Affiliate: ${affiliates.topPerformers[0]?.name || "N/A"} (${affiliates.topPerformers[0]?.conversions || 0} conversions)

View full briefing: /briefings`
}
