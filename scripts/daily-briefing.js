#!/usr/bin/env node

/**
 * Daily Briefing Generator for CourtLab
 * 
 * This script generates a comprehensive morning briefing with:
 * - CourtLab metrics (signups, demos, trials from last 24h)
 * - Lead temperature (hot prospects from social + Reddit)
 * - Affiliate activity (top performers and conversions)
 * - Competitive intelligence (youth sports tech news)
 * - Content performance (top tweets/posts)
 * - Ops status (blockers and deployments)
 * - Calendar events (today's calls/meetings)
 * - Weather forecast (Adelaide)
 * 
 * Outputs:
 * - JSON briefing in /courtlab-briefings/briefing-YYYY-MM-DD.json
 * - HTML version for web display
 */

const fs = require('fs')
const path = require('path')

// Configuration
const BRIEFINGS_DIR = '/data/.openclaw/workspace/courtlab-briefings'
const OUTPUT_DIR = path.join(process.cwd(), '..', 'courtlab-briefings')

// Ensure briefings directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// Mock data generators (in production, these would fetch from real APIs)
function generateMetrics() {
  return {
    signups: Math.floor(Math.random() * 20) + 8,
    signupsChange: Math.floor(Math.random() * 20) - 5,
    demos: Math.floor(Math.random() * 8) + 2,
    demosChange: Math.floor(Math.random() * 15) - 5,
    trials: Math.floor(Math.random() * 5) + 1,
    trialsChange: Math.floor(Math.random() * 10) - 3,
  }
}

function generateLeads() {
  const sources = [
    'Twitter mention',
    'Reddit discussion',
    'LinkedIn post',
    'Influencer share',
    'Coach referral',
    'News mention',
  ]
  
  const leads = [
    { name: 'Forestville Eagles', base: 90 },
    { name: 'Melbourne Tigers', base: 85 },
    { name: 'Frankston Blues', base: 78 },
    { name: 'Sturt Sabres', base: 82 },
    { name: 'Knox Raiders', base: 75 },
  ]

  return {
    hot: leads.map((lead) => ({
      name: lead.name,
      source: sources[Math.floor(Math.random() * sources.length)],
      temp: Math.random() > 0.4 ? 'hot' : 'warm',
      score: lead.base + Math.floor(Math.random() * 10) - 5,
    })),
  }
}

function generateAffiliates() {
  const affiliates = [
    { name: 'Sarah Chen (TikTok)', base: 8 },
    { name: 'Coach Marcus (Instagram)', base: 5 },
    { name: 'David Lee (YouTube)', base: 4 },
    { name: 'Emma Rose (Twitter)', base: 3 },
    { name: 'James Park (Reddit)', base: 2 },
  ]

  return {
    topPerformers: affiliates.map((aff) => ({
      name: aff.name,
      conversions: aff.base + Math.floor(Math.random() * 3),
      revenue: (aff.base * 500) + Math.floor(Math.random() * 2000),
    })).sort((a, b) => b.conversions - a.conversions),
  }
}

function generateCompetitiveIntel() {
  const news = [
    {
      title: 'PlayerZone raises $5M Series A for youth sports platform',
      source: 'TechCrunch',
      date: 'Today',
    },
    {
      title: 'STATS Perform launches advanced youth analytics dashboard',
      source: 'Sports Tech News',
      date: 'Yesterday',
    },
    {
      title: 'Basket.app hits 50k monthly active users milestone',
      source: 'Product Hunt',
      date: '2 days ago',
    },
    {
      title: 'Hudl secures partnership with Australian Basketball Association',
      source: 'Sports Business Daily',
      date: '3 days ago',
    },
  ]

  return {
    news: news.sort(() => Math.random() - 0.5).slice(0, 3),
  }
}

function generateContentPerformance() {
  const posts = [
    { title: '5 Basketball Drills for Guard Development', platform: 'YouTube', engagement: 2847 },
    { title: 'Youth Tournament Highlights Reel', platform: 'Instagram', engagement: 1654 },
    { title: 'Coach Interview: Building Winning Culture', platform: 'TikTok', engagement: 5234 },
    { title: 'Fitness Tips for Young Athletes', platform: 'Twitter', engagement: 892 },
    { title: 'Court Setup Guide for Small Gyms', platform: 'Reddit', engagement: 634 },
  ]

  return {
    topPosts: posts.sort((a, b) => b.engagement - a.engagement).slice(0, 3),
  }
}

function generateOpsStatus() {
  const blockers = [
    'Twitter API rate limits hitting daily - need to implement caching',
    'Gallery image sync timeout on large batches',
  ]

  const deployments = [
    'Kanban column reorganization deployed',
    'Social posting automation enabled',
    'Lead scoring algorithm updated',
  ]

  return {
    blockers,
    deployments,
  }
}

function generateCalendarEvents() {
  const now = new Date()
  const todayDate = now.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Check if today is a weekend
  const dayOfWeek = now.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  const events = [
    {
      title: isWeekend ? 'Team Sync & Content Review' : 'Easter Classic Tournament Planning',
      time: '10:00 AM',
      attendees: 'Michael, Coach Sarah',
    },
    {
      title: 'Affiliate Partner Sync',
      time: '2:00 PM',
      attendees: 'Michael, Esther',
    },
    {
      title: 'Content Strategy Review',
      time: '4:00 PM',
      attendees: 'Michael, Design Team',
    },
  ]

  // Remove some events on weekends (simulate lighter schedule)
  if (isWeekend) {
    return { events: events.slice(0, 1) }
  }

  return { events }
}

function generateWeather() {
  const conditions = ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Clear']
  const condition = conditions[Math.floor(Math.random() * conditions.length)]
  const temp = Math.floor(Math.random() * 12) + 16 // 16-28°C for Adelaide

  const forecasts = {
    Sunny: 'Perfect outdoor training conditions. Great day for court sessions.',
    'Partly Cloudy': 'Clear skies with light winds. Excellent for practice.',
    Overcast: 'Mild conditions. Suitable for indoor and outdoor activities.',
    'Light Rain': 'Indoor training recommended. Good day for skill development drills.',
    Clear: 'Clear skies expected throughout the day. Ideal for matches.',
  }

  return {
    condition,
    temp,
    humidity: Math.floor(Math.random() * 30) + 45, // 45-75%
    forecast: forecasts[condition] || 'Check local forecast for updates.',
  }
}

// Generate complete briefing
function generateBriefing(date) {
  return {
    date,
    generatedAt: new Date().toISOString(),
    sections: {
      metrics: generateMetrics(),
      leads: generateLeads(),
      affiliates: generateAffiliates(),
      competitive: generateCompetitiveIntel(),
      content: generateContentPerformance(),
      ops: generateOpsStatus(),
      calendar: generateCalendarEvents(),
      weather: generateWeather(),
    },
  }
}

// Convert briefing to HTML
function generateHTML(briefing) {
  const dateObj = new Date(briefing.date)
  const dateStr = dateObj.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const { sections } = briefing

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CourtLab Daily Briefing - ${dateStr}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #0f172a;
      color: #f5f7f9;
      line-height: 1.6;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .header h1 {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #5584ff, #ff6b35);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .header p { color: #a0aec0; font-size: 16px; }
    
    section { margin-bottom: 40px; }
    h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #f5f7f9;
    }
    
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      backdrop-filter: blur(10px);
    }
    .metric-label { font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .metric-value { font-size: 36px; font-weight: 900; color: #5584ff; margin-bottom: 8px; }
    .metric-change { font-size: 13px; color: #48bb78; font-weight: 600; }
    .metric-change.negative { color: #f56565; }
    
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; }
    
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
      backdrop-filter: blur(10px);
    }
    
    .card-title { font-weight: 600; color: #f5f7f9; margin-bottom: 8px; }
    .card-meta { font-size: 13px; color: #a0aec0; }
    .card-stat { font-size: 24px; font-weight: 900; color: #5584ff; margin-top: 8px; }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
      margin-top: 8px;
    }
    .badge-hot { background: rgba(245,107,107,0.2); color: #f56565; }
    .badge-warm { background: rgba(255,107,53,0.2); color: #ff6b35; }
    .badge-green { background: rgba(72,187,120,0.2); color: #48bb78; }
    .badge-blue { background: rgba(85,132,255,0.2); color: #5584ff; }
    
    .temp-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .temp-hot { background: #f56565; }
    .temp-warm { background: #ff6b35; }
    
    .list-item { margin-bottom: 12px; padding-left: 20px; position: relative; }
    .list-item:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #ff6b35;
      font-weight: bold;
    }
    .list-item.success:before { content: "✓"; color: #48bb78; }
    
    .weather-card {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      background: linear-gradient(135deg, rgba(85,132,255,0.15), rgba(255,107,53,0.15));
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 30px;
    }
    .weather-temp { font-size: 48px; font-weight: 900; color: #5584ff; line-height: 1; }
    .weather-info { font-size: 16px; color: #a0aec0; margin-top: 8px; }
    .weather-forecast { text-align: right; color: #a0aec0; max-width: 300px; }
    
    @media (max-width: 768px) {
      .header h1 { font-size: 32px; }
      .grid-2 { grid-template-columns: 1fr; }
      .weather-card { flex-direction: column; align-items: flex-start; }
      .weather-forecast { text-align: left; margin-top: 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Daily Briefing</h1>
      <p>${dateStr}</p>
    </div>

    <!-- Metrics -->
    <section>
      <h2>📊 CourtLab Metrics (Last 24h)</h2>
      <div class="metrics">
        <div class="metric-card">
          <div class="metric-label">New Signups</div>
          <div class="metric-value">${sections.metrics.signups}</div>
          <div class="metric-change ${sections.metrics.signupsChange < 0 ? 'negative' : ''}">
            ${sections.metrics.signupsChange >= 0 ? '+' : ''}${sections.metrics.signupsChange}%
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Demo Requests</div>
          <div class="metric-value">${sections.metrics.demos}</div>
          <div class="metric-change ${sections.metrics.demosChange < 0 ? 'negative' : ''}">
            ${sections.metrics.demosChange >= 0 ? '+' : ''}${sections.metrics.demosChange}%
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Trial Activations</div>
          <div class="metric-value">${sections.metrics.trials}</div>
          <div class="metric-change ${sections.metrics.trialsChange < 0 ? 'negative' : ''}">
            ${sections.metrics.trialsChange >= 0 ? '+' : ''}${sections.metrics.trialsChange}%
          </div>
        </div>
      </div>
    </section>

    <!-- Lead Temperature -->
    <section>
      <h2>🔥 Lead Temperature (Social + Reddit)</h2>
      ${sections.leads.hot.map(lead => `
        <div class="card">
          <div class="card-title">
            <span class="temp-indicator ${lead.temp === 'hot' ? 'temp-hot' : 'temp-warm'}"></span>
            ${lead.name}
          </div>
          <div class="card-meta">${lead.source}</div>
          <span class="badge badge-${lead.temp}">Score: ${lead.score}</span>
        </div>
      `).join('')}
    </section>

    <!-- Grid Section -->
    <div class="grid-2">
      <!-- Affiliates -->
      <section>
        <h2>⚡ Top Affiliates</h2>
        ${sections.affiliates.topPerformers.map(aff => `
          <div class="card">
            <div class="card-title">${aff.name}</div>
            <div class="card-meta">${aff.conversions} conversions • \$${aff.revenue.toLocaleString()}</div>
          </div>
        `).join('')}
      </section>

      <!-- Competitive Intel -->
      <section>
        <h2>⚠️ Competitive Intel</h2>
        ${sections.competitive.news.map(news => `
          <div class="card">
            <div class="card-title">${news.title}</div>
            <div class="card-meta">${news.source} • ${news.date}</div>
          </div>
        `).join('')}
      </section>
    </div>

    <!-- Content Performance -->
    <section>
      <h2>💬 Content Performance</h2>
      ${sections.content.topPosts.map(post => `
        <div class="card">
          <div class="card-title">${post.title}</div>
          <div class="card-meta">${post.platform}</div>
          <div class="card-stat">${post.engagement.toLocaleString()} engagements</div>
        </div>
      `).join('')}
    </section>

    <!-- Ops & Calendar Grid -->
    <div class="grid-2">
      <!-- Ops Status -->
      <section>
        <h2>🚨 Ops Status</h2>
        ${sections.ops.blockers.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 14px; color: #f56565; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Blockers</h3>
            ${sections.ops.blockers.map(b => `<div class="list-item">${b}</div>`).join('')}
          </div>
        ` : ''}
        ${sections.ops.deployments.length > 0 ? `
          <div>
            <h3 style="font-size: 14px; color: #48bb78; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Deployments</h3>
            ${sections.ops.deployments.map(d => `<div class="list-item success">${d}</div>`).join('')}
          </div>
        ` : ''}
      </section>

      <!-- Calendar -->
      <section>
        <h2>📅 Today's Schedule</h2>
        ${sections.calendar.events.map(event => `
          <div class="card">
            <div class="card-title">${event.title}</div>
            <div class="card-meta" style="color: #5584ff; font-weight: 600; margin-bottom: 8px;">${event.time}</div>
            <div class="card-meta">${event.attendees}</div>
          </div>
        `).join('')}
      </section>
    </div>

    <!-- Weather -->
    <section>
      <h2>🌤️ Weather (Adelaide)</h2>
      <div class="weather-card">
        <div>
          <div class="weather-temp">${sections.weather.temp}°C</div>
          <div class="weather-info">${sections.weather.condition}</div>
          <div class="weather-info">Humidity: ${sections.weather.humidity}%</div>
        </div>
        <div class="weather-forecast">${sections.weather.forecast}</div>
      </div>
    </section>
  </div>
</body>
</html>`
}

// Save briefing
function saveBriefing(briefing) {
  ensureDirectoryExists(BRIEFINGS_DIR)

  const fileName = `briefing-${briefing.date}.json`
  const filePath = path.join(BRIEFINGS_DIR, fileName)

  // Save JSON
  fs.writeFileSync(filePath, JSON.stringify(briefing, null, 2))
  console.log(`✓ Saved JSON briefing: ${filePath}`)

  // Save HTML version
  const htmlPath = path.join(BRIEFINGS_DIR, `briefing-${briefing.date}.html`)
  const html = generateHTML(briefing)
  fs.writeFileSync(htmlPath, html)
  console.log(`✓ Saved HTML briefing: ${htmlPath}`)

  return { jsonPath: filePath, htmlPath }
}

// Main execution
async function main() {
  try {
    const date = getTodayDate()
    console.log(`Generating daily briefing for ${date}...`)

    const briefing = generateBriefing(date)
    const { jsonPath, htmlPath } = saveBriefing(briefing)

    console.log('\n✅ Daily briefing generated successfully!')
    console.log(`📍 JSON: ${jsonPath}`)
    console.log(`📍 HTML: ${htmlPath}`)
    console.log('\nBriefing summary:')
    console.log(`  • Metrics: ${briefing.sections.metrics.signups} signups, ${briefing.sections.metrics.demos} demos, ${briefing.sections.metrics.trials} trials`)
    console.log(`  • Hot leads: ${briefing.sections.leads.hot.length}`)
    console.log(`  • Top affiliates: ${briefing.sections.affiliates.topPerformers.length}`)
    console.log(`  • Competitive news: ${briefing.sections.competitive.news.length}`)
    console.log(`  • Top content: ${briefing.sections.content.topPosts.length}`)
    console.log(`  • Ops blockers: ${briefing.sections.ops.blockers.length}`)
    console.log(`  • Calendar events: ${briefing.sections.calendar.events.length}`)
    console.log(`  • Weather: ${briefing.sections.weather.temp}°C, ${briefing.sections.weather.condition}`)
  } catch (error) {
    console.error('❌ Error generating briefing:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { generateBriefing, saveBriefing }
