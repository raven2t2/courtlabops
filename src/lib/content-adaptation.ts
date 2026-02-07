/**
 * Content Adaptation Engine
 * Resizes and formats assets for each platform's requirements
 */

import sharp from 'sharp';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export type PlatformFormat = 'instagram-reel' | 'instagram-story' | 'instagram-feed' | 'twitter' | 'facebook' | 'tiktok';

export interface AdaptationSpec {
  width: number;
  height: number;
  aspectRatio: string;
  maxFileSizeMB: number;
  format: 'jpg' | 'png' | 'mp4' | 'mov';
  quality: number;
}

export const PLATFORM_SPECS: Record<PlatformFormat, AdaptationSpec> = {
  'instagram-reel': {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxFileSizeMB: 100,
    format: 'mp4',
    quality: 80,
  },
  'instagram-story': {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxFileSizeMB: 30,
    format: 'mp4',
    quality: 80,
  },
  'instagram-feed': {
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    maxFileSizeMB: 30,
    format: 'jpg',
    quality: 85,
  },
  'twitter': {
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    maxFileSizeMB: 15,
    format: 'jpg',
    quality: 85,
  },
  'facebook': {
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    maxFileSizeMB: 25,
    format: 'jpg',
    quality: 85,
  },
  'tiktok': {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    maxFileSizeMB: 100,
    format: 'mp4',
    quality: 80,
  },
};

export interface AdaptedAsset {
  originalPath: string;
  adaptedPath: string;
  platform: PlatformFormat;
  width: number;
  height: number;
  fileSize: number;
  format: string;
}

/**
 * Adapt an image for a specific platform
 */
export async function adaptImage(
  inputPath: string,
  outputDir: string,
  platform: PlatformFormat
): Promise<AdaptedAsset> {
  const spec = PLATFORM_SPECS[platform];
  const filename = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(outputDir, `${filename}-${platform}.${spec.format}`);

  await sharp(inputPath)
    .resize(spec.width, spec.height, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: spec.quality })
    .toFile(outputPath);

  const stats = await fs.stat(outputPath);

  return {
    originalPath: inputPath,
    adaptedPath: outputPath,
    platform,
    width: spec.width,
    height: spec.height,
    fileSize: stats.size,
    format: spec.format,
  };
}

/**
 * Adapt a video for a specific platform using ffmpeg
 */
export async function adaptVideo(
  inputPath: string,
  outputDir: string,
  platform: PlatformFormat
): Promise<AdaptedAsset> {
  const spec = PLATFORM_SPECS[platform];
  const filename = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(outputDir, `${filename}-${platform}.${spec.format}`);

  // Use ffmpeg to resize and re-encode
  const ffmpegCmd = `ffmpeg -i "${inputPath}" -vf "scale=${spec.width}:${spec.height}:force_original_aspect_ratio=decrease,pad=${spec.width}:${spec.height}:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k "${outputPath}" -y`;

  await execAsync(ffmpegCmd);

  const stats = await fs.stat(outputPath);

  return {
    originalPath: inputPath,
    adaptedPath: outputPath,
    platform,
    width: spec.width,
    height: spec.height,
    fileSize: stats.size,
    format: spec.format,
  };
}

/**
 * Auto-detect file type and adapt accordingly
 */
export async function adaptAsset(
  inputPath: string,
  outputDir: string,
  platform: PlatformFormat
): Promise<AdaptedAsset> {
  const ext = path.extname(inputPath).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return adaptImage(inputPath, outputDir, platform);
  }
  
  if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
    return adaptVideo(inputPath, outputDir, platform);
  }
  
  throw new Error(`Unsupported file format: ${ext}`);
}

/**
 * Adapt an asset for all platforms at once
 */
export async function adaptForAllPlatforms(
  inputPath: string,
  outputBaseDir: string
): Promise<Record<PlatformFormat, AdaptedAsset>> {
  const results = {} as Record<PlatformFormat, AdaptedAsset>;
  
  await fs.mkdir(outputBaseDir, { recursive: true });

  for (const platform of Object.keys(PLATFORM_SPECS) as PlatformFormat[]) {
    const platformDir = path.join(outputBaseDir, platform);
    await fs.mkdir(platformDir, { recursive: true });
    
    try {
      results[platform] = await adaptAsset(inputPath, platformDir, platform);
    } catch (error) {
      console.error(`Failed to adapt for ${platform}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Get the best platform format for a given asset and target platform
 */
export function getBestFormat(assetType: 'image' | 'video', targetPlatform: 'twitter' | 'instagram' | 'facebook'): PlatformFormat {
  if (targetPlatform === 'instagram') {
    if (assetType === 'video') return 'instagram-reel';
    return 'instagram-feed';
  }
  if (targetPlatform === 'twitter') return 'twitter';
  if (targetPlatform === 'facebook') return 'facebook';
  return 'twitter';
}

/**
 * Check if asset needs adaptation (wrong size/format)
 */
export async function needsAdaptation(
  inputPath: string,
  platform: PlatformFormat
): Promise<boolean> {
  try {
    const spec = PLATFORM_SPECS[platform];
    const ext = path.extname(inputPath).toLowerCase();
    
    // Check format
    if (spec.format === 'jpg' && !['.jpg', '.jpeg'].includes(ext)) return true;
    if (spec.format === 'mp4' && ext !== '.mp4') return true;
    
    // For images, check dimensions
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const metadata = await sharp(inputPath).metadata();
      if (metadata.width !== spec.width || metadata.height !== spec.height) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    return true; // If we can't check, assume adaptation needed
  }
}
