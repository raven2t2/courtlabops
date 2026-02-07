/**
 * Daily Content Generator
 * Automatically creates posts from gallery assets
 */

const fs = require('fs').promises;
const path = require('path');

const QUEUE_FILE = path.join(process.cwd(), 'data', 'post-queue.json');
const GALLERY_DIR = path.join(process.cwd(), 'shared', 'gallery', '21d9a9dc4a781c60ae3b55b059b31890');
const MANIFEST_FILE = path.join(GALLERY_DIR, 'manifest.json');

// Post templates by category
const TEMPLATES = {
  brand: {
    twitter: [
      "Become undeniable. That's not just our tagline — it's what happens when you combine verified data with elite coaching.",
      "We aren't trying to replace coaches. We're giving them the one thing they can't argue with: The Truth.",
      "300+ drills. Verified combines. Scout-ready PDFs. This is CourtLab.",
    ],
    instagram: [
      "The future of basketball development is here. Verified combines. Live leaderboards. Scout-ready data. Become undeniable. 🏀✨",
      "Stop guessing. Start tracking. Every shot. Every drill. Every improvement. Link in bio. 👆",
    ],
    facebook: [
      "CourtLab is building the digital infrastructure for elite basketball development. Our verified combines give players the data they need to improve and the exposure they need to get noticed.",
    ],
  },
  training: {
    twitter: [
      "This drill looks simple. The data behind it isn't. {description}",
      "Elite players don't just practice. They track. They adjust. They improve. {description}",
    ],
    instagram: [
      "Today's drill: {title}. Swipe for the breakdown. Save this for your next workout. 💪",
      "Kenny's Tip #{number}: {description} Try it today and tag us in your results! 🏀",
    ],
    facebook: [
      "Training tip for parents and coaches: {description} Help your player develop with verified data.",
    ],
  },
  combine: {
    twitter: [
      "The ARC Campbelltown. April 3-6. 300+ players. Live leaderboards. This is how you get noticed.",
      "Easter Classic 2026 isn't just a tournament. It's a verified combine where your stats matter.",
    ],
    instagram: [
      "8 weeks until Easter Classic 2026 🐰🏀 Live leaderboards. Verified combines. Scout-ready data. This is your moment. Link in bio to register.",
    ],
    facebook: [
      "Easter Classic 2026 (April 3-6, The ARC Campbelltown) is bringing verified combines to South Australian basketball. 300+ players. Live leaderboards. Scout-ready PDFs distributed to college recruiters.",
    ],
  },
  testimonial: {
    twitter: [
      "\"{quote}\" — CourtLab player after 4 weeks of tracked training.",
    ],
    instagram: [
      "Real players. Real results. {description} 🏆",
    ],
    facebook: [
      "Parent testimonial: {description} See why families trust CourtLab for their player's development.",
    ],
  },
};

const HASHTAGS = {
  twitter: ['#basketballtraining', '#playerdev', '#courtlab', '#verifieddata', '#becomeundeniable'],
  instagram: ['#basketballtraining', '#youthbasketball', '#basketballaustralia', '#courtlab', '#combinetraining', '#playerdev', '#becomeundeniable'],
  facebook: ['#EasterClassic', '#BasketballSA', '#YouthBasketball'],
};

async function loadQueue() {
  try {
    const data = await fs.readFile(QUEUE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveQueue(queue) {
  await fs.mkdir(path.dirname(QUEUE_FILE), { recursive: true });
  await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

async function loadManifest() {
  try {
    const data = await fs.readFile(MANIFEST_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    console.error('Manifest not found');
    return { items: [] };
  }
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length];
}

function generatePost(asset, platform, date, hour) {
  const category = asset.category || 'brand';
  const templates = TEMPLATES[category]?.[platform] || TEMPLATES.brand[platform];
  
  let caption = getRandomItem(templates);
  caption = caption.replace('{title}', asset.title || '');
  caption = caption.replace('{description}', asset.prompt?.slice(0, 100) || '');
  caption = caption.replace('{quote}', 'My shot improved 23% in 4 weeks');
  caption = caption.replace('{number}', Math.floor(Math.random() * 20) + 1);
  
  const scheduledTime = new Date(date);
  scheduledTime.setHours(hour, 0, 0, 0);
  
  return {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    platform,
    type: platform === 'instagram' && asset.type === 'video' ? 'reel' : 'feed',
    status: 'pending',
    scheduledTime: scheduledTime.toISOString(),
    caption,
    mediaUrls: asset.filename ? [`${GALLERY_DIR}/assets/${asset.filename}`] : undefined,
    hashtags: HASHTAGS[platform],
    createdAt: new Date().toISOString(),
  };
}

async function generateDailyPosts(targetDate) {
  console.log(`Generating posts for ${targetDate}`);
  
  const queue = await loadQueue();
  const manifest = await loadManifest();
  
  // Filter unused assets
  const usedAssets = new Set(queue.map(p => p.mediaUrls?.[0]).filter(Boolean));
  const availableAssets = manifest.items?.filter(item => !usedAssets.has(item.filename)) || [];
  
  console.log(`Available assets: ${availableAssets.length}`);
  
  // Schedule for the day
  const schedule = [
    { platform: 'twitter', hour: 9 },
    { platform: 'instagram', hour: 11, type: 'reel' },
    { platform: 'facebook', hour: 14 },
    { platform: 'twitter', hour: 16 },
    { platform: 'instagram', hour: 18, type: 'story' },
    { platform: 'twitter', hour: 20 },
  ];
  
  let postCount = 0;
  
  for (const slot of schedule) {
    // Find matching asset
    const assetType = slot.type === 'reel' ? 'video' : 'image';
    const matchingAssets = availableAssets.filter(a => 
      (slot.type === 'reel' ? a.type === 'video' : true) &&
      !usedAssets.has(a.filename)
    );
    
    if (matchingAssets.length === 0) continue;
    
    const asset = getRandomItem(matchingAssets);
    usedAssets.add(asset.filename);
    
    const post = generatePost(asset, slot.platform, targetDate, slot.hour);
    if (slot.type) post.type = slot.type;
    
    queue.push(post);
    postCount++;
    
    console.log(`Created ${slot.platform} post for ${slot.hour}:00`);
  }
  
  await saveQueue(queue);
  console.log(`Generated ${postCount} posts for ${targetDate}`);
  console.log(`Total queue size: ${queue.length}`);
}

// Run if called directly
if (require.main === module) {
  const targetDate = process.argv[2] || new Date().toISOString().split('T')[0];
  generateDailyPosts(targetDate).catch(console.error);
}

module.exports = { generateDailyPosts };
