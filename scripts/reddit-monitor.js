#!/usr/bin/env node
/**
 * CourtLab Reddit Monitor
 * Scours basketball-related subreddits for leads, opportunities, and intel
 * Run: node reddit-monitor.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const WORKSPACE = '/data/.openclaw/workspace/courtlab-crm';
const OUTPUT_DIR = path.join(WORKSPACE, 'reddit-monitoring');
const DATE = new Date().toISOString().split('T')[0];

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Subreddits to monitor
const SUBREDDITS = [
  'basketball',
  'BasketballTips',
  'basketballcoach',
  'youthsports',
  'Adelaide',
  'melbourne',
  'sports',
  'SportsAnalytics'
];

// Keywords to watch for
const KEYWORDS = [
  'basketball training',
  'basketball coach',
  'youth basketball',
  'basketball app',
  'track stats',
  'player development',
  'basketball combine',
  'tryouts',
  'basketball trials',
  'basketball camp',
  'coaching advice',
  'basketball technology',
  'looking for coach',
  'basketball parent',
  'au basketball',
  'australia basketball'
];

// Fetch Reddit JSON
function fetchReddit(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.reddit.com',
      path: url,
      method: 'GET',
      headers: {
        'User-Agent': 'CourtLab-Monitor/1.0 (Research Bot)',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Score a post for relevance
function scorePost(post) {
  let score = 0;
  const title = (post.title || '').toLowerCase();
  const selftext = (post.selftext || '').toLowerCase();
  const combined = title + ' ' + selftext;

  // Keyword matching
  for (const keyword of KEYWORDS) {
    if (combined.includes(keyword.toLowerCase())) {
      score += 10;
    }
  }

  // Engagement
  if (post.ups > 50) score += 5;
  if (post.ups > 100) score += 10;
  if (post.num_comments > 10) score += 5;
  if (post.num_comments > 50) score += 10;

  // Australia relevance
  if (combined.includes('australia') || combined.includes('adelaide') || 
      combined.includes('melbourne') || combined.includes('sydney') ||
      combined.includes('au') || combined.includes('oz')) {
    score += 15;
  }

  // Recency bonus
  const postAge = (Date.now() / 1000) - post.created_utc;
  const hoursAgo = postAge / 3600;
  if (hoursAgo < 24) score += 10;
  if (hoursAgo < 48) score += 5;

  return score;
}

// Generate outreach suggestion
function generateOutreach(post, score) {
  const templates = {
    coach_seeking: `Saw your post about ${post.title.slice(0, 50)}... We work with basketball coaches on verified combine systems — QR-based tracking, live leaderboards. Happy to share how other coaches are using it if you're curious.`,
    
    parent_question: `Saw your question about ${post.title.slice(0, 50)}... As a basketball parent myself (son plays U12s), I've been through this. We're building verified combine data to help parents make informed decisions.`,
    
    tech_question: `Saw your post about ${post.title.slice(0, 50)}... We're working on verified combine systems (not AI guesswork) for grassroots basketball in Australia. Would love your perspective on what data matters most.`,
    
    general: `Saw your post about ${post.title.slice(0, 50)}... Love your insights on basketball development. We're building verified combine systems for U12-U18 players in Australia. What data do you wish you had access to?`
  };

  const title = post.title.toLowerCase();
  const text = (post.selftext || '').toLowerCase();

  if (title.includes('coach') || text.includes('coach')) return templates.coach_seeking;
  if (title.includes('parent') || text.includes('parent') || text.includes('son') || text.includes('daughter')) return templates.parent_question;
  if (title.includes('app') || title.includes('track') || title.includes('stats') || title.includes('technology')) return templates.tech_question;
  
  return templates.general;
}

// Main monitoring
async function monitorReddit() {
  console.log(`[${DATE}] Starting Reddit monitoring...\n`);
  
  const allPosts = [];
  const warmPosts = [];

  for (const subreddit of SUBREDDITS) {
    try {
      console.log(`Scanning r/${subreddit}...`);
      
      // Get hot posts
      const hotData = await fetchReddit(`/r/${subreddit}/hot.json?limit=25`);
      if (hotData.data && hotData.data.children) {
        hotData.data.children.forEach(child => {
          allPosts.push({ ...child.data, source: 'hot', subreddit });
        });
      }

      // Get new posts
      const newData = await fetchReddit(`/r/${subreddit}/new.json?limit=25`);
      if (newData.data && newData.data.children) {
        newData.data.children.forEach(child => {
          allPosts.push({ ...child.data, source: 'new', subreddit });
        });
      }

      // Rate limiting - be nice to Reddit
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (error) {
      console.error(`Error scanning r/${subreddit}:`, error.message);
    }
  }

  // Remove duplicates
  const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());

  console.log(`\nTotal posts scanned: ${uniquePosts.length}`);

  // Score and filter
  for (const post of uniquePosts) {
    const score = scorePost(post);
    if (score >= 20) {
      warmPosts.push({
        id: post.id,
        title: post.title,
        author: post.author,
        subreddit: post.subreddit,
        url: `https://reddit.com${post.permalink}`,
        score,
        ups: post.ups,
        comments: post.num_comments,
        created: new Date(post.created_utc * 1000).toISOString(),
        selftext: post.selftext?.slice(0, 500),
        outreach: generateOutreach(post, score),
        status: 'identified'
      });
    }
  }

  // Sort by score
  warmPosts.sort((a, b) => b.score - a.score);

  console.log(`Warm posts found: ${warmPosts.length}`);

  // Save results
  const outputFile = path.join(OUTPUT_DIR, `${DATE}-reddit-posts.json`);
  fs.writeFileSync(outputFile, JSON.stringify(warmPosts, null, 2));

  // Generate report
  const report = {
    date: DATE,
    subredditsScanned: SUBREDDITS.length,
    totalPosts: uniquePosts.length,
    warmPosts: warmPosts.length,
    bySubreddit: {},
    topPosts: warmPosts.slice(0, 10).map(p => ({
      title: p.title.slice(0, 80),
      author: p.author,
      subreddit: p.subreddit,
      score: p.score,
      url: p.url
    }))
  };

  // Count by subreddit
  warmPosts.forEach(p => {
    report.bySubreddit[p.subreddit] = (report.bySubreddit[p.subreddit] || 0) + 1;
  });

  const reportFile = path.join(OUTPUT_DIR, `${DATE}-reddit-report.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n=== REDDIT MONITORING REPORT ===');
  console.log(`Date: ${DATE}`);
  console.log(`Subreddits: ${SUBREDDITS.join(', ')}`);
  console.log(`Posts scanned: ${uniquePosts.length}`);
  console.log(`Warm posts: ${warmPosts.length}`);
  
  console.log('\nBy Subreddit:');
  Object.entries(report.bySubreddit).forEach(([sub, count]) => {
    console.log(`  r/${sub}: ${count}`);
  });

  console.log('\nTop 5 Posts:');
  report.topPosts.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i+1}. r/${p.subreddit} - ${p.title.slice(0, 60)}... (Score: ${p.score})`);
  });

  console.log(`\nFiles saved:`);
  console.log(`  Posts: ${outputFile}`);
  console.log(`  Report: ${reportFile}`);

  return { warmPosts, report };
}

monitorReddit().catch(console.error);
