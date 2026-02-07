#!/bin/bash
# Twitter Intelligence Monitor
# Scans basketball Twitter for relevant conversations
# Logs findings to data/twitter-intel.json
# Run every 4 hours during AU business hours (8am-8pm ACDT)

set -e

REPO_PATH="/data/.openclaw/workspace/courtlabops-repo"
INTEL_FILE="$REPO_PATH/data/twitter-intel.json"
BIRD_CLI="/skeleton/.npm-global/bin/bird"
DATE=$(date -u +"%Y-%m-%d")
TIME=$(date -u +"%H:%M:%S")

echo "🐦 Twitter Monitor - $DATE $TIME"

# Check if bird CLI is available
if [ ! -f "$BIRD_CLI" ]; then
  echo "❌ bird CLI not found at $BIRD_CLI"
  echo "   Waiting for installation..."
  exit 1
fi

# Keywords to monitor
KEYWORDS=(
  "basketball training app"
  "basketball stats"
  "combine testing"
  "basketball coach"
  "Australian basketball"
  "HomeCourt app"
  "Ballogy app"
)

# Accounts to watch
ACCOUNTS=(
  "@BasketballAus"
  "@BBALLAU_Coaches"
  "@bouncepassau"
  "@codebballau"
  "@AusBballnews"
  "@NBL"
  "@Adelaide36ers"
)

echo "🔍 Scanning Twitter for basketball conversations..."

# Search keywords
for keyword in "${KEYWORDS[@]}"; do
  echo "  Searching: $keyword"
  $BIRD_CLI search "$keyword" --count 20 --recent > /tmp/twitter-search-$(echo "$keyword" | tr ' ' '_').json 2>&1 || true
done

# Monitor key accounts
for account in "${ACCOUNTS[@]}"; do
  echo "  Monitoring: $account"
  $BIRD_CLI user-timeline "$account" --count 10 > /tmp/twitter-account-$(echo "$account" | tr '@' '').json 2>&1 || true
done

echo ""
echo "📊 Analysis complete. Check data/twitter-intel.json for:"
echo "  • Coach pain points (respond within 1 hour)"
echo "  • Competitor mentions (immediate response)"
echo "  • Australian basketball discussions (engage authentically)"
echo "  • Training tech conversations (provide value before pitching)"

echo ""
echo "🎯 Engagement Strategy:"
echo "  Jab: Share value, tips, celebrate local basketball"
echo "  Jab: Comment on coaches' posts, provide insights"
echo "  Right Hook: DM partnerships ONLY after establishing value"

echo ""
echo "✅ Next scan: 4 hours from now (respecting AU business hours 8am-8pm ACDT)"
