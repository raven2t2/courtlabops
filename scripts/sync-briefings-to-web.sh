#!/bin/bash
# Sync all briefings from courtlab-briefings to public/data/briefings for website access

SOURCE_DIR="/data/.openclaw/workspace/courtlab-briefings"
DEST_DIR="/data/.openclaw/workspace/courtlabops-repo/public/data/briefings"

# Create destination if it doesn't exist
mkdir -p "$DEST_DIR"

# Copy all briefing files (JSON + MD)
cp "$SOURCE_DIR"/*.json "$DEST_DIR/" 2>/dev/null || true
cp "$SOURCE_DIR"/*.md "$DEST_DIR/" 2>/dev/null || true

# Generate index of all briefings
node -e "
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('$DEST_DIR');
const briefings = files
  .filter(f => f.endsWith('.json') || f.endsWith('.md'))
  .map(f => {
    const stat = fs.statSync(path.join('$DEST_DIR', f));
    return {
      name: f,
      updated: stat.mtime.toISOString(),
      size: stat.size
    };
  })
  .sort((a, b) => new Date(b.updated) - new Date(a.updated));

fs.writeFileSync(
  path.join('$DEST_DIR', 'index.json'),
  JSON.stringify({ briefings, lastSync: new Date().toISOString() }, null, 2)
);

console.log('✅ Synced', briefings.length, 'briefings to web');
"

# Git commit if there are changes
cd /data/.openclaw/workspace/courtlabops-repo
git add public/data/briefings/ 2>/dev/null
if ! git diff --cached --quiet; then
  git commit -m "chore: Sync briefings to website [automated]" 2>/dev/null || true
  git push origin main 2>/dev/null || true
fi
