#!/usr/bin/env node
/**
 * CourtLab Lead Activity Tracker
 * Monitors Twitter activity of all leads, clubs, sponsors, affiliates
 * Generates updated outreach based on their recent posts
 * Run: node lead-activity-tracker.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/data/.openclaw/workspace/courtlab-crm';
const LEADS_DIR = path.join(WORKSPACE, 'social-leads');
const ACTIVITY_DIR = path.join(WORKSPACE, 'lead-activity');
const DATE = new Date().toISOString().split('T')[0];

fs.mkdirSync(ACTIVITY_DIR, { recursive: true });

// Twitter auth
process.env.AUTH_TOKEN = '618eca89893e473ae3f6b52e16af9d2fcdc1ed47';
process.env.CT0 = '8558cf6ebc849c79ec6397cee5f1f46f9d95c369b3694e60426911c04d88a0ca6d54b9d6aaad7ef834ba9b5f58a265564be77cdd9eef26c3a0d8788760169cbfa254abfb7252b6797de9a0ce4d4596ce';

// Load all leads we've discovered
function loadAllLeads() {
  const leads = [];
  const files = fs.readdirSync(LEADS_DIR).filter(f => f.endsWith('-leads.json'));
  
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(LEADS_DIR, file), 'utf8'));
      leads.push(...data);
    } catch (e) {
      console.error(`Error loading ${file}:`, e.message);
    }
  }
  
  // Remove duplicates by handle
  const unique = Array.from(new Map(leads.map(l => [l.authorHandle, l])).values());
  return unique;
}

// Get recent tweets from a user
function getUserTweets(handle, count = 10) {
  try {
    const result = execSync(
      `bird user-tweets @${handle} -n ${count} --json`,
      { encoding: 'utf8', timeout: 30000 }
    );
    return JSON.parse(result);
  } catch (e) {
    console.error(`Error fetching tweets for @${handle}:`, e.message);
    return [];
  }
}

// Analyze tweet for outreach opportunities
function analyzeTweet(tweet, lead) {
  const text = (tweet.text || tweet.full_text || '').toLowerCase();
  const opportunities = [];

  // Signals to watch for
  const signals = {
    frustration: ['frustrated', 'struggling', 'difficult', 'hard to', 'annoying', 'hate', 'wish'],
    seeking_help: ['looking for', 'recommendation', 'advice', 'help', 'suggestions', 'ideas'],
    upcoming_event: ['announcement', 'excited', 'coming up', 'next week', 'save the date'],
    celebration: ['proud', 'congratulations', 'great job', 'amazing', 'incredible'],
    engagement: ['what do you think', 'thoughts', 'opinion', 'question']
  };

  for (const [type, keywords] of Object.entries(signals)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        opportunities.push({
          type,
          keyword,
          context: tweet.text?.slice(0, 100),
          tweetUrl: `https://twitter.com/${lead.authorHandle}/status/${tweet.id || tweet.id_str}`
        });
        break;
      }
    }
  }

  return opportunities;
}

// Generate updated outreach based on recent activity
function generateUpdatedOutreach(lead, recentActivity) {
  const lastTweet = recentActivity.tweets[0];
  const opportunities = recentActivity.opportunities;

  if (opportunities.length === 0) {
    // Generic follow-up
    return {
      type: 'follow_up',
      message: `Hey ${lead.authorName || lead.authorHandle}, following up on our conversation about basketball development. Any thoughts on verified combine data for tracking player progress?`,
      priority: 'low'
    };
  }

  // Generate specific outreach based on signal
  const topOpportunity = opportunities[0];
  
  const templates = {
    frustration: {
      type: 'solution_offer',
      message: `Hey ${lead.authorName || lead.authorHandle}, saw your post about ${topOpportunity.context?.slice(0, 50)}... We hear this a lot. Our verified combines give coaches objective data — might solve the ${topOpportunity.keyword} issue. Worth a quick chat?`,
      priority: 'high'
    },
    
    seeking_help: {
      type: 'value_offer',
      message: `Hey ${lead.authorName || lead.authorHandle}, saw you're ${topOpportunity.keyword}... Happy to share how other ${lead.category === 'affiliate_coach' ? 'coaches' : 'clubs'} are using verified combine data. No pitch, just insights.`,
      priority: 'high'
    },
    
    upcoming_event: {
      type: 'event_opportunity',
      message: `Hey ${lead.authorName || lead.authorHandle}, saw your ${topOpportunity.keyword} post — exciting! Quick thought: verified combines could add value to your event (QR tracking, live leaderboards). Happy to discuss how.`,
      priority: 'high'
    },
    
    celebration: {
      type: 'congratulations',
      message: `Hey ${lead.authorName || lead.authorHandle}, ${topOpportunity.keyword} on the recent success! Love seeing great basketball development. Would love to hear how you're tracking player progress — are you using any tech or still old-school?`,
      priority: 'medium'
    },
    
    engagement: {
      type: 'conversation',
      message: `Hey ${lead.authorName || lead.authorHandle}, ${topOpportunity.context?.slice(0, 60)}... Great question. From our work with combines, we've seen that verified data (not AI guesswork) makes the biggest difference. What's your take?`,
      priority: 'medium'
    }
  };

  return templates[topOpportunity.type] || templates.follow_up;
}

// Main tracking
async function trackLeadActivity() {
  console.log(`[${DATE}] Starting lead activity tracking...\n`);
  
  const leads = loadAllLeads();
  console.log(`Loaded ${leads.length} unique leads\n`);
  
  const activityReports = [];
  const highPriorityLeads = [];

  // Process each lead (limit to avoid rate limits)
  const leadsToProcess = leads.slice(0, 10); // Process 10 per run
  
  for (let i = 0; i < leadsToProcess.length; i++) {
    const lead = leadsToProcess[i];
    console.log(`[${i + 1}/${leadsToProcess.length}] Checking @${lead.authorHandle}...`);
    
    try {
      // Get recent tweets
      const tweets = getUserTweets(lead.authorHandle, 5);
      
      if (tweets.length === 0) {
        console.log(`  No recent tweets or private account`);
        continue;
      }

      // Analyze for opportunities
      const allOpportunities = [];
      for (const tweet of tweets) {
        const ops = analyzeTweet(tweet, lead);
        allOpportunities.push(...ops);
      }

      // Generate updated outreach
      const recentActivity = { tweets, opportunities: allOpportunities };
      const outreach = generateUpdatedOutreach(lead, recentActivity);

      const report = {
        handle: lead.authorHandle,
        name: lead.authorName,
        category: lead.category,
        lastChecked: DATE,
        tweetCount: tweets.length,
        opportunities: allOpportunities,
        updatedOutreach: outreach,
        recentTweets: tweets.map(t => ({
          text: t.text?.slice(0, 100),
          date: t.created_at,
          url: `https://twitter.com/${lead.authorHandle}/status/${t.id || t.id_str}`
        }))
      };

      activityReports.push(report);

      if (outreach.priority === 'high') {
        highPriorityLeads.push(report);
      }

      console.log(`  ✓ ${tweets.length} tweets, ${allOpportunities.length} opportunities, Priority: ${outreach.priority}`);
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 3000));
      
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }

  // Save reports
  const outputFile = path.join(ACTIVITY_DIR, `${DATE}-activity.json`);
  fs.writeFileSync(outputFile, JSON.stringify(activityReports, null, 2));

  // Generate summary
  const summary = {
    date: DATE,
    leadsChecked: leadsToProcess.length,
    leadsWithActivity: activityReports.length,
    highPriorityOpportunities: highPriorityLeads.length,
    topOpportunities: highPriorityLeads.slice(0, 5).map(l => ({
      handle: l.handle,
      name: l.name,
      category: l.category,
      opportunityType: l.opportunities[0]?.type,
      outreach: l.updatedOutreach.message.slice(0, 100)
    }))
  };

  const summaryFile = path.join(ACTIVITY_DIR, `${DATE}-summary.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

  // Print report
  console.log('\n=== LEAD ACTIVITY REPORT ===');
  console.log(`Date: ${DATE}`);
  console.log(`Leads checked: ${summary.leadsChecked}`);
  console.log(`With recent activity: ${summary.leadsWithActivity}`);
  console.log(`High priority: ${summary.highPriorityOpportunities}`);
  
  if (summary.highPriorityOpportunities > 0) {
    console.log('\n🔥 HIGH PRIORITY OUTREACH:');
    summary.topOpportunities.forEach((opp, i) => {
      console.log(`\n${i + 1}. @${opp.handle} (${opp.name})`);
      console.log(`   Type: ${opp.opportunityType}`);
      console.log(`   Outreach: ${opp.outreach}...`);
    });
  }

  console.log(`\nFiles saved:`);
  console.log(`  Activity: ${outputFile}`);
  console.log(`  Summary: ${summaryFile}`);
}

trackLeadActivity().catch(console.error);
