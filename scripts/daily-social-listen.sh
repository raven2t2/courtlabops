#!/bin/bash
# CourtLab Daily Social Listening Automation
# Run via cron: 0 9 * * * /data/.openclaw/workspace/courtlab-crm/scripts/daily-social-listen.sh

set -e

# Twitter/X Authentication
export AUTH_TOKEN="618eca89893e473ae3f6b52e16af9d2fcdc1ed47"
export CT0="8558cf6ebc849c79ec6397cee5f1f46f9d95c369b3694e60426911c04d88a0ca6d54b9d6aaad7ef834ba9b5f58a265564be77cdd9eef26c3a0d8788760169cbfa254abfb7252b6797de9a0ce4d4596ce"

WORKSPACE="/data/.openclaw/workspace/courtlab-crm"
DATE=$(date +%Y-%m-%d)
OUTPUT_DIR="$WORKSPACE/social-listening/$DATE"
mkdir -p "$OUTPUT_DIR"

echo "[$DATE] Starting CourtLab social listening..."

# Check if bird is authenticated
if ! bird whoami > /dev/null 2>&1; then
    echo "ERROR: Bird not authenticated. Check AUTH_TOKEN and CT0."
    exit 1
fi

# AFFILIATE PROSPECTS SEARCHES
echo "[$DATE] Searching for affiliate prospects..."

bird search "basketball coach Adelaide" -n 30 --json > "$OUTPUT_DIR/coach-adelaide.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/coach-adelaide.json"
bird search "basketball training Australia" -n 30 --json > "$OUTPUT_DIR/training-australia.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/training-australia.json"
bird search "basketball skills coach" -n 30 --json > "$OUTPUT_DIR/skills-coach.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/skills-coach.json"
bird search "basketball content creator" -n 30 --json > "$OUTPUT_DIR/content-creator.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/content-creator.json"
bird search "basketball development" -n 30 --json > "$OUTPUT_DIR/development.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/development.json"

# TARGET CUSTOMER SEARCHES
echo "[$DATE] Searching for target customers..."

bird search "basketball club Adelaide" -n 30 --json > "$OUTPUT_DIR/club-adelaide.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/club-adelaide.json"
bird search "basketball association" -n 30 --json > "$OUTPUT_DIR/association.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/association.json"
bird search "basketball trials" -n 30 --json > "$OUTPUT_DIR/trials.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/trials.json"
bird search "basketball tournament" -n 30 --json > "$OUTPUT_DIR/tournament.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/tournament.json"

# COMPETITOR MONITORING
echo "[$DATE] Monitoring competitors..."

bird search "HomeCourt app" -n 20 --json > "$OUTPUT_DIR/competitor-homecourt.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/competitor-homecourt.json"
bird search "Ballogy" -n 20 --json > "$OUTPUT_DIR/competitor-ballogy.json" 2>/dev/null || echo "[]" > "$OUTPUT_DIR/competitor-ballogy.json"

echo "[$DATE] Social listening complete. Results in: $OUTPUT_DIR"
echo "[$DATE] Run processing script: node $WORKSPACE/scripts/process-social-leads.js $DATE"
