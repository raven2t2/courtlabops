#!/bin/bash
# Morning briefing that includes live app metrics from CourtLab backend

# Query live metrics from Telegram bot webhook
echo "🌅 Fetching live metrics..."

# These commands hit the webhook which sends responses to Telegram
# We'll get summaries via Telegram, not in the response
curl -s -X POST https://us-central1-courtlab-e68a1.cloudfunctions.net/telegramWebhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"text":"/live","chat":{"id":8435263453}}}' > /dev/null

# Wait a moment for Telegram to process
sleep 1

# Now generate the morning briefing with context
echo "📊 Generating morning marketing ideas..."

# Standard morning briefing
node /data/.openclaw/workspace/courtlabops-repo/scripts/daily-briefing.js

# Sync briefings to web
bash /data/.openclaw/workspace/courtlabops-repo/scripts/sync-briefings-to-web.sh

echo "✅ Morning briefing complete. Live metrics sent to Telegram."
echo "📱 Check your Telegram bot for: users, trials, signups, ad performance"
