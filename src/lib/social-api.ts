/**
 * Social Media API Integrations
 * Unified interface for posting to Twitter, Instagram, and Facebook
 */

import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export interface PostContent {
  text: string;
  mediaPaths?: string[];
  hashtags?: string[];
  mentions?: string[];
  link?: string;
}

export interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  platform: 'twitter' | 'instagram' | 'facebook';
}

// ============================================
// TWITTER API
// ============================================

export class TwitterPoster {
  private client: TwitterApi;

  constructor(apiKey: string, apiSecret: string, accessToken: string, accessSecret: string) {
    this.client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
  }

  async post(content: PostContent): Promise<PostResult> {
    try {
      let mediaIds: string[] = [];

      // Upload media if provided
      if (content.mediaPaths && content.mediaPaths.length > 0) {
        for (const mediaPath of content.mediaPaths) {
          const mediaId = await this.client.v1.uploadMedia(mediaPath);
          mediaIds.push(mediaId);
        }
      }

      // Build tweet text
      let tweetText = content.text;
      if (content.hashtags && content.hashtags.length > 0) {
        tweetText += '\n\n' + content.hashtags.join(' ');
      }

      // Post tweet
      const tweet = await this.client.v2.tweet(tweetText, {
        media: mediaIds.length > 0 ? { media_ids: mediaIds } : undefined,
      });

      return {
        success: true,
        postId: tweet.data.id,
        url: `https://twitter.com/i/web/status/${tweet.data.id}`,
        platform: 'twitter',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        platform: 'twitter',
      };
    }
  }

  async postThread(tweets: string[]): Promise<PostResult[]> {
    const results: PostResult[] = [];
    let previousTweetId: string | undefined;

    for (const tweetText of tweets) {
      try {
        const tweet = await this.client.v2.tweet(tweetText, {
          reply: previousTweetId ? { in_reply_to_tweet_id: previousTweetId } : undefined,
        });

        results.push({
          success: true,
          postId: tweet.data.id,
          url: `https://twitter.com/i/web/status/${tweet.data.id}`,
          platform: 'twitter',
        });

        previousTweetId = tweet.data.id;
      } catch (error: any) {
        results.push({
          success: false,
          error: error.message,
          platform: 'twitter',
        });
      }
    }

    return results;
  }
}

// ============================================
// INSTAGRAM API (Graph API)
// ============================================

export class InstagramPoster {
  private accessToken: string;
  private igUserId: string;

  constructor(accessToken: string, igUserId: string) {
    this.accessToken = accessToken;
    this.igUserId = igUserId;
  }

  async postFeed(content: PostContent): Promise<PostResult> {
    try {
      // Step 1: Create media container
      const caption = this.buildCaption(content);
      
      let mediaUrl: string;
      if (content.mediaPaths && content.mediaPaths.length > 0) {
        // For simplicity, using URL - in production upload to S3/CDN first
        mediaUrl = content.mediaPaths[0]; // Should be a public URL
      } else {
        throw new Error('Instagram requires media');
      }

      const createResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.igUserId}/media`,
        {
          image_url: mediaUrl,
          caption: caption,
          access_token: this.accessToken,
        }
      );

      const creationId = createResponse.data.id;

      // Step 2: Publish media
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.igUserId}/media_publish`,
        {
          creation_id: creationId,
          access_token: this.accessToken,
        }
      );

      return {
        success: true,
        postId: publishResponse.data.id,
        platform: 'instagram',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        platform: 'instagram',
      };
    }
  }

  async postReel(content: PostContent): Promise<PostResult> {
    try {
      const caption = this.buildCaption(content);
      
      if (!content.mediaPaths || content.mediaPaths.length === 0) {
        throw new Error('Instagram Reels require video');
      }

      const videoUrl = content.mediaPaths[0]; // Should be public URL

      // Step 1: Create reel container
      const createResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.igUserId}/media`,
        {
          media_type: 'REELS',
          video_url: videoUrl,
          caption: caption,
          access_token: this.accessToken,
        }
      );

      const creationId = createResponse.data.id;

      // Step 2: Wait for processing and publish
      // In production, poll for status before publishing
      await new Promise(resolve => setTimeout(resolve, 30000));

      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.igUserId}/media_publish`,
        {
          creation_id: creationId,
          access_token: this.accessToken,
        }
      );

      return {
        success: true,
        postId: publishResponse.data.id,
        platform: 'instagram',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        platform: 'instagram',
      };
    }
  }

  async postStory(content: PostContent): Promise<PostResult> {
    try {
      if (!content.mediaPaths || content.mediaPaths.length === 0) {
        throw new Error('Instagram Stories require media');
      }

      const mediaUrl = content.mediaPaths[0];

      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${this.igUserId}/media`,
        {
          media_type: 'STORIES',
          image_url: mediaUrl,
          access_token: this.accessToken,
        }
      );

      return {
        success: true,
        postId: response.data.id,
        platform: 'instagram',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        platform: 'instagram',
      };
    }
  }

  private buildCaption(content: PostContent): string {
    let caption = content.text;
    if (content.hashtags && content.hashtags.length > 0) {
      caption += '\n\n' + content.hashtags.join(' ');
    }
    if (content.mentions && content.mentions.length > 0) {
      caption += '\n\n' + content.mentions.map(m => `@${m}`).join(' ');
    }
    return caption;
  }
}

// ============================================
// FACEBOOK API (Graph API)
// ============================================

export class FacebookPoster {
  private accessToken: string;
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  async post(content: PostContent): Promise<PostResult> {
    try {
      let params: any = {
        message: content.text,
        access_token: this.accessToken,
      };

      if (content.mediaPaths && content.mediaPaths.length > 0) {
        // Upload media
        const formData = new FormData();
        formData.append('source', fs.createReadStream(content.mediaPaths[0]));
        formData.append('caption', content.text);
        formData.append('access_token', this.accessToken);

        const response = await axios.post(
          `https://graph.facebook.com/v18.0/${this.pageId}/photos`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        );

        return {
          success: true,
          postId: response.data.id,
          url: `https://facebook.com/${this.pageId}/posts/${response.data.post_id || response.data.id}`,
          platform: 'facebook',
        };
      }

      // Text-only post
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${this.pageId}/feed`,
        params
      );

      return {
        success: true,
        postId: response.data.id,
        platform: 'facebook',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        platform: 'facebook',
      };
    }
  }

  async createEvent(eventData: {
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    coverImage?: string;
  }): Promise<PostResult> {
    try {
      const params: any = {
        name: eventData.name,
        description: eventData.description,
        start_time: eventData.startTime,
        end_time: eventData.endTime,
        location: eventData.location,
        access_token: this.accessToken,
      };

      if (eventData.coverImage) {
        params.cover_url = eventData.coverImage;
      }

      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${this.pageId}/events`,
        params
      );

      return {
        success: true,
        postId: response.data.id,
        url: `https://facebook.com/events/${response.data.id}`,
        platform: 'facebook',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        platform: 'facebook',
      };
    }
  }
}

// ============================================
// UNIFIED POSTING MANAGER
// ============================================

export class SocialMediaManager {
  private twitter?: TwitterPoster;
  private instagram?: InstagramPoster;
  private facebook?: FacebookPoster;

  constructor(config: {
    twitter?: { apiKey: string; apiSecret: string; accessToken: string; accessSecret: string };
    instagram?: { accessToken: string; igUserId: string };
    facebook?: { accessToken: string; pageId: string };
  }) {
    if (config.twitter) {
      this.twitter = new TwitterPoster(
        config.twitter.apiKey,
        config.twitter.apiSecret,
        config.twitter.accessToken,
        config.twitter.accessSecret
      );
    }
    if (config.instagram) {
      this.instagram = new InstagramPoster(config.instagram.accessToken, config.instagram.igUserId);
    }
    if (config.facebook) {
      this.facebook = new FacebookPoster(config.facebook.accessToken, config.facebook.pageId);
    }
  }

  async postToAll(content: PostContent): Promise<PostResult[]> {
    const results: PostResult[] = [];

    if (this.twitter) {
      results.push(await this.twitter.post(content));
    }
    if (this.instagram) {
      results.push(await this.instagram.postFeed(content));
    }
    if (this.facebook) {
      results.push(await this.facebook.post(content));
    }

    return results;
  }

  async postToPlatform(platform: 'twitter' | 'instagram' | 'facebook', content: PostContent, type?: 'feed' | 'reel' | 'story'): Promise<PostResult> {
    switch (platform) {
      case 'twitter':
        if (!this.twitter) throw new Error('Twitter not configured');
        return this.twitter.post(content);
      
      case 'instagram':
        if (!this.instagram) throw new Error('Instagram not configured');
        if (type === 'reel') return this.instagram.postReel(content);
        if (type === 'story') return this.instagram.postStory(content);
        return this.instagram.postFeed(content);
      
      case 'facebook':
        if (!this.facebook) throw new Error('Facebook not configured');
        return this.facebook.post(content);
      
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }
}
