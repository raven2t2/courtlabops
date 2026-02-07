import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'data', 'post-queue.json');

export interface Post {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  type: 'feed' | 'reel' | 'story' | 'thread' | 'poll';
  status: 'pending' | 'approved' | 'rejected' | 'posted' | 'scheduled';
  scheduledTime: string;
  caption: string;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
  link?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
  postedAt?: string;
  postId?: string;
  postUrl?: string;
  error?: string;
}

async function loadQueue(): Promise<Post[]> {
  try {
    const data = await fs.readFile(QUEUE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveQueue(queue: Post[]): Promise<void> {
  await fs.mkdir(path.dirname(QUEUE_FILE), { recursive: true });
  await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// GET /api/posts - List all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    let queue = await loadQueue();

    if (platform && platform !== 'all') {
      queue = queue.filter(p => p.platform === platform);
    }
    if (status && status !== 'all') {
      queue = queue.filter(p => p.status === status);
    }

    return NextResponse.json({ posts: queue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const queue = await loadQueue();

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform: body.platform,
      type: body.type || 'feed',
      status: 'pending',
      scheduledTime: body.scheduledTime,
      caption: body.caption,
      mediaUrls: body.mediaUrls || [],
      hashtags: body.hashtags || [],
      mentions: body.mentions || [],
      link: body.link,
      createdAt: new Date().toISOString(),
    };

    queue.push(newPost);
    await saveQueue(queue);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/posts/:id - Update a post (approve, reject, edit)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, caption, scheduledTime, notes } = body;

    const queue = await loadQueue();
    const postIndex = queue.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = queue[postIndex];

    if (action === 'approve') {
      post.status = 'approved';
      post.approvedAt = new Date().toISOString();
      post.approvedBy = 'Michael';
    } else if (action === 'reject') {
      post.status = 'rejected';
    } else if (action === 'schedule') {
      post.status = 'scheduled';
    } else if (action === 'edit') {
      if (caption) post.caption = caption;
      if (scheduledTime) post.scheduledTime = scheduledTime;
      if (notes) post.notes = notes;
    }

    await saveQueue(queue);

    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/posts/:id - Remove a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const queue = await loadQueue();
    const filtered = queue.filter(p => p.id !== id);

    if (filtered.length === queue.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await saveQueue(filtered);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
