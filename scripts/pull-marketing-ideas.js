#!/usr/bin/env node

/**
 * Pull Marketing Ideas Generator
 * Generates "pull marketing" ideas that create value for the other party
 * Focus: What's in it for them? (not what's in it for us)
 * Combines events, free tools, benchmarks, mastermind series, etc.
 */

const fs = require("fs")
const path = require("path")

const IDEAS_DIR = path.join(__dirname, "..", "..", "courtlab-crm", "pull-marketing-ideas")

if (!fs.existsSync(IDEAS_DIR)) {
  fs.mkdirSync(IDEAS_DIR, { recursive: true })
}

// Pull marketing idea templates
const PULL_MARKETING_TEMPLATES = {
  free_event: {
    name: "Free Event/Combine",
    effort: "high",
    value: "very_high",
    timeToExecute: "2-4 weeks",
    template: {
      name: "[Club Name] CourtLab Combine",
      what: "Free basketball combine event with live CourtLab analytics",
      forThem: "Free event, parent engagement, recruitment publicity, video content",
      forUs: "50-100 warm leads, case study, testimonial footage, affiliate opportunity",
      requires: "Event coordination, analytics team, video crew",
      cac: "Low (event cost shared with club)",
      conversion: "High (they experienced the product)",
    },
  },
  free_tool: {
    name: "Free Lite Tool",
    effort: "medium",
    value: "high",
    timeToExecute: "1-2 weeks",
    template: {
      name: "[Tool Name] - Free Version",
      what: "Limited version of CourtLab coaches can use for free",
      forThem: "Get player data, compare to benchmarks, see value before buying",
      forUs: "30-day trial, usage data, warm leads, natural conversion path",
      requires: "Feature limitation logic, freemium infrastructure",
      cac: "Very low (no event cost)",
      conversion: "Medium-High (hooked on value)",
    },
  },
  benchmark_report: {
    name: "Free Benchmark Report",
    effort: "low",
    value: "high",
    timeToExecute: "1 week",
    template: {
      name: "[Report Name] - Is Your Player College-Ready?",
      what: "Free PDF report showing player performance percentile",
      forThem: "Peace of mind, concrete data, something to share with parents",
      forUs: "Email capture, trial upgrade, shareable content",
      requires: "Report template, simple stat input form",
      cac: "Very low",
      conversion: "Medium (parents are emotionally motivated)",
    },
  },
  mastermind_series: {
    name: "Coach Mastermind Series",
    effort: "medium",
    value: "high",
    timeToExecute: "2-3 weeks planning",
    template: {
      name: "Monthly Coach Mastery Webinar",
      what: "Free monthly Zoom with elite coach + CourtLab co-hosts",
      forThem: "Learn from experts, network with peers, get insights",
      forUs: "Build relationships, position as thought partner, natural product intro",
      requires: "Guest coach recruitment, production, landing page",
      cac: "Medium (webinar production cost)",
      conversion: "Medium-High (trust-based)",
    },
  },
  viral_challenge: {
    name: "Social Viral Challenge",
    effort: "low",
    value: "high",
    timeToExecute: "1 week",
    template: {
      name: "[Challenge Name] - What's Your Player IQ?",
      what: "Short video format: coach/player predicts, data reveals",
      forThem: "Fun, shareable, ego-gratifying (see if your gut is right)",
      forUs: "Viral content, website traffic, leads from shares",
      requires: "Video production, TikTok/Instagram setup",
      cac: "Very low (organic shares)",
      conversion: "Low-Medium (but very high volume)",
    },
  },
  research_report: {
    name: "Authority Report",
    effort: "medium",
    value: "high",
    timeToExecute: "2-3 weeks",
    template: {
      name: "The [Topic] Guide for Coaches",
      what: "Comprehensive guide: 'Player Development with Data' or 'Recruitment Readiness'",
      forThem: "Valuable resource to share, improve their coaching, benchmark knowledge",
      forUs: "Email capture, positioning as expert, lead magnet, content gold",
      requires: "Research, writing, design, landing page",
      cac: "Low-Medium",
      conversion: "Medium-High (lead magnet quality)",
    },
  },
}

// Generate daily pull marketing ideas
function generatePullMarketingIdeas() {
  const date = new Date().toISOString().split("T")[0]

  // Sample ideas for this week
  const ideas = [
    {
      id: "PULL-001",
      name: "Adelaide Combine Roadshow",
      type: "free_event",
      template: PULL_MARKETING_TEMPLATES.free_event.template,
      target: "Central District Lions + North Adelaide Rockets",
      whatsInItForThem:
        "Joint combine event with free analytics for all players, parent testimonials, recruitment buzz",
      whatsInItForUs: "100+ warm leads, video content, case study, affiliate potential",
      effort: "high",
      timeline: "3 weeks",
      expectedLeads: 100,
      expectedCAC: "$500 (shared event cost)",
      priority: "high",
      nextStep: "Reach out to clubs with combined proposal",
    },
    {
      id: "PULL-002",
      name: "CourtLab Lite (Free Version)",
      type: "free_tool",
      template: PULL_MARKETING_TEMPLATES.free_tool.template,
      target: "All coaches in database",
      whatsInItForThem: "Upload 1 game/week free, get player percentiles, 30-day trial of full platform",
      whatsInItForUs: "Freemium conversion funnel, warm leads, usage data",
      effort: "medium",
      timeline: "2 weeks",
      expectedLeads: 50,
      expectedCAC: "$200 (dev time)",
      priority: "high",
      nextStep: "Design Lite feature set, build freemium gates",
    },
    {
      id: "PULL-003",
      name: "Is Your Player D1-Ready? Free Report",
      type: "benchmark_report",
      template: PULL_MARKETING_TEMPLATES.benchmark_report.template,
      target: "Parents + coaches searching 'college recruitment'",
      whatsInItForThem: "Concrete answer to 'can my kid get recruited?', percentile comparison, development path",
      whatsInItForUs: "Email capture, trial upgrade, viral parent group shares",
      effort: "low",
      timeline: "1 week",
      expectedLeads: 200,
      expectedCAC: "$100",
      priority: "high",
      nextStep: "Design report template, build stat input form",
    },
    {
      id: "PULL-004",
      name: "Monthly Coach Mastermind",
      type: "mastermind_series",
      template: PULL_MARKETING_TEMPLATES.mastermind_series.template,
      target: "Elite coaches + program directors",
      whatsInItForThem:
        "Learn from Hudl/ShotTracker power users, network with peers, monthly insights on player development",
      whatsInItForUs: "Relationship building, positioning, natural product introduction",
      effort: "medium",
      timeline: "2 weeks (planning) + monthly",
      expectedLeads: 20,
      expectedCAC: "$300/month",
      priority: "medium",
      nextStep: "Recruit first guest coach, announce series",
    },
    {
      id: "PULL-005",
      name: "What's Your Player IQ? TikTok Series",
      type: "viral_challenge",
      template: PULL_MARKETING_TEMPLATES.viral_challenge.template,
      target: "Coaches, parents, basketball TikTok community",
      whatsInItForThem: "Fun, ego-gratifying (test if their gut is right), shareable meme-worthy format",
      whatsInItForUs: "Organic reach, brand awareness, traffic spikes, low CAC",
      effort: "low",
      timeline: "1 week to launch",
      expectedLeads: 500,
      expectedCAC: "$50",
      priority: "medium",
      nextStep: "Create first 5 videos, launch on TikTok/Instagram Reels",
    },
  ]

  return {
    date,
    generatedAt: new Date().toISOString(),
    summary: {
      total: ideas.length,
      high_priority: ideas.filter((i) => i.priority === "high").length,
      totalExpectedLeads: ideas.reduce((sum, i) => sum + i.expectedLeads, 0),
      totalMonthlyCAC: ideas.reduce((sum, i) => sum + (typeof i.expectedCAC === "string" ? 500 : 0), 0),
    },
    ideas,
    philosophy:
      "Every idea answers: What's in it for THEM? Create value first, they come to us. Pull, not push.",
  }
}

// Save pull marketing ideas
function savePullMarketingIdeas() {
  const ideas = generatePullMarketingIdeas()
  const filePath = path.join(IDEAS_DIR, `pull-marketing-ideas-${ideas.date}.json`)

  fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2))

  console.log(`✅ Pull Marketing Ideas Generated`)
  console.log(`📍 Ideas: ${filePath}`)
  console.log(`\n📊 Summary:`)
  console.log(`  Total Ideas: ${ideas.summary.total}`)
  console.log(`  High Priority: ${ideas.summary.high_priority}`)
  console.log(`  Expected Leads (all ideas): ${ideas.summary.totalExpectedLeads}`)
  console.log(`  Philosophy: ${ideas.philosophy}`)

  return ideas
}

if (require.main === module) {
  try {
    savePullMarketingIdeas()
    process.exit(0)
  } catch (error) {
    console.error("Error generating pull marketing ideas:", error)
    process.exit(1)
  }
}

module.exports = { generatePullMarketingIdeas, savePullMarketingIdeas }
