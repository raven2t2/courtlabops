#!/bin/bash

# Update briefings-index.json whenever cron jobs sync briefings

BRIEFINGS_DIR="public/data/briefings"
INDEX_FILE="public/data/briefings-index.json"

# Generate the index JSON
{
  echo "{"
  echo '  "briefings": ['
  
  ls -1rt "$BRIEFINGS_DIR" | tail -1 > /dev/null || exit 1
  
  ls -1r "$BRIEFINGS_DIR" | grep -E '\.(md|json)$' | while IFS= read -r file; do
    echo "    \"$file\","
  done | sed '$ s/,$//'
  
  echo "  ],"
  echo "  \"count\": $(ls -1 "$BRIEFINGS_DIR" | grep -E '\.(md|json)$' | wc -l),"
  echo "  \"lastUpdated\": \"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\""
  echo "}"
} > "$INDEX_FILE"

echo "✅ Updated $INDEX_FILE with $(cat "$INDEX_FILE" | grep -o '"count":[^,]*' | cut -d: -f2) briefings"

# Commit and push
git add "$INDEX_FILE"
git commit -m "chore: Auto-update briefings index ($(date +'%Y-%m-%d %H:%M'))" || true
git push origin main 2>&1 | grep -E "(main|error)" || true
