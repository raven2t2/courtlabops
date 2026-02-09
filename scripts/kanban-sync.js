#!/usr/bin/env node

/**
 * Kanban Board Sync
 * Pushes marketing agency output (leads, content, ideas) directly to the Kanban board
 * Makes the Kanban board the source of truth for all marketing work
 */

const fs = require("fs")
const path = require("path")

const KANBAN_PATH = path.join(__dirname, "..", "kanban-board.json")
const LEADS_RESEARCH_DIR = path.join(__dirname, "..", "..", "courtlab-crm", "leads-research")
const CONTENT_QUEUE_DIR = path.join(__dirname, "..", "..", "courtlab-crm", "social-content-queue")

// Load current Kanban board
function loadKanban() {
  try {
    return JSON.parse(fs.readFileSync(KANBAN_PATH, "utf-8"))
  } catch {
    return { version: "1.0", columns: [], tasks: {}, lastUpdated: new Date().toISOString() }
  }
}

// Generate unique ID
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Add leads to Kanban (Drafted column)
function addLeadsToKanban(kanban, leads) {
  if (!kanban.columns) kanban.columns = []

  // Ensure columns exist
  if (!kanban.columns.find((c) => c.id === "drafted")) {
    kanban.columns.push({
      id: "drafted",
      name: "📋 Drafted",
      color: "#e2e8f0",
      leads: [],
      tasks: [],
    })
  }

  const draftedColumn = kanban.columns.find((c) => c.id === "drafted")

  leads.forEach((lead) => {
    const leadId = `LEAD-${lead.type.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

    // Add to tasks
    if (!kanban.tasks) kanban.tasks = {}

    kanban.tasks[leadId] = {
      title: `${lead.name} (${lead.type})`,
      description: `Location: ${lead.location}\nPain Point: ${lead.painPoint}\nApproach: ${lead.approach}`,
      priority: "high",
      type: "lead",
      lead_data: lead,
    }

    // Add to Drafted column
    if (!draftedColumn.leads) draftedColumn.leads = []
    if (!draftedColumn.leads.includes(leadId)) {
      draftedColumn.leads.push(leadId)
    }
  })

  return kanban
}

// Add social content to Kanban (Tasks)
function addContentToKanban(kanban, contentItems) {
  if (!kanban.columns) kanban.columns = []
  if (!kanban.tasks) kanban.tasks = {}

  // Ensure "Todo" column exists
  if (!kanban.columns.find((c) => c.id === "todo")) {
    kanban.columns.push({
      id: "todo",
      name: "📝 To Do",
      color: "#fef3c7",
      leads: [],
      tasks: [],
    })
  }

  const todoColumn = kanban.columns.find((c) => c.id === "todo")

  contentItems.forEach((item) => {
    const taskId = `CONTENT-${item.platform.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`

    kanban.tasks[taskId] = {
      title: `[${item.platform.toUpperCase()}] ${item.pillar} - ${item.type}`,
      description: item.content,
      priority: item.priority || "medium",
      type: "social_content",
      platform: item.platform,
      pillar: item.pillar,
      cta: item.cta,
      link: item.link,
      hashtags: item.hashtags,
    }

    if (!todoColumn.tasks) todoColumn.tasks = []
    if (!todoColumn.tasks.includes(taskId)) {
      todoColumn.tasks.push(taskId)
    }
  })

  return kanban
}

// Sync leads from research directory to Kanban
function syncLeadsFromResearch() {
  try {
    const files = fs.readdirSync(LEADS_RESEARCH_DIR).filter((f) => f.startsWith("qualified-leads"))
    if (files.length === 0) return null

    const latestFile = files.sort().reverse()[0]
    const leadData = JSON.parse(fs.readFileSync(path.join(LEADS_RESEARCH_DIR, latestFile), "utf-8"))

    return leadData.leads || []
  } catch (error) {
    console.error("Error reading leads research:", error.message)
    return null
  }
}

// Sync content from queue directory to Kanban
function syncContentFromQueue() {
  try {
    const files = fs.readdirSync(CONTENT_QUEUE_DIR).filter((f) => f.startsWith("content-queue"))
    if (files.length === 0) return null

    const latestFile = files.sort().reverse()[0]
    const contentData = JSON.parse(fs.readFileSync(path.join(CONTENT_QUEUE_DIR, latestFile), "utf-8"))

    return contentData.content || []
  } catch (error) {
    console.error("Error reading social content:", error.message)
    return null
  }
}

// Main sync function
function syncKanban() {
  console.log("🔄 Syncing Kanban board...")

  const kanban = loadKanban()

  // Sync leads
  const leads = syncLeadsFromResearch()
  if (leads && leads.length > 0) {
    console.log(`📍 Adding ${leads.length} qualified leads to Kanban...`)
    addLeadsToKanban(kanban, leads)
  }

  // Sync content
  const content = syncContentFromQueue()
  if (content && content.length > 0) {
    console.log(`📝 Adding ${content.length} content items to Kanban...`)
    addContentToKanban(kanban, content)
  }

  // Update timestamp
  kanban.lastUpdated = new Date().toISOString()

  // Save updated Kanban
  fs.writeFileSync(KANBAN_PATH, JSON.stringify(kanban, null, 2))

  console.log("✅ Kanban board synced!")
  console.log(`📊 Board summary:`)
  console.log(`  Total tasks: ${Object.keys(kanban.tasks || {}).length}`)
  console.log(`  Updated: ${kanban.lastUpdated}`)

  return kanban
}

if (require.main === module) {
  try {
    syncKanban()
    process.exit(0)
  } catch (error) {
    console.error("Error syncing Kanban:", error)
    process.exit(1)
  }
}

module.exports = { syncKanban, loadKanban, addLeadsToKanban, addContentToKanban }
