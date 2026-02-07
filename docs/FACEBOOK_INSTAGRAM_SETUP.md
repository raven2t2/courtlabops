# Instagram & Facebook API Setup Guide

## Required Environment Variables

Add these to your Vercel environment variables or `.env.local`:

```env
# Facebook (required for both FB and IG)
FACEBOOK_ACCESS_TOKEN=your_long_lived_access_token
FACEBOOK_PAGE_ID=your_facebook_page_id

# Instagram (optional, for IG posting)
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
```

---

## Step 1: Get Facebook Page ID

1. Go to your Facebook Page: https://facebook.com/CourtLab
2. Click **About** in the left sidebar
3. Scroll to **Page Transparency** → Click **See All**
4. The Page ID is shown there

**OR**

Use the Graph API Explorer:
1. Go to: https://developers.facebook.com/tools/explorer/
2. Select your app and get a token
3. Query: `me/accounts`
4. Find CourtLab page and copy the `id`

---

## Step 2: Get Instagram Business Account ID

1. Go to your Instagram profile in the app
2. Tap **Menu** (3 lines) → **Settings** → **Account** → **Switch to Professional Account**
3. Connect to your Facebook Page (CourtLab)
4. Once connected, the Instagram Account ID will be in your Facebook Page settings

**OR**

Use Graph API:
1. Query: `{page-id}?fields=instagram_business_account`
2. The `instagram_business_account.id` is your IG Account ID

---

## Step 3: Create Facebook App

1. Go to: https://developers.facebook.com/apps/
2. Click **Create App**
3. Select **Business** → **Business**
4. App Name: "CourtLab Social"
5. Contact Email: your email
6. Click **Create App**

---

## Step 4: Add Products

In your app dashboard, add these products:

1. **Facebook Login**
2. **Instagram Graph API**

---

## Step 5: Get Access Token

### Short-lived token (expires in 1 hour):

1. Go to: https://developers.facebook.com/tools/explorer/
2. Select your app
3. Select permissions:
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_comments`
   - `pages_manage_engagement`
4. Click **Generate Token**
5. Select your CourtLab page
6. Copy the token

### Convert to Long-lived token (60 days):

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

Save the `access_token` from the response.

---

## Step 6: Verify Setup

Test your tokens:

```bash
# Test Facebook Page Access
curl "https://graph.facebook.com/v18.0/YOUR_PAGE_ID?access_token=YOUR_ACCESS_TOKEN"

# Test Instagram Account
curl "https://graph.facebook.com/v18.0/YOUR_IG_ACCOUNT_ID?access_token=YOUR_ACCESS_TOKEN"
```

---

## Step 7: Add to Vercel

1. Go to: https://vercel.com/dashboard → CourtLab project
2. Click **Settings** → **Environment Variables**
3. Add:
   - `FACEBOOK_ACCESS_TOKEN` = your long-lived token
   - `FACEBOOK_PAGE_ID` = your page ID
   - `INSTAGRAM_ACCOUNT_ID` = your IG account ID
4. Click **Save**
5. Redeploy: Click **Deployments** → **...** → **Redeploy**

---

## Features Available After Setup

### Posting
- ✅ Instagram Feed Posts
- ✅ Instagram Reels
- ✅ Instagram Stories
- ✅ Instagram Carousels
- ✅ Facebook Text Posts
- ✅ Facebook Photo Posts
- ✅ Facebook Video Posts
- ✅ Facebook Events

### Engagement
- ✅ Like posts (FB & IG)
- ✅ Comment on posts (FB & IG)
- ✅ Reply to comments (FB & IG)
- ✅ Get comments (FB & IG)
- ❌ Follow accounts (restricted by API)

---

## Rate Limits

- Instagram: 25 posts per 24 hours
- Facebook: Depends on page size (usually 50+ per hour)

---

## Troubleshooting

**"Invalid token"**
- Token expired (short-lived tokens last 1 hour)
- Generate long-lived token (60 days)

**"Insufficient permissions"**
- Add required permissions in Graph API Explorer
- Re-authenticate with all permissions

**"Page not found"**
- Wrong Page ID
- You must be admin of the page

**"Instagram account not found"**
- IG must be Business or Creator account
- Must be connected to the Facebook Page

---

## Need Help?

Graph API Explorer: https://developers.facebook.com/tools/explorer/
Instagram Graph API Docs: https://developers.facebook.com/docs/instagram-api
