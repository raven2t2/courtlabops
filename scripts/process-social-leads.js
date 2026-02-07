#!/usr/bin/env node
/**
 * CourtLab Social Lead Processor
 * Processes bird search results, identifies warm leads, generates DM templates
 * Run: node process-social-leads.js 2026-02-07
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/data/.openclaw/workspace/courtlab-crm';
const date = process.argv[2] || new Date().toISOString().split('T')[0];
const INPUT_DIR = path.join(WORKSPACE, 'social-listening', date);
const OUTPUT_DIR = path.join(WORKSPACE, 'social-leads');

// Warm signal keywords
const WARM_KEYWORDS = [
  'training', 'coach', 'development', 'skills', 'drills', 'tryouts',
  'registration', 'club', 'team', 'players', 'athletes', 'basketball',
  'frustrated', 'struggling', 'looking for', 'recommendation', 'help'
];

// Red flag keywords
const RED_FLAGS = [
  'NBA', 'NCAA', 'nfl', 'mlb', 'crypto', 'nft', 'gambling', 'betting'
];

// Read all search results
function loadSearchResults() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));
  const allTweets = [];
  
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(INPUT_DIR, file), 'utf8'));
      const category = file.replace('.json', '');
      
      if (Array.isArray(data)) {
        data.forEach(tweet => {
          allTweets.push({ ...tweet, _category: category });
        });
      }
    } catch (e) {
      console.error(`Error loading ${file}:`, e.message);
    }
  }
  
  return allTweets;
}

// Score a tweet for warmth
function scoreTweet(tweet) {
  let score = 0;
  const text = (tweet.text || tweet.full_text || '').toLowerCase();
  const author = tweet.author || tweet.user || {};
  
  // Keyword matching
  for (const keyword of WARM_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      score += 5;
    }
  }
  
  // Red flag checking
  for (const flag of RED_FLAGS) {
    if (text.includes(flag.toLowerCase())) {
      score -= 20;
    }
  }
  
  // Engagement signals
  const likes = tweet.likes || tweet.favorite_count || 0;
  const retweets = tweet.retweets || tweet.retweet_count || 0;
  const replies = tweet.replies || tweet.reply_count || 0;
  
  if (likes > 10) score += 3;
  if (likes > 50) score += 5;
  if (retweets > 5) score += 5;
  if (replies > 3) score += 3;
  
  // Follower count sweet spot (1K-50K)
  const followers = author.followers_count || author.followers || 0;
  if (followers >= 1000 && followers <= 50000) {
    score += 10;
  } else if (followers > 50000 && followers <= 100000) {
    score += 5;
  } else if (followers < 100) {
    score -= 10;
  }
  
  // Recent activity bonus
  const tweetDate = new Date(tweet.created_at || Date.now());
  const hoursAgo = (Date.now() - tweetDate.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 24) {
    score += 5;
  }
  
  return {
    score,
    followers,
    likes,
    retweets,
    replies,
    isWarm: score >= 20,
    isHighValue: score >= 35
  };
}

// Categorize the lead
function categorizeLead(tweet, category) {
  const text = (tweet.text || '').toLowerCase();
  
  if (category.includes('coach') || category.includes('training')) {
    return 'affiliate_coach';
  }
  if (category.includes('creator')) {
    return 'affiliate_creator';
  }
  if (category.includes('club') || category.includes('association')) {
    return 'customer_club';
  }
  if (category.includes('trials') || category.includes('tournament')) {
    return 'customer_event';
  }
  if (text.includes('parent') || text.includes('son') || text.includes('daughter')) {
    return 'customer_parent';
  }
  
  return 'prospect_general';
}

// Generate DM template based on category
function generateDM(lead) {
  const templates = {
    affiliate_coach: `Hey ${lead.authorName}, saw your post about ${lead.topicSnippet}. 

Love the work you're doing with young athletes. Quick question — are you using any tech to track player development, or still old-school clipboard style?

— Michael
CourtLab`,

    affiliate_creator: `Hey ${lead.authorName}, your basketball content is solid — especially the ${lead.topicSnippet}.

We're running verified combines across Adelaide (think NBA combine for grassroots). QR-based tracking, live leaderboards, the works.

Would love to have you check one out — content gold for your channel, and we can cross-promote your stuff to our athlete network.

No pressure, just thought it might be a fit.

— Michael
CourtLab`,

    customer_club: `Hi ${lead.authorName}, saw your post about ${lead.topicSnippet}.

Quick question — how are you currently tracking player development data across your program? 

We've been working with clubs on verified combine systems (vertical, agility, shooting) — gives coaches objective data and parents love the transparency.

Not sure if it's a fit for your club, but happy to share how other clubs are using it if you're curious.

— Michael
CourtLab`,

    customer_event: `Hi ${lead.authorName}, saw your post about ${lead.topicSnippet}.

We're partnering with basketball clubs to run verified combines at events like yours — QR-based shot tracking, live leaderboards on big screens, professional data capture.

Could be a value-add for your ${lead.topicSnippet} — gives athletes verified combine data and creates social media moments.

Worth a quick conversation?

— Michael
CourtLab`,

    customer_parent: `Hey ${lead.authorName}, saw your post about ${lead.topicSnippet}.

As a basketball parent myself (son plays U12s), I get the journey.

We're building verified combine systems to give parents objective data on their athlete's development — not just "looks good in practice" but actual vertical, agility, shooting numbers.

Would love your perspective as a basketball parent — does this sound useful?

— Michael
CourtLab`,

    prospect_general: `Hey ${lead.authorName}, saw your post about ${lead.topicSnippet}. Love your insights on basketball development.

We're working on verified combine systems for grassroots basketball in Australia — think NBA combine experience for U12-U18 players.

Would love your take on what matters most for player development tracking. What data do you wish you had?

— Michael
CourtLab`
  };
  
  return templates[lead.category] || templates.prospect_general;
}

// Main processing
async function processLeads() {
  console.log(`Processing social leads for ${date}...`);
  
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`No data found for ${date}. Run daily-social-listen.sh first.`);
    process.exit(1);
  }
  
  const tweets = loadSearchResults();
  console.log(`Loaded ${tweets.length} tweets`);
  
  const processedLeads = [];
  
  for (const tweet of tweets) {
    const author = tweet.author || tweet.user || {};
    const scoring = scoreTweet(tweet);
    const category = categorizeLead(tweet, tweet._category || 'general');
    
    // Extract topic snippet from text
    const text = tweet.text || tweet.full_text || '';
    const sentences = text.split(/[.!?]+/).filter(s => s.length > 10);
    const topicSnippet = sentences[0]?.slice(0, 60) + (sentences[0]?.length > 60 ? '...' : '') || 'basketball';
    
    const lead = {
      id: tweet.id || tweet.id_str,
      authorHandle: author.username || author.screen_name,
      authorName: author.name,
      authorBio: author.description || '',
      followers: scoring.followers,
      tweetUrl: `https://twitter.com/${author.username || author.screen_name}/status/${tweet.id || tweet.id_str}`,
      tweetText: text,
      tweetDate: tweet.created_at,
      category,
      searchCategory: tweet._category,
      score: scoring.score,
      isWarm: scoring.isWarm,
      isHighValue: scoring.isHighValue,
      engagement: {
        likes: scoring.likes,
        retweets: scoring.retweets,
        replies: scoring.replies
      },
      topicSnippet,
      dmTemplate: '',
      status: 'identified',
      discoveredDate: date,
      lastChecked: new Date().toISOString()
    };
    
    if (lead.isWarm) {
      lead.dmTemplate = generateDM(lead);
      processedLeads.push(lead);
    }
  }
  
  // Sort by score descending
  processedLeads.sort((a, b) => b.score - a.score);
  
  // Save results
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const outputFile = path.join(OUTPUT_DIR, `${date}-leads.json`);
  fs.writeFileSync(outputFile, JSON.stringify(processedLeads, null, 2));
  
  // Generate daily report
  const warmLeads = processedLeads.filter(l => l.isWarm);
  const highValueLeads = processedLeads.filter(l => l.isHighValue);
  
  const report = {
    date,
    totalTweetsScanned: tweets.length,
    warmLeadsFound: warmLeads.length,
    highValueLeads: highValueLeads.length,
    byCategory: {
      affiliate_coach: warmLeads.filter(l => l.category === 'affiliate_coach').length,
      affiliate_creator: warmLeads.filter(l => l.category === 'affiliate_creator').length,
      customer_club: warmLeads.filter(l => l.category === 'customer_club').length,
      customer_event: warmLeads.filter(l => l.category === 'customer_event').length,
      customer_parent: warmLeads.filter(l => l.category === 'customer_parent').length,
      prospect_general: warmLeads.filter(l => l.category === 'prospect_general').length
    },
    topLeads: warmLeads.slice(0, 10).map(l => ({
      handle: l.authorHandle,
      name: l.authorName,
      score: l.score,
      category: l.category,
      followers: l.followers,
      snippet: l.topicSnippet
    })),
    outputFile,
    nextAction: 'Review leads in CRM and approve DMs to send'
  };
  
  const reportFile = path.join(OUTPUT_DIR, `${date}-report.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n=== DAILY SOCIAL LEADS REPORT ===');
  console.log(`Date: ${date}`);
  console.log(`Tweets scanned: ${tweets.length}`);
  console.log(`Warm leads found: ${warmLeads.length}`);
  console.log(`High-value leads: ${highValueLeads.length}`);
  console.log('\nBy Category:');
  Object.entries(report.byCategory).forEach(([cat, count]) => {
    if (count > 0) console.log(`  ${cat}: ${count}`);
  });
  console.log('\nTop 5 Leads:');
  report.topLeads.slice(0, 5).forEach((lead, i) => {
    console.log(`  ${i + 1}. @${lead.handle} (${lead.name}) - Score: ${lead.score} - ${lead.category}`);
  });
  console.log(`\nFull report: ${reportFile}`);
  console.log(`Leads data: ${outputFile}`);
  console.log('\nNext: Review leads and approve DMs to send');
}

processLeads().catch(console.error);
