#!/bin/bash
#
# CourtLab Content Generator
# Generates daily posts from gallery assets automatically
#

QUEUE_FILE="/data/.openclaw/workspace/courtlabops-repo/data/post-queue.json"
GALLERY_DIR="/data/.openclaw/workspace/courtlabops-repo/shared/gallery/21d9a9dc4a781c60ae3b55b059b31890"
LOG_FILE="/data/.openclaw/workspace/courtlabops-repo/logs/content-gen.log"

mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$QUEUE_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Initialize queue if doesn't exist
if [ ! -f "$QUEUE_FILE" ]; then
    echo "[]" > "$QUEUE_FILE"
    log "Initialized empty queue"
fi

log "=== Content Generation Started ==="

# Generate tomorrow's posts (run at 8 PM daily for next day)
TOMORROW=$(date -d "+1 day" '+%Y-%m-%d')
log "Generating posts for $TOMORROW"

# Create posts using Node.js script
node /data/.openclaw/workspace/courtlabops-repo/scripts/generate-daily-posts.js "$TOMORROW" 2>&1 | tee -a "$LOG_FILE"

log "=== Content Generation Complete ==="
