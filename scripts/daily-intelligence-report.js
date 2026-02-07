#!/usr/bin/env node
/**
 * CourtLab Daily Intelligence Report
 * Aggregates all monitoring sources into one actionable report
 * Run: node daily-intelligence-report.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/data/.openclaw/workspace/courtlab-crm';
const DATE = new Date().toISOString().split('T')[0];

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function generateReport() {
  console.log(`Generating Daily Intelligence Report for ${DATE}...\n`);

  // Load data from all sources
  const twitterLeads = loadJson(path.join(WORKSPACE, 'social-leads', `${DATE}-leads.json`)) || [];
  const twitterReport = loadJson(path.join(WORKSPACE, 'social-leads', `${DATE}-report.json`)) || {};
  const redditPosts = loadJson(path.join(WORKSPACE, 'reddit-monitoring', `${DATE}-reddit-posts.json`)) || [];
  const redditReport = loadJson(path.join(WORKSPACE, 'reddit-monitoring', `${DATE}-reddit-report.json`)) || {};
  const activityReport = loadJson(path.join(WORKSPACE, 'lead-activity', `${DATE}-activity.json`)) || [];
  const activitySummary = loadJson(path.join(WORKSPACE, 'lead-activity', `${DATE}-summary.json`)) || {};

  // Compile report
  const report = {
    date: DATE,
    generatedAt: new Date().toISOString(),
    
    twitter: {
      totalScanned: twitterReport.totalTweetsScanned || 0,
      warmLeads: twitterLeads.length,
      highValue: twitterLeads.filter(l => l.isHighValue).length,
      byCategory: twitterReport.byCategory || {},
      topLeads: twitterLeads.slice(0, 5).map(l => ({
        handle: l.authorHandle,
        name: l.authorName,
        category: l.category,
        score: l.score,
        followers: l.followers,
        snippet: l.topicSnippet,
        dmReady: l.dmTemplate ? true : false
      }))
    },

    reddit: {
      subredditsScanned: redditReport.subredditsScanned || 0,
      totalPosts: redditReport.totalPosts || 0,
      warmPosts: redditPosts.length,
      bySubreddit: redditReport.bySubreddit || {},
      topPosts: redditPosts.slice(0, 5).map(p => ({
        title: p.title?.slice(0, 80),
        author: p.author,
        subreddit: p.subreddit,
        score: p.score,
        url: p.url,
        outreach: p.outreach?.slice(0, 100)
      }))
    },

    leadActivity: {
      leadsChecked: activitySummary.leadsChecked || 0,
      withActivity: activitySummary.leadsWithActivity || 0,
      highPriority: activitySummary.highPriorityOpportunities || 0,
      hotOpportunities: activityReport
        .filter(r => r.updatedOutreach?.priority === 'high')
        .slice(0, 3)
        .map(r => ({
          handle: r.handle,
          name: r.name,
          type: r.opportunities[0]?.type,
          outreach: r.updatedOutreach?.message
        }))
    },

    actions: {
      immediate: [],
      today: [],
      thisWeek: []
    }
  };

  // Generate action items
  // Immediate: High-value Twitter leads
  twitterLeads
    .filter(l => l.isHighValue)
    .forEach(l => {
      report.actions.immediate.push({
        type: 'dm_twitter',
        target: `@${l.authorHandle}`,
        action: 'Send high-value lead DM',
        message: l.dmTemplate?.slice(0, 100)
      });
    });

  // Immediate: High-priority activity updates
  if (report.leadActivity.hotOpportunities) {
    report.leadActivity.hotOpportunities.forEach(opp => {
      report.actions.immediate.push({
        type: 'dm_twitter',
        target: `@${opp.handle}`,
        action: `Respond to ${opp.type} signal`,
        message: opp.outreach?.slice(0, 100)
      });
    });
  }

  // Today: Reddit warm posts
  redditPosts.slice(0, 3).forEach(p => {
    report.actions.today.push({
      type: 'comment_reddit',
      target: `u/${p.author} on r/${p.subreddit}`,
      action: 'Engage with value-first comment',
      context: p.title?.slice(0, 60)
    });
  });

  // Today: Warm Twitter leads
  twitterLeads
    .filter(l => l.isWarm && !l.isHighValue)
    .slice(0, 3)
    .forEach(l => {
      report.actions.today.push({
        type: 'dm_twitter',
        target: `@${l.authorHandle}`,
        action: 'Send warm lead DM',
        category: l.category
      });
    });

  // This week: Follow up on activity
  report.actions.thisWeek.push({
    type: 'review',
    action: 'Review all pending leads and responses',
    count: twitterLeads.filter(l => l.status === 'identified').length
  });

  // Save report
  const reportFile = path.join(WORKSPACE, 'intelligence-reports', `${DATE}-report.json`);
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  // Print formatted report
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     COURTLAB DAILY INTELLIGENCE REPORT                 ║');
  console.log(`║     ${DATE}                                    ║`);
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('📊 TWITTER MONITORING');
  console.log(`   Tweets scanned: ${report.twitter.totalScanned}`);
  console.log(`   Warm leads: ${report.twitter.warmLeads} (${report.twitter.highValue} high-value)`);
  console.log('   By category:');
  Object.entries(report.twitter.byCategory).forEach(([cat, count]) => {
    console.log(`     • ${cat}: ${count}`);
  });

  console.log('\n📰 REDDIT MONITORING');
  console.log(`   Subreddits: ${Object.keys(report.reddit.bySubreddit).length}`);
  console.log(`   Posts scanned: ${report.reddit.totalPosts}`);
  console.log(`   Warm posts: ${report.reddit.warmPosts}`);
  console.log('   Top communities:');
  Object.entries(report.reddit.bySubreddit)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([sub, count]) => {
      console.log(`     • r/${sub}: ${count}`);
    });

  console.log('\n🔥 LEAD ACTIVITY');
  console.log(`   Leads monitored: ${report.leadActivity.leadsChecked}`);
  console.log(`   With recent activity: ${report.leadActivity.withActivity}`);
  console.log(`   High-priority opportunities: ${report.leadActivity.highPriority}`);

  console.log('\n⚡ IMMEDIATE ACTIONS (Do Now)');
  report.actions.immediate.forEach((action, i) => {
    console.log(`   ${i + 1}. [${action.type.toUpperCase()}] ${action.action}`);
    console.log(`      Target: ${action.target}`);
    if (action.message) console.log(`      Preview: ${action.message}...`);
  });

  console.log('\n📅 TODAY\'S TASKS');
  report.actions.today.forEach((action, i) => {
    console.log(`   ${i + 1}. [${action.type.toUpperCase()}] ${action.action}`);
    console.log(`      Target: ${action.target}`);
    if (action.context) console.log(`      Context: ${action.context}...`);
  });

  console.log('\n📆 THIS WEEK');
  report.actions.thisWeek.forEach((action, i) => {
    console.log(`   ${i + 1}. ${action.action} (${action.count} items)`);
  });

  console.log('\n💾 Files saved:');
  console.log(`   ${reportFile}`);

  return report;
}

generateReport();
