#!/bin/bash
#
# CourtLab Social Media Auto-Poster
# Checks for approved posts and publishes them
#

LOG_FILE="/data/.openclaw/workspace/courtlabops-repo/logs/auto-post.log"
API_ENDPOINT="http://localhost:3000/api/post"

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Auto-Post Run Started ==="

# Call the API to publish approved posts
RESPONSE=$(curl -s -X POST "$API_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{}' 2>&1)

if [ $? -eq 0 ]; then
    log "API Response: $RESPONSE"
    
    # Check if any posts were published
    POSTED=$(echo "$RESPONSE" | grep -o '"posted":[0-9]*' | cut -d: -f2)
    FAILED=$(echo "$RESPONSE" | grep -o '"failed":[0-9]*' | cut -d: -f2)
    
    if [ "$POSTED" -gt 0 ] 2>/dev/null; then
        log "✓ Successfully posted $POSTED items"
    fi
    
    if [ "$FAILED" -gt 0 ] 2>/dev/null; then
        log "✗ Failed to post $FAILED items"
    fi
    
    if [ -z "$POSTED" ] || [ "$POSTED" = "0" ]; then
        log "No posts ready to publish"
    fi
else
    log "✗ API call failed: $RESPONSE"
fi

log "=== Auto-Post Run Complete ==="
