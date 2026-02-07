import { NextRequest, NextResponse } from 'next/server';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'data', 'post-queue.json');

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

// POST /api/queue/approve - Approve a post
export async function POST(request: NextRequest) {
  try {
    const { postId, action, edits }: { postId: string; action: 'approve' | 'reject' | 'schedule' | 'edit'; edits?: Partial<QueuedPost> } = await request.json();
    
    const queue = await getQueue();
    const postIndex = queue.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (action === 'approve') {
      queue[postIndex].status = 'approved';
      if (edits) {
        queue[postIndex] = { ...queue[postIndex], ...edits };
      }
    } else if (action === 'reject') {
      queue[postIndex].status = 'rejected';
    } else if (action === 'schedule') {
      queue[postIndex].status = 'scheduled';
    } else if (action === 'edit') {
      if (!edits) {
        return NextResponse.json({ error: 'No edits provided' }, { status: 400 });
      }
      queue[postIndex] = { ...queue[postIndex], ...edits };
    }

    await saveQueue(queue);
    
    return NextResponse.json({ success: true, post: queue[postIndex] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/queue - Get all queued posts
export async function GET() {
  try {
    const queue = await getQueue();
    return NextResponse.json({ posts: queue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/queue - Add new post to queue
export async function PUT(request: NextRequest) {
  try {
    const post: Omit<QueuedPost, 'id' | 'createdAt'> = await request.json();
    
    const queue = await getQueue();
    const newPost: QueuedPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    queue.push(newPost);
    await saveQueue(queue);
    
    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
