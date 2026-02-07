#!/usr/bin/env node
/**
 * Create Easter Classic 2026 Facebook Event
 * Uses Facebook Graph API
 */

const axios = require('axios');

const EVENT_DATA = {
  name: "Easter Classic 2026 - CourtLab Verified Combines",
  description: `🏀 EASTER CLASSIC 2026 - VERIFIED COMBINES

The premier basketball tournament in South Australia is back—and this year, we're bringing something new.

CourtLab is hosting verified combines at Easter Classic 2026. Live leaderboards. Scout-ready PDFs. Real data. No AI guesswork.

📅 WHEN: April 3-6, 2026
📍 WHERE: The ARC Campbelltown
🏆 WHO: 300+ players across all age groups

WHAT'S NEW THIS YEAR:
✅ Live combine leaderboards on big screens
✅ Verified player data (not AI estimates)
✅ Scout-ready PDF exports
✅ Real-time shooting analytics
✅ Player comparison tools
✅ QR code tech for instant check-ins

WHY IT MATTERS:
College scouts. Academy selectors. Club coaches. They all want one thing: verified data on how you actually perform under pressure. Not highlights. Not opinions. Facts.

CourtLab combines give you that edge.

REGISTER:
Link in bio @courtlabapp

Tag a player who needs to be here 👇

#EasterClassic #BasketballSA #CourtLab #VerifiedCombines #BecomeUndeniable`,
  startTime: "2026-04-03T08:00:00+1030", // Adelaide time
  endTime: "2026-04-06T18:00:00+1030",
  location: "The ARC Campbelltown, Adelaide, SA",
  coverImage: "https://github.com/raven2t2/courtlabops/blob/main/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890/assets/easter-classic-promo.jpg?raw=true",
};

async function createFacebookEvent() {
  console.log('[FacebookEvent] Creating Easter Classic 2026 event...');
  
  // Get credentials from environment
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID || '948912778306299';
  
  if (!accessToken) {
    console.error('[FacebookEvent] Missing FACEBOOK_ACCESS_TOKEN');
    console.log('[FacebookEvent] Event data prepared but not posted:');
    console.log(JSON.stringify(EVENT_DATA, null, 2));
    process.exit(1);
  }
  
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/events`,
      {
        name: EVENT_DATA.name,
        description: EVENT_DATA.description,
        start_time: EVENT_DATA.startTime,
        end_time: EVENT_DATA.endTime,
        location: EVENT_DATA.location,
        cover_url: EVENT_DATA.coverImage,
        access_token: accessToken,
      }
    );
    
    console.log('[FacebookEvent] Success!');
    console.log(`[FacebookEvent] Event ID: ${response.data.id}`);
    console.log(`[FacebookEvent] URL: https://facebook.com/events/${response.data.id}`);
    
    // Save event ID for later use
    const fs = require('fs');
    const path = require('path');
    const eventFile = path.join(process.cwd(), 'data', 'easter-classic-event.json');
    fs.mkdirSync(path.dirname(eventFile), { recursive: true });
    fs.writeFileSync(eventFile, JSON.stringify({
      eventId: response.data.id,
      url: `https://facebook.com/events/${response.data.id}`,
      createdAt: new Date().toISOString(),
    }, null, 2));
    
  } catch (error) {
    console.error('[FacebookEvent] Failed:', error.response?.data?.error?.message || error.message);
    console.log('[FacebookEvent] Event data:');
    console.log(JSON.stringify(EVENT_DATA, null, 2));
  }
}

createFacebookEvent();
