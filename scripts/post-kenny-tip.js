#!/usr/bin/env node
/**
 * Post Kenny's Tips
 * Daily tip from Kenny the Kookaburra mascot
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/data/.openclaw/workspace/courtlabops-repo';
const TIPS_FILE = path.join(WORKSPACE, 'content-calendar/kennys-tips/tips-01-20.json');

// Brand account credentials
const AUTH_TOKEN = 'c35e12f3c608bafbea85ece9812081d8fae319cc';
const CT0 = '6a3a200bef31bdbacfed03dce39c607527dfdd1eb63517274fa76f4fa52edb40610cd7cf9838748e4f7ee97fc572088413e021f1fbfd4f119bd3c4a11e32f3ff1d02a79cdb5ecaccc15a84b6fd9bb187';

function loadTips() {
  return JSON.parse(fs.readFileSync(TIPS_FILE, 'utf8'));
}

function saveTips(tips) {
  fs.writeFileSync(TIPS_FILE, JSON.stringify(tips, null, 2));
}

function getNextTip() {
  const tips = loadTips();
  return tips.find(t => !t.posted);
}

function postTip(tip) {
  try {
    const cmd = `export AUTH_TOKEN="${AUTH_TOKEN}" && export CT0="${CT0}" && bird tweet "${tip.content.replace(/"/g, '\\"')}"`;
    
    console.log(`Posting Kenny's Tip #${tip.number}: ${tip.title}`);
    console.log(`Content: ${tip.content.slice(0, 80)}...`);
    
    // For now, simulate
    console.log('✅ Simulated post');
    return { success: true, simulated: true };
    
    // Uncomment for real posting:
    // const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    // return { success: true, output: result };
    
  } catch (error) {
    console.error('Failed to post:', error.message);
    return { success: false, error: error.message };
  }
}

function markAsPosted(tip) {
  const tips = loadTips();
  const index = tips.findIndex(t => t.number === tip.number);
  if (index !== -1) {
    tips[index].posted = true;
    tips[index].postedAt = new Date().toISOString();
    saveTips(tips);
  }
}

function main() {
  console.log('=== Kenny\'s Tip Daily Post ===\n');
  
  const tip = getNextTip();
  
  if (!tip) {
    console.log('❌ No unposted tips found. Generate more!');
    return;
  }
  
  console.log(`Found Tip #${tip.number}: ${tip.title}\n`);
  
  const result = postTip(tip);
  
  if (result.success) {
    markAsPosted(tip);
    console.log(`\n✅ Kenny's Tip #${tip.number} marked as posted`);
  } else {
    console.log(`\n❌ Failed to post tip #${tip.number}`);
  }
  
  // Show remaining
  const tips = loadTips();
  const remaining = tips.filter(t => !t.posted).length;
  console.log(`\nRemaining tips: ${remaining}/${tips.length}`);
}

main();
