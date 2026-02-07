import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const GALLERY_DIR = 'https://github.com/raven2t2/courtlabops/tree/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890';

interface GalleryAsset {
  id: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  prompt: string;
  aspect?: string;
  duration?: string;
  createdAt: string;
  useCase: string;
  filename?: string;
  githubUrl?: string;
}

// For now, return sample data that represents the structure
// In production, this would parse the full manifest.json
const SAMPLE_ASSETS: GalleryAsset[] = [
  {
    id: "bFA7kaudBWW8x5ch03Qi",
    type: "image",
    category: "brand",
    title: "Youth Elite Lookbook - Total Orange",
    prompt: "Photorealistic studio portrait of two young basketball players in CourtLab uniforms with Nike Kobe 6 Protro Total Orange shoes...",
    aspect: "9/16",
    createdAt: "2026-01-26T14:00:00.350Z",
    useCase: "social-media",
    filename: "youth-elite-lookbook-01.jpg",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/youth-elite-lookbook-01.jpg?raw=true"
  },
  {
    id: "cGB8lbveCXX9y6di14Rj",
    type: "video",
    category: "training",
    title: "Corner 3 Shooting Drill",
    prompt: "Dynamic basketball training video showing a young player practicing corner 3-pointers with CourtLab tracking overlay...",
    duration: "0:45",
    createdAt: "2026-01-25T10:30:00.000Z",
    useCase: "kennys-tips",
    filename: "corner-3-drill.mp4",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/corner-3-drill.mp4?raw=true"
  },
  {
    id: "dHC9mcwfDYY0z7ej25Sk",
    type: "image",
    category: "combine",
    title: "Easter Classic Court Setup",
    prompt: "Wide shot of basketball court with CourtLab branding, leaderboards on big screens, players warming up...",
    aspect: "16/9",
    createdAt: "2026-01-24T08:00:00.000Z",
    useCase: "event-promotion",
    filename: "easter-classic-setup.jpg",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/easter-classic-setup.jpg?raw=true"
  },
  {
    id: "eID0ndxgEZZ1a8fk36Tl",
    type: "image",
    category: "app",
    title: "CourtLab App Screenshot - Stats",
    prompt: "Clean iPhone mockup showing CourtLab app interface with player stats, shooting percentages, and progress charts...",
    aspect: "9/16",
    createdAt: "2026-01-23T14:00:00.000Z",
    useCase: "app-store",
    filename: "app-screenshot-stats.jpg",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/app-screenshot-stats.jpg?raw=true"
  },
  {
    id: "fJE1peyhF002b9gl47Um",
    type: "video",
    category: "testimonial",
    title: "Player Success Story - Sarah",
    prompt: "Interview-style video with young female basketball player discussing her 23% improvement using CourtLab...",
    duration: "1:30",
    createdAt: "2026-01-22T16:00:00.000Z",
    useCase: "testimonial",
    filename: "testimonial-sarah.mp4",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/testimonial-sarah.mp4?raw=true"
  },
  {
    id: "gKF2qfziG113c0hm58Vn",
    type: "image",
    category: "bts",
    title: "Behind the Scenes - Combine Setup",
    prompt: "Candid shot of CourtLab team setting up combine equipment at The ARC Campbelltown...",
    aspect: "16/9",
    createdAt: "2026-01-21T09:00:00.000Z",
    useCase: "bts",
    filename: "bts-combine-setup.jpg",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/bts-combine-setup.jpg?raw=true"
  },
  {
    id: "hLG3rgajH224d1in69Wo",
    type: "image",
    category: "partner",
    title: "Revo Fitness Partnership",
    prompt: "Branded image showing CourtLab and Revo Fitness logos with basketball court background...",
    aspect: "1/1",
    createdAt: "2026-01-20T11:00:00.000Z",
    useCase: "partnership",
    filename: "partner-revo-fitness.jpg",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/partner-revo-fitness.jpg?raw=true"
  },
  {
    id: "iMH4shbkI335e2jo70Xp",
    type: "video",
    category: "training",
    title: "Ball Handling Drills - Beginner",
    prompt: "Tutorial video demonstrating basic ball handling drills for youth players...",
    duration: "2:15",
    createdAt: "2026-01-19T13:00:00.000Z",
    useCase: "training",
    filename: "training-ball-handling.mp4",
    githubUrl: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/training-ball-handling.mp4?raw=true"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    
    let assets = [...SAMPLE_ASSETS];
    
    // Add more sample assets to simulate the 207
    for (let i = 9; i <= 24; i++) {
      const categories = ['brand', 'combine', 'training', 'app', 'testimonial', 'bts', 'partner'];
      const cat = categories[i % categories.length];
      assets.push({
        id: `asset-${i}`,
        type: i % 3 === 0 ? 'video' : 'image',
        category: cat,
        title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Asset ${i}`,
        prompt: `AI-generated ${cat} content for CourtLab marketing...`,
        aspect: i % 2 === 0 ? '9/16' : '16/9',
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        useCase: 'social-media',
        filename: `asset-${i}.${i % 3 === 0 ? 'mp4' : 'jpg'}`,
        githubUrl: `https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/asset-${i}.${i % 3 === 0 ? 'mp4' : 'jpg'}?raw=true`
      });
    }
    
    // Apply filters
    if (category && category !== 'all') {
      assets = assets.filter(a => a.category === category);
    }
    if (type && type !== 'all') {
      assets = assets.filter(a => a.type === type);
    }
    
    return NextResponse.json({ 
      assets,
      total: 207,
      loaded: assets.length,
      categories: {
        brand: 30,
        combine: 45,
        training: 50,
        app: 25,
        testimonial: 25,
        bts: 20,
        partner: 12
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
