/**
 * Instagram & Facebook Graph API Integration
 * Full functionality: post, follow, comment, like
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Graph API version
const GRAPH_API_VERSION = 'v18.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export interface GraphApiConfig {
  facebookAccessToken: string;
  facebookPageId: string;
  instagramAccountId: string;
}

export interface PostContent {
  text: string;
  mediaPaths?: string[];
  mediaUrls?: string[];
  hashtags?: string[];
}

export interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export interface EngagementResult {
  success: boolean;
  actionId?: string;
  error?: string;
}

// ============================================
// INSTAGRAM GRAPH API
// ============================================

export class InstagramGraphApi {
  private accessToken: string;
  private igUserId: string;

  constructor(accessToken: string, igUserId: string) {
    this.accessToken = accessToken;
    this.igUserId = igUserId;
  }

  // --------- POSTING ---------

  async postFeedImage(content: PostContent): Promise<PostResult> {
    try {
      // Step 1: Create media container
      const createUrl = `${GRAPH_API_BASE}/${this.igUserId}/media`;
      const createParams: any = {
        image_url: content.mediaUrls?.[0],
        caption: this.buildCaption(content),
        access_token: this.accessToken,
      };

      const createResponse = await axios.post(createUrl, null, { params: createParams });
      const creationId = createResponse.data.id;

      // Step 2: Wait for processing
      await this.waitForMediaReady(creationId);

      // Step 3: Publish
      const publishUrl = `${GRAPH_API_BASE}/${this.igUserId}/media_publish`;
      const publishResponse = await axios.post(publishUrl, null, {
        params: {
          creation_id: creationId,
          access_token: this.accessToken,
        },
      });

      return {
        success: true,
        postId: publishResponse.data.id,
        url: `https://instagram.com/p/${publishResponse.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async postFeedCarousel(content: PostContent): Promise<PostResult> {
    try {
      if (!content.mediaUrls || content.mediaUrls.length < 2) {
        throw new Error('Carousel requires at least 2 images');
      }

      // Step 1: Create media containers for each item
      const mediaIds: string[] = [];
      for (const mediaUrl of content.mediaUrls) {
        const createUrl = `${GRAPH_API_BASE}/${this.igUserId}/media`;
        const response = await axios.post(createUrl, null, {
          params: {
            image_url: mediaUrl,
            is_carousel_item: true,
            access_token: this.accessToken,
          },
        });
        mediaIds.push(response.data.id);
      }

      // Step 2: Create carousel container
      const carouselUrl = `${GRAPH_API_BASE}/${this.igUserId}/media`;
      const carouselResponse = await axios.post(carouselUrl, null, {
        params: {
          media_type: 'CAROUSEL',
          children: mediaIds.join(','),
          caption: this.buildCaption(content),
          access_token: this.accessToken,
        },
      });

      // Step 3: Publish
      const publishResponse = await axios.post(
        `${GRAPH_API_BASE}/${this.igUserId}/media_publish`,
        null,
        {
          params: {
            creation_id: carouselResponse.data.id,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        postId: publishResponse.data.id,
        url: `https://instagram.com/p/${publishResponse.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async postReel(content: PostContent): Promise<PostResult> {
    try {
      if (!content.mediaUrls?.[0]) {
        throw new Error('Reels require video URL');
      }

      // Step 1: Create reel container
      const createUrl = `${GRAPH_API_BASE}/${this.igUserId}/media`;
      const createResponse = await axios.post(createUrl, null, {
        params: {
          media_type: 'REELS',
          video_url: content.mediaUrls[0],
          caption: this.buildCaption(content),
          share_to_feed: true,
          access_token: this.accessToken,
        },
      });

      const creationId = createResponse.data.id;

      // Step 2: Wait for processing (reels take longer)
      await this.waitForMediaReady(creationId, 60);

      // Step 3: Publish
      const publishResponse = await axios.post(
        `${GRAPH_API_BASE}/${this.igUserId}/media_publish`,
        null,
        {
          params: {
            creation_id: creationId,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        postId: publishResponse.data.id,
        url: `https://instagram.com/reel/${publishResponse.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async postStory(content: PostContent): Promise<PostResult> {
    try {
      if (!content.mediaUrls?.[0]) {
        throw new Error('Stories require media');
      }

      const createUrl = `${GRAPH_API_BASE}/${this.igUserId}/media`;
      const response = await axios.post(createUrl, null, {
        params: {
          media_type: 'STORIES',
          image_url: content.mediaUrls[0],
          access_token: this.accessToken,
        },
      });

      return {
        success: true,
        postId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // --------- ENGAGEMENT ---------

  async likeMedia(mediaId: string): Promise<EngagementResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${mediaId}/likes`,
        null,
        {
          params: { access_token: this.accessToken },
        }
      );

      return {
        success: true,
        actionId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async commentOnMedia(mediaId: string, text: string): Promise<EngagementResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${mediaId}/comments`,
        null,
        {
          params: {
            message: text,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        actionId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async replyToComment(commentId: string, text: string): Promise<EngagementResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${commentId}/replies`,
        null,
        {
          params: {
            message: text,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        actionId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async getComments(mediaId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${GRAPH_API_BASE}/${mediaId}/comments`,
        {
          params: {
            fields: 'id,text,username,timestamp,replies',
            access_token: this.accessToken,
          },
        }
      );

      return response.data.data || [];
    } catch (error: any) {
      console.error('Failed to get comments:', error.message);
      return [];
    }
  }

  // Note: Instagram doesn't allow following via API (anti-spam measure)
  // Following must be done manually or through mobile automation

  // --------- UTILITIES ---------

  private async waitForMediaReady(creationId: string, maxAttempts: number = 30): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await axios.get(
        `${GRAPH_API_BASE}/${creationId}`,
        {
          params: {
            fields: 'status_code',
            access_token: this.accessToken,
          },
        }
      );

      if (response.data.status_code === 'FINISHED') {
        return;
      }

      if (response.data.status_code === 'ERROR') {
        throw new Error('Media processing failed');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Media processing timeout');
  }

  private buildCaption(content: PostContent): string {
    let caption = content.text;
    if (content.hashtags?.length) {
      caption += '\n\n' + content.hashtags.join(' ');
    }
    return caption;
  }
}

// ============================================
// FACEBOOK GRAPH API
// ============================================

export class FacebookGraphApi {
  private accessToken: string;
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  // --------- POSTING ---------

  async postText(content: PostContent): Promise<PostResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${this.pageId}/feed`,
        null,
        {
          params: {
            message: content.text,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        postId: response.data.id,
        url: `https://facebook.com/${response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async postPhoto(content: PostContent): Promise<PostResult> {
    try {
      if (!content.mediaPaths?.[0]) {
        throw new Error('Photo post requires image');
      }

      const formData = new FormData();
      formData.append('source', fs.createReadStream(content.mediaPaths[0]));
      formData.append('message', content.text);
      formData.append('access_token', this.accessToken);

      const response = await axios.post(
        `${GRAPH_API_BASE}/${this.pageId}/photos`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return {
        success: true,
        postId: response.data.id,
        url: `https://facebook.com/${this.pageId}/posts/${response.data.post_id || response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async postVideo(content: PostContent): Promise<PostResult> {
    try {
      if (!content.mediaPaths?.[0]) {
        throw new Error('Video post requires video file');
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(content.mediaPaths[0]));
      formData.append('description', content.text);
      formData.append('access_token', this.accessToken);

      const response = await axios.post(
        `${GRAPH_API_BASE}/${this.pageId}/videos`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return {
        success: true,
        postId: response.data.id,
        url: `https://facebook.com/${this.pageId}/videos/${response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // --------- EVENTS ---------

  async createEvent(eventData: {
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    coverImageUrl?: string;
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

      if (eventData.coverImageUrl) {
        params.cover_url = eventData.coverImageUrl;
      }

      const response = await axios.post(
        `${GRAPH_API_BASE}/${this.pageId}/events`,
        null,
        { params }
      );

      return {
        success: true,
        postId: response.data.id,
        url: `https://facebook.com/events/${response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // --------- ENGAGEMENT ---------

  async likePost(postId: string): Promise<EngagementResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${postId}/likes`,
        null,
        {
          params: { access_token: this.accessToken },
        }
      );

      return {
        success: true,
        actionId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async commentOnPost(postId: string, message: string): Promise<EngagementResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${postId}/comments`,
        null,
        {
          params: {
            message,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        actionId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async replyToComment(commentId: string, message: string): Promise<EngagementResult> {
    try {
      const response = await axios.post(
        `${GRAPH_API_BASE}/${commentId}/comments`,
        null,
        {
          params: {
            message,
            access_token: this.accessToken,
          },
        }
      );

      return {
        success: true,
        actionId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  // Note: Following pages via API is restricted
  // Must be done manually or through specific partner APIs

  // --------- PAGE MANAGEMENT ---------

  async getPageInsights(): Promise<any> {
    try {
      const response = await axios.get(
        `${GRAPH_API_BASE}/${this.pageId}/insights`,
        {
          params: {
            metric: 'page_impressions,page_engaged_users,page_fan_adds',
            access_token: this.accessToken,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to get insights:', error.message);
      return null;
    }
  }

  async getRecentPosts(limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(
        `${GRAPH_API_BASE}/${this.pageId}/posts`,
        {
          params: {
            limit,
            fields: 'id,message,created_time,likes.summary(true),comments.summary(true)',
            access_token: this.accessToken,
          },
        }
      );

      return response.data.data || [];
    } catch (error: any) {
      console.error('Failed to get posts:', error.message);
      return [];
    }
  }
}

// ============================================
// UNIFIED MANAGER
// ============================================

export class SocialMediaManager {
  instagram?: InstagramGraphApi;
  facebook?: FacebookGraphApi;

  constructor(config: GraphApiConfig) {
    if (config.instagramAccountId) {
      this.instagram = new InstagramGraphApi(config.facebookAccessToken, config.instagramAccountId);
    }
    if (config.facebookPageId) {
      this.facebook = new FacebookGraphApi(config.facebookAccessToken, config.facebookPageId);
    }
  }

  // Post to all platforms
  async postToAll(content: PostContent): Promise<{ instagram?: PostResult; facebook?: PostResult }> {
    const results: { instagram?: PostResult; facebook?: PostResult } = {};

    if (this.instagram) {
      results.instagram = await this.instagram.postFeedImage(content);
    }
    if (this.facebook) {
      results.facebook = await this.facebook.postText(content);
    }

    return results;
  }

  // Create Easter Classic Event
  async createEasterClassicEvent(): Promise<PostResult> {
    if (!this.facebook) {
      return { success: false, error: 'Facebook not configured' };
    }

    return this.facebook.createEvent({
      name: 'Easter Classic 2026 - CourtLab Verified Combine',
      description: `The premier youth basketball tournament in South Australia with verified combines and live leaderboards.

🏀 300+ elite players
📊 Live leaderboards on big screens
📄 Scout-ready PDFs
🎯 Verified tracking (not AI guesswork)

Presented by CourtLab - Become Undeniable`,
      startTime: '2026-04-03T09:00:00+1030',
      endTime: '2026-04-06T17:00:00+1030',
      location: 'The ARC Campbelltown, Adelaide SA',
    });
  }
}
