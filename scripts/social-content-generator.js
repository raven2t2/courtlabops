#!/usr/bin/env node

/**
 * Social Content Generator
 * Autonomously generates daily social media content ideas
 * Ready for approval and scheduling
 */

const fs = require("fs")
const path = require("path")

const CONTENT_DIR = path.join(__dirname, "..", "..", "courtlab-crm", "social-content-queue")

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
}

// Content pillars for CourtLab
const CONTENT_PILLARS = {
  the_truth: {
    name: "The Truth",
    theme: "Objective data beats gut feeling",
    angles: [
      "Coach bias vs. data reality",
      "Why coaches are wrong about player potential",
      "The moment data changed everything",
      "What your gut is missing",
    ],
  },
  player_development: {
    name: "Player Development",
    theme: "Measurable progress",
    angles: [
      "3-month transformation stories",
      "Underrated players data revealed",
      "Development metrics that matter",
      "Before/after player tracking",
    ],
  },
  recruitment: {
    name: "Recruitment",
    theme: "Get recruited with proof",
    angles: [
      "What college scouts actually look for",
      "Proving your kid is D1-ready",
      "Recruitment readiness assessment",
      "Data college coaches want",
    ],
  },
  competitive_intel: {
    name: "Competitive Moves",
    theme: "Market reactions",
    angles: [
      "Why [Competitor] is losing to us",
      "What coaches really want (not what [Competitor] offers)",
      "Why data > service",
    ],
  },
  thought_leadership: {
    name: "Thought Leadership",
    theme: "Basketball + AI insights",
    angles: [
      "Why AI is transforming basketball",
      "The future of objective coaching",
      "Data-driven player development",
      "How metrics beat intuition",
    ],
  },
}

// Generate daily social content
function generateDailySocialContent() {
  const date = new Date().toISOString().split("T")[0]

  const content = [
    // Twitter/X Posts (280 chars)
    {
      id: "SOCIAL-001",
      platform: "twitter",
      pillar: "the_truth",
      type: "stat",
      content:
        'Most coaches rate their point guard "really good." Data says 4th best in state for +/- efficiency. Which would you trust for a 4-year commitment?',
      hashtags: ["#DataDrivenCoaching", "#Basketball", "#CourtLab"],
      cta: "See why coaches choose CourtLab",
      link: "https://courtlab.app",
      priority: "high",
    },
    {
      id: "SOCIAL-002",
      platform: "twitter",
      pillar: "competitive_intel",
      type: "reaction",
      content:
        "Your competitor just updated their dashboard. Ours answers the real question: Is this player actually good enough? Not just: Here are stats.",
      hashtags: ["#Basketball", "#Analytics", "#CourtLab"],
      cta: "The difference matters",
      link: "https://courtlab.app",
      priority: "medium",
    },
    {
      id: "SOCIAL-003",
      platform: "twitter",
      pillar: "recruitment",
      type: "question",
      content:
        "Trying to get your kid recruited to D1? College coaches want one thing: PROOF your kid can handle that level. How are you showing them? (Data > highlight videos)",
      hashtags: ["#RecruitmentReady", "#BasketballRecruiting", "#CourtLab"],
      cta: "Build your proof",
      link: "https://courtlab.app",
      priority: "high",
    },
    // LinkedIn Posts (longer form)
    {
      id: "SOCIAL-004",
      platform: "linkedin",
      pillar: "thought_leadership",
      type: "article",
      content: `Why Objective Data Is Transforming Youth Basketball

Coaches have been making decisions on gut feeling for decades. Recruit based on "potential." Bench players based on "effort." Promote based on "eye test."

But something changed. Parents want measurable proof their kid is improving. College scouts want hard data. Teams want to win with reproducible systems, not luck.

That's where data comes in.

The coaches winning recruitment battles aren't relying on intuition. They're showing parents concrete progress metrics. The college coaches landing top recruits aren't guessing—they're analyzing. The elite teams aren't hoping—they're measuring.

The truth is, basketball is increasingly a game of inches. Literally. And those inches are only visible in data.

CourtLab exists for this exact reason: to give coaches the objective metrics they need to make better decisions. Not hunches. Truth.

#Basketball #DataAnalytics #CoachingExcellence`,
      hashtags: ["#Basketball", "#DataAnalytics", "#CoachingExcellence"],
      cta: "Learn more about objective coaching",
      link: "https://courtlab.app",
      priority: "high",
    },
    // YouTube/Video Ideas
    {
      id: "SOCIAL-005",
      platform: "youtube",
      pillar: "player_development",
      type: "video_idea",
      content:
        "60-second video: 3-Month Player Transformation — Before and after metrics showing actual player improvement with CourtLab data tracking",
      thumbnail: "Player standing over before/after stats chart",
      script_focus: "Real story of measurable improvement",
      target_length: "60 seconds",
      cta: "Start your free trial",
      priority: "high",
    },
    {
      id: "SOCIAL-006",
      platform: "youtube",
      pillar: "recruitment",
      type: "video_idea",
      content:
        "5-min video: 'What College Scouts Actually Look For' — using CourtLab data to show the exact metrics college coaches care about",
      thumbnail: "College coach watching game film with data overlay",
      script_focus: "Data-driven recruitment readiness",
      target_length: "5 minutes",
      cta: "See your recruitment potential",
      priority: "medium",
    },
  ]

  return {
    date,
    generatedAt: new Date().toISOString(),
    summary: {
      total: content.length,
      by_platform: {
        twitter: content.filter((c) => c.platform === "twitter").length,
        linkedin: content.filter((c) => c.platform === "linkedin").length,
        youtube: content.filter((c) => c.platform === "youtube").length,
      },
      by_priority: {
        high: content.filter((c) => c.priority === "high").length,
        medium: content.filter((c) => c.priority === "medium").length,
      },
    },
    content,
    instructions: {
      approval_needed: "All content requires Michael's approval before posting",
      scheduling: "High-priority tweets should be spaced 4-6 hours apart for engagement",
      hashtag_strategy:
        "Use #CourtLab on all posts, rotate sport/coaching hashtags for reach",
      engagement: "Retweet relevant basketball content, engage with coaches and programs",
    },
  }
}

// Save content queue
function saveSocialContent() {
  const dailyContent = generateDailySocialContent()
  const filePath = path.join(CONTENT_DIR, `content-queue-${dailyContent.date}.json`)

  fs.writeFileSync(filePath, JSON.stringify(dailyContent, null, 2))

  console.log(`✅ Social Content Generated`)
  console.log(`📍 Queue: ${filePath}`)
  console.log(`\n📊 Summary:`)
  console.log(`  Total Posts: ${dailyContent.summary.total}`)
  console.log(`  Twitter: ${dailyContent.summary.by_platform.twitter}`)
  console.log(`  LinkedIn: ${dailyContent.summary.by_platform.linkedin}`)
  console.log(`  YouTube Ideas: ${dailyContent.summary.by_platform.youtube}`)
  console.log(`  High Priority: ${dailyContent.summary.by_priority.high}`)

  return dailyContent
}

async function syncToAPI(contentItems) {
  try {
    const response = await fetch("http://localhost:3000/api/content/auto-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: contentItems.map((item) => ({
          id: item.id,
          platform: item.platform,
          title: item.type,
          content: item.content,
          priority: item.priority || "medium",
          tags: [item.pillar, "auto-generated"],
          source: "auto-content-generator",
        })),
      }),
    })

    if (response.ok) {
      console.log("✅ Synced to /api/content/auto-queue")
    }
  } catch (error) {
    console.log("⚠️  API sync skipped (dev mode or offline)")
  }
}

if (require.main === module) {
  try {
    const result = saveSocialContent()
    syncToAPI(result.content).catch(() => {})
    process.exit(0)
  } catch (error) {
    console.error("Error generating social content:", error)
    process.exit(1)
  }
}

module.exports = { generateDailySocialContent, saveSocialContent, syncToAPI }
