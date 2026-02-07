import { NextRequest, NextResponse } from 'next/server';
import { InstagramGraphApi, FacebookGraphApi, SocialMediaManager } from '@/lib/instagram-facebook-api';

// Load credentials from environment
const FB_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

function getManager() {
  if (!FB_ACCESS_TOKEN || !FB_PAGE_ID) {
    throw new Error('Facebook credentials not configured');
  }
  
  return new SocialMediaManager({
    facebookAccessToken: FB_ACCESS_TOKEN,
    facebookPageId: FB_PAGE_ID,
    instagramAccountId: IG_ACCOUNT_ID || '',
  });
}

// POST /api/social/instagram - Post to Instagram
export async function instagramPost(request: NextRequest) {
  try {
    if (!FB_ACCESS_TOKEN || !IG_ACCOUNT_ID) {
      return NextResponse.json({ error: 'Instagram not configured. Set INSTAGRAM_ACCOUNT_ID and FACEBOOK_ACCESS_TOKEN env vars.' }, { status: 400 });
    }

    const { type, content }: { type: 'feed' | 'reel' | 'story' | 'carousel'; content: any } = await request.json();
    
    const ig = new InstagramGraphApi(FB_ACCESS_TOKEN, IG_ACCOUNT_ID);
    
    let result;
    switch (type) {
      case 'feed':
        result = await ig.postFeedImage(content);
        break;
      case 'carousel':
        result = await ig.postFeedCarousel(content);
        break;
      case 'reel':
        result = await ig.postReel(content);
        break;
      case 'story':
        result = await ig.postStory(content);
        break;
      default:
        return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/social/facebook - Post to Facebook
export async function facebookPost(request: NextRequest) {
  try {
    if (!FB_ACCESS_TOKEN || !FB_PAGE_ID) {
      return NextResponse.json({ error: 'Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN env vars.' }, { status: 400 });
    }

    const { type, content }: { type: 'text' | 'photo' | 'video'; content: any } = await request.json();
    
    const fb = new FacebookGraphApi(FB_ACCESS_TOKEN, FB_PAGE_ID);
    
    let result;
    switch (type) {
      case 'text':
        result = await fb.postText(content);
        break;
      case 'photo':
        result = await fb.postPhoto(content);
        break;
      case 'video':
        result = await fb.postVideo(content);
        break;
      default:
        return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/social/engage - Like/Comment
export async function engage(request: NextRequest) {
  try {
    const { platform, action, targetId, message }: { 
      platform: 'instagram' | 'facebook'; 
      action: 'like' | 'comment' | 'reply'; 
      targetId: string; 
      message?: string;
    } = await request.json();

    if (platform === 'instagram') {
      if (!FB_ACCESS_TOKEN || !IG_ACCOUNT_ID) {
        return NextResponse.json({ error: 'Instagram not configured' }, { status: 400 });
      }
      
      const ig = new InstagramGraphApi(FB_ACCESS_TOKEN, IG_ACCOUNT_ID);
      
      if (action === 'like') {
        const result = await ig.likeMedia(targetId);
        return NextResponse.json(result);
      } else if (action === 'comment' && message) {
        const result = await ig.commentOnMedia(targetId, message);
        return NextResponse.json(result);
      } else if (action === 'reply' && message) {
        const result = await ig.replyToComment(targetId, message);
        return NextResponse.json(result);
      }
    } else if (platform === 'facebook') {
      if (!FB_ACCESS_TOKEN || !FB_PAGE_ID) {
        return NextResponse.json({ error: 'Facebook not configured' }, { status: 400 });
      }
      
      const fb = new FacebookGraphApi(FB_ACCESS_TOKEN, FB_PAGE_ID);
      
      if (action === 'like') {
        const result = await fb.likePost(targetId);
        return NextResponse.json(result);
      } else if (action === 'comment' && message) {
        const result = await fb.commentOnPost(targetId, message);
        return NextResponse.json(result);
      } else if (action === 'reply' && message) {
        const result = await fb.replyToComment(targetId, message);
        return NextResponse.json(result);
      }
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/social/event - Create Facebook event
export async function createEvent(request: NextRequest) {
  try {
    if (!FB_ACCESS_TOKEN || !FB_PAGE_ID) {
      return NextResponse.json({ error: 'Facebook not configured' }, { status: 400 });
    }

    const manager = getManager();
    const result = await manager.createEasterClassicEvent();
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Main route handler
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  switch (action) {
    case 'instagram':
      return instagramPost(request);
    case 'facebook':
      return facebookPost(request);
    case 'engage':
      return engage(request);
    case 'event':
      return createEvent(request);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// GET /api/social/status - Check configuration status
export async function GET() {
  return NextResponse.json({
    instagram: {
      configured: !!(FB_ACCESS_TOKEN && IG_ACCOUNT_ID),
      accountId: IG_ACCOUNT_ID ? `${IG_ACCOUNT_ID.slice(0, 4)}...` : null,
    },
    facebook: {
      configured: !!(FB_ACCESS_TOKEN && FB_PAGE_ID),
      pageId: FB_PAGE_ID ? `${FB_PAGE_ID.slice(0, 4)}...` : null,
    },
  });
}
