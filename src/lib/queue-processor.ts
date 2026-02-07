/**
 * Queue Processor
 * Checks approved posts and executes them at scheduled times
 */

import { PostContent, SocialMediaManager, PostResult } from './social-api';
import { adaptAsset, getBestFormat } from './content-adaptation';
import fs from 'fs/promises';
import path from 'path';

export interface QueuedPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook';
  type: 'feed' | 'reel' | 'story' | 'thread' | 'poll';
  status: 'pending' | 'approved' | 'scheduled' | 'posted' | 'failed';
  scheduledTime: string;
  content: PostContent;
  assetIds?: string[];
  adaptedAssets?: Record<string, string>; // platform -> path
  postedAt?: string;
  postId?: string;
  postUrl?: string;
  error?: string;
  retryCount: number;
}

export interface QueueProcessorConfig {
  queueFilePath: string;
  adaptedAssetsDir: string;
  checkIntervalMs: number;
  maxRetries: number;
  socialMediaConfig: {
    twitter?: { apiKey: string; apiSecret: string; accessToken: string; accessSecret: string };
    instagram?: { accessToken: string; igUserId: string };
    facebook?: { accessToken: string; pageId: string };
  };
}

export class QueueProcessor {
  private config: QueueProcessorConfig;
  private socialManager: SocialMediaManager;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;

  constructor(config: QueueProcessorConfig) {
    this.config = config;
    this.socialManager = new SocialMediaManager(config.socialMediaConfig);
  }

  /**
   * Start the queue processor
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`[QueueProcessor] Started. Checking every ${this.config.checkIntervalMs}ms`);
    
    // Check immediately
    this.processQueue();
    
    // Then check on interval
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.config.checkIntervalMs);
  }

  /**
   * Stop the queue processor
   */
  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('[QueueProcessor] Stopped');
  }

  /**
   * Process the queue - check for approved posts that are due
   */
  async processQueue(): Promise<void> {
    try {
      const queue = await this.loadQueue();
      const now = new Date();
      
      const postsToProcess = queue.filter(post => 
        post.status === 'approved' && 
        new Date(post.scheduledTime) <= now
      );

      console.log(`[QueueProcessor] Found ${postsToProcess.length} posts to process`);

      for (const post of postsToProcess) {
        await this.executePost(post, queue);
      }

    } catch (error) {
      console.error('[QueueProcessor] Error processing queue:', error);
    }
  }

  /**
   * Execute a single post
   */
  private async executePost(post: QueuedPost, queue: QueuedPost[]): Promise<void> {
    console.log(`[QueueProcessor] Executing post ${post.id} to ${post.platform}`);

    try {
      // Adapt assets if needed
      let content = { ...post.content };
      
      if (post.assetIds && post.assetIds.length > 0 && !post.adaptedAssets) {
        const adaptedPaths = await this.adaptAssetsForPost(post);
        content.mediaPaths = Object.values(adaptedPaths);
      } else if (post.adaptedAssets) {
        content.mediaPaths = Object.values(post.adaptedAssets);
      }

      // Execute the post
      const result = await this.socialManager.postToPlatform(
        post.platform,
        content,
        post.type === 'reel' || post.type === 'story' ? post.type : 'feed'
      );

      // Update post status
      if (result.success) {
        post.status = 'posted';
        post.postedAt = new Date().toISOString();
        post.postId = result.postId;
        post.postUrl = result.url;
        console.log(`[QueueProcessor] Post ${post.id} successful: ${result.url}`);
      } else {
        throw new Error(result.error || 'Unknown error');
      }

    } catch (error: any) {
      console.error(`[QueueProcessor] Post ${post.id} failed:`, error.message);
      
      post.retryCount++;
      
      if (post.retryCount >= this.config.maxRetries) {
        post.status = 'failed';
        post.error = error.message;
      } else {
        // Reschedule for 15 minutes later
        const newTime = new Date();
        newTime.setMinutes(newTime.getMinutes() + 15);
        post.scheduledTime = newTime.toISOString();
        console.log(`[QueueProcessor] Rescheduled post ${post.id} for ${post.scheduledTime}`);
      }
    }

    // Save updated queue
    await this.saveQueue(queue);
  }

  /**
   * Adapt assets for a specific post
   */
  private async adaptAssetsForPost(post: QueuedPost): Promise<Record<string, string>> {
    const adaptedPaths: Record<string, string> = {};
    
    if (!post.assetIds) return adaptedPaths;

    for (const assetId of post.assetIds) {
      const assetPath = path.join(process.cwd(), 'shared', 'gallery', '21d9a9dc4a781c60ae3b55b059b31890', 'assets', assetId);
      
      // Determine asset type
      const ext = path.extname(assetPath).toLowerCase();
      const assetType = ['.mp4', '.mov', '.avi'].includes(ext) ? 'video' : 'image';
      
      // Get best format for platform
      const format = getBestFormat(assetType, post.platform);
      
      // Adapt the asset
      const adapted = await adaptAsset(assetPath, this.config.adaptedAssetsDir, format);
      adaptedPaths[post.platform] = adapted.adaptedPath;
    }

    // Update the post with adapted asset paths
    post.adaptedAssets = adaptedPaths;
    
    return adaptedPaths;
  }

  /**
   * Load the queue from file
   */
  private async loadQueue(): Promise<QueuedPost[]> {
    try {
      const data = await fs.readFile(this.config.queueFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, return empty queue
      return [];
    }
  }

  /**
   * Save the queue to file
   */
  private async saveQueue(queue: QueuedPost[]): Promise<void> {
    await fs.mkdir(path.dirname(this.config.queueFilePath), { recursive: true });
    await fs.writeFile(this.config.queueFilePath, JSON.stringify(queue, null, 2));
  }

  /**
   * Add a new post to the queue
   */
  async addToQueue(post: Omit<QueuedPost, 'id' | 'status' | 'retryCount'>): Promise<string> {
    const queue = await this.loadQueue();
    
    const newPost: QueuedPost = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      retryCount: 0,
    };

    queue.push(newPost);
    await this.saveQueue(queue);
    
    console.log(`[QueueProcessor] Added post ${newPost.id} to queue`);
    return newPost.id;
  }

  /**
   * Approve a post
   */
  async approvePost(postId: string): Promise<boolean> {
    const queue = await this.loadQueue();
    const post = queue.find(p => p.id === postId);
    
    if (!post) return false;
    
    post.status = 'approved';
    await this.saveQueue(queue);
    
    console.log(`[QueueProcessor] Approved post ${postId}`);
    return true;
  }

  /**
   * Reject a post
   */
  async rejectPost(postId: string): Promise<boolean> {
    const queue = await this.loadQueue();
    const postIndex = queue.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return false;
    
    queue.splice(postIndex, 1);
    await this.saveQueue(queue);
    
    console.log(`[QueueProcessor] Rejected and removed post ${postId}`);
    return true;
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    scheduled: number;
    posted: number;
    failed: number;
  }> {
    const queue = await this.loadQueue();
    
    return {
      total: queue.length,
      pending: queue.filter(p => p.status === 'pending').length,
      approved: queue.filter(p => p.status === 'approved').length,
      scheduled: queue.filter(p => p.status === 'scheduled').length,
      posted: queue.filter(p => p.status === 'posted').length,
      failed: queue.filter(p => p.status === 'failed').length,
    };
  }
}
