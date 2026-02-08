#!/usr/bin/env node

/**
 * Generate sample briefings for testing archive
 * Creates briefings for the past 7 days
 */

const fs = require('fs')
const path = require('path')
const { generateBriefing, saveBriefing } = require('./daily-briefing')

function getPastDate(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

async function main() {
  console.log('Generating sample briefings for the past 7 days...\n')

  for (let i = 7; i >= 0; i--) {
    const date = getPastDate(i)
    console.log(`Generating briefing for ${date}...`)
    
    const briefing = generateBriefing(date)
    saveBriefing(briefing)
    console.log(`✓ Created briefing for ${date}\n`)
  }

  console.log('✅ All sample briefings generated successfully!')
}

if (require.main === module) {
  main()
}
