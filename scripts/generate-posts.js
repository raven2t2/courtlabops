#!/usr/bin/env node
/**
 * Auto-generate posts from gallery assets
 * Queues posts for approval based on asset type and content
 */

const fs = require('fs');
const path = require('path');

// Load gallery manifest
const GALLERY_DIR = path.join(process.cwd(), 'shared', 'gallery', '21d9a9dc4a781c60ae3b55b059b31890');
const MANIFEST_PATH = path.join(GALLERY_DIR, 'manifest.json');
const QUEUE_PATH = path.join(process.cwd(), 'data', 'post-queue.json');

// Post templates by category
const TEMPLATES = {
  brand: [
    {
      caption: "This is what elite looks like. Verified data. Real improvement. No AI guesswork. #CourtLab #BecomeUndeniable",
      platforms: ['twitter', 'instagram', 'facebook'],
      hashtags: ['#basketballtraining', '#verifieddata', '#elite'],
    },
    {
      caption: "We don't track guesses. We track makes, misses, and everything that actually matters. #CourtLab",
      platforms: ['twitter', 'instagram'],
      hashtags: ['#basketball', '#tracking', '#data'],
    },
  ],
  training: [
    {
      caption: "Want to improve 23% faster? Stop guessing. Start tracking. Every rep counts when you can see the data. #KennysTips",
      platforms: ['twitter', 'instagram', 'facebook'],
      hashtags: ['#basketballtraining', '#playerdev', '#KennysTips'],
    },
    {
      caption: "The best players aren't the ones who practice most. They're the ones who practice with purpose. Track it. Improve it. #CourtLab",
      platforms: ['twitter', 'instagram'],
      hashtags: ['#basketball', '#training', '#improvement'],
    },
  ],
  combine: [
    {
      caption: "Verified combines. Scout-ready PDFs. Live leaderboards. This is how you get noticed. Easter Classic 2026. #EasterClassic",
      platforms: ['twitter', 'facebook'],
      hashtags: ['#EasterClassic', '#BasketballSA', '#combine'],
    },
    {
      caption: "300+ players. Big screens. Live data. The Easter Classic isn't just a tournament—it's your showcase. Apr 3-6. #EasterClassic",
      platforms: ['instagram', 'facebook'],
      hashtags: ['#EasterClassic', '#basketball', '#showcase'],
    },
  ],
  testimonial: [
    {
      caption: '"I finally saw what I was actually doing wrong. Not what I thought I was doing. That\'s the CourtLab difference."',
      platforms: ['twitter', 'instagram', 'facebook'],
      hashtags: ['#testimonial', '#CourtLab', '#improvement'],
    },
  ],
};

// Platform-specific caption adaptations
function adaptForPlatform(caption, platform, hashtags) {
  let adapted = caption;
  
  if (platform === 'twitter') {
    // Shorter for Twitter
    adapted = caption.split('.')[0] + '.';
    if (adapted.length > 240) {
      adapted = adapted.substring(0, 237) + '...';
    }
    // Twitter hashtags inline
    adapted += ' ' + hashtags.slice(0, 3).join(' ');
  }
  
  if (platform === 'instagram') {
    // Add "link in bio" reference
    if (!adapted.includes('link in bio')) {
      adapted += '\n\n👆 Link in bio to start tracking';
    }
    // Instagram hashtags at end
    adapted += '\n\n' + hashtags.join(' ');
  }
  
  if (platform === 'facebook') {
    // Longer form for Facebook
    adapted += '\n\n' + hashtags.join(' ');
  }
  
  return adapted;
}

// Determine post type from asset
function getPostType(asset, platform) {
  if (asset.type === 'video') {
    if (platform === 'instagram') return 'reel';
    return 'feed';
  }
  if (platform === 'instagram' && Math.random() > 0.7) return 'story';
  return 'feed';
}

// Generate posts from manifest
async function generatePosts() {
  console.log('[PostGenerator] Starting...');
  
  // Load manifest
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (e) {
    console.error('[PostGenerator] No manifest found, using sample data');
    // Create sample posts for demo
    manifest = {
      assets: [
        { id: 'sample-1', type: 'image', category: 'brand', title: 'Brand Asset 1' },
        { id: 'sample-2', type: 'video', category: 'training', title: 'Training Video 1' },
        { id: 'sample-3', type: 'image', category: 'combine', title: 'Combine Photo 1' },
      ]
    };
  }
  
  // Load existing queue
  let queue = [];
  try {
    queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'));
  } catch {}
  
  const postsCreated = [];
  
  // Generate posts for next 7 days
  const now = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    
    // Daily schedule
    const schedule = [
      { time: '09:00', platform: 'twitter', type: 'text' },
      { time: '10:00', platform: 'instagram', type: 'reel' },
      { time: '11:00', platform: 'instagram', type: 'story' },
      { time: '14:00', platform: 'facebook', type: 'image' },
      { time: '16:00', platform: 'twitter', type: 'image' },
      { time: '18:00', platform: 'instagram', type: 'feed' },
    ];
    
    for (const slot of schedule) {
      // Pick random asset
      const assets = manifest.assets || manifest;
      const asset = assets[Math.floor(Math.random() * assets.length)];
      
      // Skip if doesn't match slot type
      if (slot.type === 'reel' && asset.type !== 'video') continue;
      
      // Get template for category
      const categoryTemplates = TEMPLATES[asset.category] || TEMPLATES.brand;
      const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
      
      // Check if this platform is supported for this template
      if (!template.platforms.includes(slot.platform)) continue;
      
      // Adapt caption for platform
      const caption = adaptForPlatform(template.caption, slot.platform, template.hashtags);
      
      // Create scheduled time
      const scheduledTime = new Date(date);
      const [hours, minutes] = slot.time.split(':');
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Don't schedule in the past
      if (scheduledTime < now) continue;
      
      const post = {
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        platform: slot.platform,
        type: getPostType(asset, slot.platform),
        status: 'pending',
        scheduledTime: scheduledTime.toISOString(),
        caption: caption,
        mediaUrls: [`${asset.id}.${asset.type === 'video' ? 'mp4' : 'jpg'}`],
        hashtags: template.hashtags,
        assetIds: [asset.id],
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };
      
      queue.push(post);
      postsCreated.push({
        platform: slot.platform,
        type: post.type,
        time: slot.time,
        date: date.toDateString(),
      });
    }
  }
  
  // Save queue
  fs.mkdirSync(path.dirname(QUEUE_PATH), { recursive: true });
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  
  console.log(`[PostGenerator] Created ${postsCreated.length} posts`);
  console.log('[PostGenerator] Breakdown:');
  
  const byPlatform = {};
  postsCreated.forEach(p => {
    byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1;
  });
  
  Object.entries(byPlatform).forEach(([platform, count]) => {
    console.log(`  - ${platform}: ${count} posts`);
  });
  
  console.log('[PostGenerator] Done! Review at /approvals');
}

generatePosts().catch(console.error);
