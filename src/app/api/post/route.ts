import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const QUEUE_FILE = path.join(process.cwd(), 'data', 'post-queue.json');
const LOG_FILE = path.join(process.cwd(), 'data', 'post-log.json');

interface QueuedPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  type: 'feed' | 'story' | 'reel' | 'thread' | 'poll';
  status: 'pending' | 'approved' | 'rejected' | 'posted' | 'scheduled';
  scheduledTime: string;
  caption: string;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
  link?: string;
  createdAt: string;
  postedAt?: string;
  postedUrl?: string;
  error?: string;
}

async function getQueue(): Promise<QueuedPost[]> {
  try {
    const data = await readFile(QUEUE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveQueue(queue: QueuedPost[]): Promise<void> {
  await mkdir(path.dirname(QUEUE_FILE), { recursive: true });
  await writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

async function logPost(post: QueuedPost, result: any): Promise<void> {
  try {
    let logs: any[] = [];
    try {
      const data = await readFile(LOG_FILE, 'utf-8');
      logs = JSON.parse(data);
    } catch {}
    
    logs.push({
      timestamp: new Date().toISOString(),
      postId: post.id,
      platform: post.platform,
      result,
    });
    
    await mkdir(path.dirname(LOG_FILE), { recursive: true });
    await writeFile(LOG_FILE, JSON.stringify(logs.slice(-100), null, 2));
  } catch {}
}

type PostResult = { success: boolean; url?: string; error?: string; postId: string; platform: string; status?: string; wouldPost?: boolean };

// Post to Twitter using Bird CLI
async function postToTwitter(post: QueuedPost): Promise<PostResult> {
  try {
    const tweetText = post.caption + (post.hashtags ? '\n\n' + post.hashtags.join(' ') : '');
    
    // Use Bird CLI for posting
    const cmd = post.mediaUrls && post.mediaUrls.length > 0
      ? `bird tweet "${tweetText.replace(/"/g, '\\"')}" --media "${post.mediaUrls[0]}"`
      : `bird tweet "${tweetText.replace(/"/g, '\\"')}"`;
    
    const { stdout, stderr } = await execAsync(cmd);
    
    if (stderr && !stderr.includes('success')) {
      throw new Error(stderr);
    }
    
    // Extract tweet ID from output
    const match = stdout.match(/status\/(\d+)/);
    const tweetId = match ? match[1] : null;
    
    return {
      success: true,
      url: tweetId ? `https://twitter.com/i/web/status/${tweetId}` : undefined,
      postId: post.id,
      platform: 'twitter',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      postId: post.id,
      platform: 'twitter',
    };
  }
}

// Post to Instagram (requires Graph API - placeholder)
async function postToInstagram(post: QueuedPost): Promise<PostResult> {
  // TODO: Implement Instagram Graph API posting
  // For now, mark as needing manual posting
  return {
    success: false,
    error: 'Instagram auto-posting requires Graph API setup. Please post manually.',
    postId: post.id,
    platform: 'instagram',
  };
}

// Post to Facebook (requires Graph API - placeholder)
async function postToFacebook(post: QueuedPost): Promise<PostResult> {
  // TODO: Implement Facebook Graph API posting
  // For now, mark as needing manual posting
  return {
    success: false,
    error: 'Facebook auto-posting requires Graph API setup. Please post manually.',
    postId: post.id,
    platform: 'facebook',
  };
}

// POST /api/post - Execute posting
export async function POST(request: NextRequest) {
  try {
    const { postId, dryRun = false }: { postId?: string; dryRun?: boolean } = await request.json();
    
    const queue = await getQueue();
    
    // Find post to post
    let postsToPost: QueuedPost[];
    
    if (postId) {
      // Post specific post
      const post = queue.find(p => p.id === postId && p.status === 'approved');
      if (!post) {
        return NextResponse.json({ error: 'Post not found or not approved' }, { status: 404 });
      }
      postsToPost = [post];
    } else {
      // Post all approved posts that are scheduled for now or past
      const now = new Date().toISOString();
      postsToPost = queue.filter(p => 
        p.status === 'approved' && 
        p.scheduledTime <= now
      );
    }
    
    if (postsToPost.length === 0) {
      return NextResponse.json({ message: 'No posts ready to publish' });
    }
    
    const results: PostResult[] = [];

    for (const post of postsToPost) {
      if (dryRun) {
        results.push({
          postId: post.id,
          platform: post.platform,
          success: true,
          status: 'dry_run',
          wouldPost: true,
        });
        continue;
      }

      let result: PostResult;
      switch (post.platform) {
        case 'twitter':
          result = await postToTwitter(post);
          break;
        case 'instagram':
          result = await postToInstagram(post);
          break;
        case 'facebook':
          result = await postToFacebook(post);
          break;
        default:
          result = { success: false, error: 'Unknown platform', postId: post.id, platform: post.platform };
      }
      
      // Update queue
      const postIndex = queue.findIndex(p => p.id === post.id);
      if (postIndex !== -1) {
        if (result.success) {
          queue[postIndex].status = 'posted';
          queue[postIndex].postedAt = new Date().toISOString();
          queue[postIndex].postedUrl = result.url;
        } else {
          queue[postIndex].error = result.error;
        }
      }
      
      await logPost(post, result);

      results.push(result);
    }
    
    await saveQueue(queue);
    
    return NextResponse.json({
      success: true,
      posted: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/post/status - Check posting status
export async function GET() {
  try {
    const queue = await getQueue();
    
    const stats = {
      total: queue.length,
      pending: queue.filter(p => p.status === 'pending').length,
      approved: queue.filter(p => p.status === 'approved').length,
      scheduled: queue.filter(p => p.status === 'scheduled').length,
      posted: queue.filter(p => p.status === 'posted').length,
      rejected: queue.filter(p => p.status === 'rejected').length,
      failed: queue.filter(p => p.error).length,
    };
    
    // Get next scheduled posts
    const nextPosts = queue
      .filter(p => p.status === 'approved' || p.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 5);
    
    return NextResponse.json({
      stats,
      nextPosts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
