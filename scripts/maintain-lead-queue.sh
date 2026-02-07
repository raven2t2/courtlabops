#!/bin/bash
# Maintain 10-lead minimum in "Outreach Ready" kanban column
# When Michael clears leads, automatically research + draft 10 more

set -e

KANBAN_FILE="/data/.openclaw/workspace/courtlab-crm/kanban/board.json"
MIN_LEADS=10

echo "🔍 Checking lead queue..."

# Count leads in "drafted" column
CURRENT_COUNT=$(jq '.columns[] | select(.id == "drafted") | .leads | length' "$KANBAN_FILE")

echo "📊 Current leads in queue: $CURRENT_COUNT"

if [ "$CURRENT_COUNT" -lt "$MIN_LEADS" ]; then
    NEEDED=$((MIN_LEADS - CURRENT_COUNT))
    echo "⚠️  Below minimum! Need $NEEDED more leads."
    echo ""
    echo "🤖 Auto-research triggered:"
    echo "  1. Search Brave for SA basketball clubs"
    echo "  2. Verify contact info + social profiles"
    echo "  3. Research personalization anchors"
    echo "  4. Draft custom outreach emails"
    echo "  5. Add to kanban 'drafted' column"
    echo ""
    echo "📝 This will be implemented as an OpenClaw agent task."
    echo "   For now, alerting Michael that queue needs refill."
else
    echo "✅ Queue healthy ($CURRENT_COUNT >= $MIN_LEADS)"
fi

echo ""
echo "📋 Lead Pipeline Status:"
jq -r '.columns[] | "\(.name): \(.leads | length) leads"' "$KANBAN_FILE"
