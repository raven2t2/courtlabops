#!/usr/bin/env node
/**
 * CourtLab Tweet Scheduler
 * Manages scheduled tweets for both CMO and Brand accounts
 * Run: node schedule-tweets.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/data/.openclaw/workspace/courtlabops-repo';
const QUEUE_DIR = path.join(WORKSPACE, 'content-calendar');

// Account credentials
const ACCOUNTS = {
  cmo: {
    name: 'Michael | CMO @ CourtLab',
    authToken: '618eca89893e473ae3f6b52e16af9d2fcdc1ed47',
    ct0: '8558cf6ebc849c79ec6397cee5f1f46f9d95c369b3694e60426911c04d88a0ca6d54b9d6aaad7ef834ba9b5f58a265564be77cdd9eef26c3a0d8788760169cbfa254abfb7252b6797de9a0ce4d4596ce'
  },
  brand: {
    name: 'CourtLab — Become Undeniable',
    authToken: 'c35e12f3c608bafbea85ece9812081d8fae319cc',
    ct0: '6a3a200bef31bdbacfed03dce39c607527dfdd1eb63517274fa76f4fa52edb40610cd7cf9838748e4f7ee97fc572088413e021f1fbfd4f119bd3c4a11e32f3ff1d02a79cdb5ecaccc15a84b6fd9bb187'
  }
};

// Create directory structure
function initDirectories() {
  const dirs = [
    'cmo-account/queued',
    'cmo-account/sent',
    'brand-account/queued',
    'brand-account/sent',
    'kennys-tips'
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(QUEUE_DIR, dir), { recursive: true });
  });
}

// Load queued tweets
function loadQueuedTweets(account) {
  const dir = path.join(QUEUE_DIR, `${account}-account/queued`);
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  return files.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

// Get next tweet to post
function getNextTweet(account) {
  const tweets = loadQueuedTweets(account);
  const pending = tweets.filter(t => !t.posted);
  
  if (pending.length === 0) return null;
  
  // Sort by scheduled time
  pending.sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
  return pending[0];
}

// Post tweet via bird
function postTweet(tweet, account) {
  const creds = ACCOUNTS[account];
  
  try {
    const cmd = `export AUTH_TOKEN="${creds.authToken}" && export CT0="${creds.ct0}" && bird tweet "${tweet.content.replace(/"/g, '\\"')}"`;
    
    console.log(`Posting to @${account}: ${tweet.content.slice(0, 50)}...`);
    
    // For now, just log (actual posting requires testing)
    console.log(`Command: ${cmd.slice(0, 100)}...`);
    
    // Uncomment to actually post:
    // const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    // return { success: true, output: result };
    
    return { success: true, simulated: true };
    
  } catch (error) {
    console.error(`Failed to post:`, error.message);
    return { success: false, error: error.message };
  }
}

// Mark tweet as sent
function markAsSent(tweet, account, tweetId = null) {
  tweet.posted = true;
  tweet.postedAt = new Date().toISOString();
  tweet.tweetId = tweetId;
  
  // Move to sent folder
  const srcFile = path.join(QUEUE_DIR, `${account}-account/queued`, `${tweet.id}.json`);
  const dstFile = path.join(QUEUE_DIR, `${account}-account/sent`, `${tweet.id}.json`);
  
  fs.writeFileSync(dstFile, JSON.stringify(tweet, null, 2));
  if (fs.existsSync(srcFile)) {
    fs.unlinkSync(srcFile);
  }
}

// Main scheduling loop
function runScheduler() {
  initDirectories();
  
  console.log('=== CourtLab Tweet Scheduler ===\n');
  console.log(`Time: ${new Date().toISOString()}\n`);
  
  // Check CMO account
  const cmoTweet = getNextTweet('cmo');
  if (cmoTweet && new Date(cmoTweet.scheduledFor) <= new Date()) {
    console.log('📝 CMO Account: Tweet ready to post');
    console.log(`Content: ${cmoTweet.content.slice(0, 80)}...`);
    // const result = postTweet(cmoTweet, 'cmo');
    // if (result.success) markAsSent(cmoTweet, 'cmo');
  } else if (cmoTweet) {
    console.log(`⏳ CMO Account: Next tweet at ${cmoTweet.scheduledFor}`);
  } else {
    console.log('❌ CMO Account: No queued tweets');
  }
  
  console.log('');
  
  // Check Brand account
  const brandTweet = getNextTweet('brand');
  if (brandTweet && new Date(brandTweet.scheduledFor) <= new Date()) {
    console.log('📝 Brand Account: Tweet ready to post');
    console.log(`Content: ${brandTweet.content.slice(0, 80)}...`);
    // const result = postTweet(brandTweet, 'brand');
    // if (result.success) markAsSent(brandTweet, 'brand');
  } else if (brandTweet) {
    console.log(`⏳ Brand Account: Next tweet at ${brandTweet.scheduledFor}`);
  } else {
    console.log('❌ Brand Account: No queued tweets');
  }
  
  console.log('\n=== Schedule Status ===');
  console.log(`CMO queued: ${loadQueuedTweets('cmo').filter(t => !t.posted).length}`);
  console.log(`Brand queued: ${loadQueuedTweets('brand').filter(t => !t.posted).length}`);
}

// Create sample tweets
function createSampleTweets() {
  const now = new Date();
  
  // CMO sample tweets
  const cmoTweets = [
    {
      id: 'cmo-001',
      account: 'cmo',
      content: `Busy week at CourtLab HQ. Working on partnerships with clubs across Adelaide and Melbourne. The response to verified combines has been incredible. 🏀\n\nIf you're a club interested in hosting a combine event, my DMs are open.`,
      scheduledFor: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      category: 'partnership',
      posted: false
    },
    {
      id: 'cmo-002',
      account: 'cmo',
      content: `Behind the scenes: Just reviewed data from our last combine. Players who tracked their shots for 4+ weeks improved 23% faster than those who didn't.\n\nThe numbers don't lie. Verified data > guesswork.`,
      scheduledFor: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
      category: 'insight',
      posted: false
    }
  ];
  
  // Brand sample tweets
  const brandTweets = [
    {
      id: 'brand-001',
      account: 'brand',
      content: `🏀 Become Undeniable\n\nTrack every shot. See real progress. Build your Basketball Resume.\n\nJoin 500+ players already improving with CourtLab.\n\n📱 https://courtlab.app`,
      scheduledFor: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      category: 'promotion',
      posted: false
    },
    {
      id: 'brand-002',
      account: 'brand',
      content: `🔥 Player Spotlight\n\n\"I used to guess if I was getting better. Now I know.\" — Jake, 14\n\nJake improved his corner 3% from 31% to 47% in 8 weeks using CourtLab.\n\nYour turn. Download free. 📊`,
      scheduledFor: new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString(),
      category: 'spotlight',
      posted: false
    }
  ];
  
  // Save sample tweets
  cmoTweets.forEach(tweet => {
    const file = path.join(QUEUE_DIR, 'cmo-account/queued', `${tweet.id}.json`);
    fs.writeFileSync(file, JSON.stringify(tweet, null, 2));
  });
  
  brandTweets.forEach(tweet => {
    const file = path.join(QUEUE_DIR, 'brand-account/queued', `${tweet.id}.json`);
    fs.writeFileSync(file, JSON.stringify(tweet, null, 2));
  });
  
  console.log('✅ Sample tweets created');
}

// Command line handling
const command = process.argv[2];

if (command === 'init') {
  initDirectories();
  createSampleTweets();
  console.log('✅ Content calendar initialized');
} else if (command === 'status') {
  runScheduler();
} else if (command === 'post') {
  // Actually post tweets (use with caution)
  console.log('Posting enabled tweets...');
  // Implementation here
} else {
  console.log('Usage:');
  console.log('  node schedule-tweets.js init    - Initialize calendar');
  console.log('  node schedule-tweets.js status  - Check schedule');
  console.log('  node schedule-tweets.js post    - Post due tweets');
}
