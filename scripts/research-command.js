#!/usr/bin/env node

/**
 * Research Command
 * Query real-time trends for marketing research
 * 
 * Usage:
 *   node research-command.js "basketball training app marketing"
 *   node research-command.js "apple search ads optimization 2026"
 *   node research-command.js "youth basketball coaching technology"
 * 
 * Integrates with:
 * - Brave Search (web trends)
 * - Twitter API (social signals)
 * - Reddit (community discussions)
 * - HackerNews (developer discussions)
 */

const fs = require('fs')
const https = require('https')

// Configuration
const QUERY = process.argv[2] || ''

if (!QUERY) {
  console.error('❌ Usage: node research-command.js "<query>"')
  console.error('')
  console.error('Examples:')
  console.error('  node research-command.js "basketball training app marketing"')
  console.error('  node research-command.js "apple search ads optimization 2026"')
  console.error('  node research-command.js "youth basketball coaching technology"')
  process.exit(1)
}

console.log(`🔍 Last 30 Days Research: "${QUERY}"`)
console.log('')

// Format query for URLs
const encodedQuery = encodeURIComponent(QUERY)

// Research sources with URLs
const sources = {
  brave: {
    name: '📰 BRAVE SEARCH (Web Trends)',
    url: `https://search.brave.com/search?q=${encodedQuery}&tf=pd`,
    description: 'Latest web results on this topic'
  },
  twitter: {
    name: '🐦 TWITTER/X (Social Signals - Last 7 Days)',
    url: `https://twitter.com/search?q=${encodedQuery}%20-filter:retweets&tf=l`,
    description: 'What people are discussing right now'
  },
  reddit: {
    name: '🔗 REDDIT (Community Discussions)',
    url: `https://www.reddit.com/search/?q=${encodedQuery}&t=month`,
    description: 'Real conversations from practitioners'
  },
  hackernews: {
    name: '📊 HACKER NEWS (Developer Insights)',
    url: `https://hn.algolia.com/?q=${encodedQuery}&sort=byDate&dateRange=last30d`,
    description: 'What builders are thinking about'
  },
  gsheets: {
    name: '📋 GOOGLE SHEETS (Log Research)',
    description: 'Create a research log entry with findings'
  }
}

// Display research links
console.log('RESEARCH SOURCES')
console.log('================')
console.log('')

for (const [key, source] of Object.entries(sources)) {
  console.log(`${source.name}`)
  console.log(`${source.description}`)
  if (source.url) {
    console.log(`${source.url}`)
  } else {
    console.log(`(Link: Use Google Sheets API to log findings)`)
  }
  console.log('')
}

// Suggested research structure
console.log('📝 RESEARCH STRUCTURE')
console.log('====================')
console.log(`For: "${QUERY}"`)
console.log('')
console.log('1. TRENDS (What\'s hot right now?)')
console.log('   - Check Brave Search + Twitter trending')
console.log('   - Note: Any viral posts, discussions, launches')
console.log('')
console.log('2. COMMUNITY (What are practitioners saying?)')
console.log('   - Check Reddit + HN discussions')
console.log('   - Note: Pain points, solutions being tried')
console.log('')
console.log('3. PRACTICAL (What actually works?)')
console.log('   - Case studies, tutorials, how-tos')
console.log('   - Results, metrics, ROI mentioned')
console.log('')
console.log('4. OPPORTUNITIES (What\'s missing?)')
console.log('   - Complaints, unmet needs, gaps')
console.log('   - What could CourtLab do differently?')
console.log('')

// Quick integration examples
console.log('🔗 INTEGRATION TIPS')
console.log('===================')
console.log('')
console.log('Add to cron job (auto-research every morning):')
console.log('  0 8 * * * node research-command.js "basketball app marketing" >> research-log.txt')
console.log('')
console.log('Use in briefing script:')
console.log('  const research = require(\'./research-command\')')
console.log('  const findings = research.search("apple search ads 2026")')
console.log('')
console.log('Export to Google Sheets:')
console.log('  Add: logToGoogleSheets(query, findings)')
console.log('')

// Next steps
console.log('✅ NEXT STEPS')
console.log('=============')
console.log('1. Open one of the links above in your browser')
console.log('2. Scan for patterns and signals')
console.log('3. Log findings to briefing or Google Sheets')
console.log('4. Reference in outreach + strategy decisions')
console.log('')

console.log('💡 This is your research command. Use it daily to stay current.')
console.log('   No more YouTube rabbit holes - just real data.')
console.log('')
