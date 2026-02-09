#!/usr/bin/env node

/**
 * Model Selector
 * Intelligent fallback for LLM API calls
 * Prioritizes cheap models, falls back gracefully
 */

const fs = require("fs")
const path = require("path")

// Model cost ranking (tokens are estimates)
const MODEL_RANKINGS = {
  haiku: { name: "claude-3-5-haiku", cost: 0.001, priority: 1, failover: "sonnet" },
  sonnet: { name: "claude-3-7-sonnet", cost: 0.003, priority: 2, failover: "gpt4omini" },
  gpt4omini: { name: "gpt-4o-mini", cost: 0.0015, priority: 3, failover: "mixtral" },
  mixtral: { name: "mixtral-8x7b", cost: 0.0, priority: 4, failover: null },
  opus: { name: "claude-3-opus", cost: 0.015, priority: 10, failover: null }, // AVOID
}

// Task complexity → Model selection
const TASK_MODELS = {
  lead_research: "haiku", // Templated, deterministic
  social_content: "haiku", // Variations on templates
  morning_ideas: "sonnet", // Strategic thinking
  lunch_ideas: "haiku", // Tactical, quick wins
  afternoon_ideas: "sonnet", // Execution planning
  outreach_draft: "sonnet", // Nuanced, personalized
  content_strategy: "sonnet", // Complex thinking
  competitor_analysis: "sonnet", // Research + nuance
  emergency_strategy: "opus", // ONLY if explicitly requested
}

// Monthly token budget tracking
const BUDGET_FILE = path.join(__dirname, "..", "..", "courtlab-crm", "token-budget.json")

function loadBudget() {
  try {
    if (fs.existsSync(BUDGET_FILE)) {
      return JSON.parse(fs.readFileSync(BUDGET_FILE, "utf-8"))
    }
  } catch (e) {
    console.warn("Could not load budget file")
  }

  return {
    month: new Date().toISOString().split("T")[0].slice(0, 7),
    totalTokens: 0,
    usedTokens: 0,
    maxTokens: 150000,
    maxCost: 30,
    usedCost: 0,
    modelUsage: {},
  }
}

function saveBudget(budget) {
  const dir = path.dirname(BUDGET_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2))
}

// Select model based on task type and budget
function selectModel(taskType) {
  const budget = loadBudget()
  const requestedModel = TASK_MODELS[taskType] || "haiku"
  const model = MODEL_RANKINGS[requestedModel]

  // Check if we're approaching budget
  const budgetUsagePercent = (budget.usedTokens / budget.maxTokens) * 100
  const costUsagePercent = (budget.usedCost / budget.maxCost) * 100

  console.log(`📊 Budget check: ${budgetUsagePercent.toFixed(1)}% tokens, ${costUsagePercent.toFixed(1)}% cost`)

  // If budget low, downgrade to cheaper model
  if (budgetUsagePercent > 80) {
    console.warn("⚠️  Budget >80%, switching to cheaper model")
    return selectFallbackModel(requestedModel)
  }

  return {
    model: model.name,
    modelKey: requestedModel,
    cost: model.cost,
    priority: model.priority,
    fallback: model.failover,
  }
}

// Find fallback model when primary is unavailable
function selectFallbackModel(primaryModel) {
  let currentModel = primaryModel
  let iterations = 0
  const maxIterations = 5

  while (iterations < maxIterations) {
    const model = MODEL_RANKINGS[currentModel]
    if (!model) return { model: "haiku", modelKey: "haiku", cost: 0.001, fallback: "sonnet" }

    // Try current model
    console.log(`🔄 Trying model: ${model.name}`)
    if (isModelAvailable(model.name)) {
      return {
        model: model.name,
        modelKey: currentModel,
        cost: model.cost,
        fallback: model.failover,
      }
    }

    // Fallback to next
    currentModel = model.failover
    iterations++
  }

  // Ultimate fallback
  console.warn("⚠️  All models unavailable, using template fallback")
  return { model: "template", modelKey: "template", cost: 0, fallback: null }
}

// Check if model API is available (stub - would call actual API)
function isModelAvailable(modelName) {
  // In production, this would check API availability
  // For now, assume all are available
  return true
}

// Log token usage
function logTokenUsage(taskType, tokensUsed, modelUsed) {
  const budget = loadBudget()
  const model = MODEL_RANKINGS[modelUsed] || { cost: 0.001 }
  const costUsed = (tokensUsed / 1000) * model.cost

  budget.usedTokens += tokensUsed
  budget.usedCost += costUsed
  budget.modelUsage[modelUsed] = (budget.modelUsage[modelUsed] || 0) + tokensUsed

  saveBudget(budget)

  console.log(`✅ Task: ${taskType}`)
  console.log(`   Model: ${modelUsed}`)
  console.log(`   Tokens: ${tokensUsed} (Total: ${budget.usedTokens}/${budget.maxTokens})`)
  console.log(`   Cost: $${costUsed.toFixed(4)} (Total: $${budget.usedCost.toFixed(2)})`)
}

// Print budget status
function printBudgetStatus() {
  const budget = loadBudget()
  const tokensRemaining = budget.maxTokens - budget.usedTokens
  const costRemaining = budget.maxCost - budget.usedCost
  const percentUsed = ((budget.usedTokens / budget.maxTokens) * 100).toFixed(1)

  console.log(`\n📊 Monthly Budget Status`)
  console.log(`   Tokens: ${budget.usedTokens}/${budget.maxTokens} (${percentUsed}%)`)
  console.log(`   Cost: $${budget.usedCost.toFixed(2)}/$${budget.maxCost.toFixed(2)}`)
  console.log(`   Status: ${percentUsed > 80 ? "⚠️  WARNING" : percentUsed > 50 ? "⚡ MONITORING" : "✅ HEALTHY"}`)
  console.log(`\n📈 Model Usage:`)
  Object.entries(budget.modelUsage).forEach(([model, tokens]) => {
    console.log(`   ${model}: ${tokens} tokens`)
  })
}

if (require.main === module) {
  // Example usage
  console.log("Model Selector initialized")
  const task = process.argv[2] || "lead_research"
  const selected = selectModel(task)
  console.log(`\nSelected for ${task}:`, selected)
  printBudgetStatus()
}

module.exports = { selectModel, selectFallbackModel, logTokenUsage, printBudgetStatus, loadBudget, saveBudget }
