#!/bin/bash

# Last30Days Research Tool
# Query real-time trends for marketing research
# Usage: ./last30days-research.sh "basketball training app marketing"
# 
# This script searches across:
# - Brave Search (general web trends)
# - Twitter/X (what people are talking about NOW)
# - Reddit (communities discussing the topic)
# - HN (developer/startup discussions)

set -e

QUERY="${1:-}"

if [ -z "$QUERY" ]; then
  echo "❌ Usage: ./last30days-research.sh \"<query>\""
  echo ""
  echo "Examples:"
  echo "  ./last30days-research.sh \"basketball training app marketing\""
  echo "  ./last30days-research.sh \"apple search ads optimization 2026\""
  echo "  ./last30days-research.sh \"youth basketball coaching technology\""
  exit 1
fi

echo "🔍 Researching: $QUERY"
echo ""

# Function to search Brave
search_brave() {
  local q="$1"
  echo "📰 BRAVE SEARCH RESULTS (Last 30 days)"
  echo "======================================="
  
  # Using web_search with freshness filter
  # This would call the actual web_search function
  echo "[Searching Brave for: $q (last 30 days)]"
  echo "URL: https://search.brave.com/search?q=$(echo "$q" | jq -sRr @uri)&tf=pd"
  echo ""
}

# Function to search Twitter
search_twitter() {
  local q="$1"
  echo "🐦 TWITTER/X DISCUSSIONS (Last 7 days)"
  echo "========================================"
  
  echo "[Searching Twitter for: $q]"
  echo "URL: https://twitter.com/search?q=$(echo "$q" | jq -sRr @uri)%20-filter:retweets&tf=l"
  echo ""
}

# Function to search Reddit
search_reddit() {
  local q="$1"
  echo "🔗 REDDIT DISCUSSIONS (Last 30 days)"
  echo "====================================="
  
  echo "[Searching Reddit for: $q]"
  echo "URL: https://www.reddit.com/search/?q=$(echo "$q" | jq -sRr @uri)&t=month"
  echo ""
}

# Function to search HackerNews
search_hn() {
  local q="$1"
  echo "📊 HACKER NEWS DISCUSSIONS"
  echo "=========================="
  
  echo "[Searching HN for: $q]"
  echo "URL: https://hn.algolia.com/?q=$(echo "$q" | jq -sRr @uri)&sort=byDate&dateRange=last30d"
  echo ""
}

# Run searches
search_brave "$QUERY"
search_twitter "$QUERY"
search_reddit "$QUERY"
search_hn "$QUERY"

echo "✅ Research links ready"
echo ""
echo "💡 TIP: Use these directly or copy/paste into your briefing"
echo "   For automated research, integrate with Brave Search + Twitter API"
