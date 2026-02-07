#!/bin/bash
# Sync courtlab-crm workspace data to repo for deployment
# Run this after updating kanban, leads, affiliates, or twitter drafts

set -e

CRM_PATH="/data/.openclaw/workspace/courtlab-crm"
REPO_PATH="/data/.openclaw/workspace/courtlabops-repo"

echo "🔄 Syncing CRM data to repo..."

# Kanban
cp "$CRM_PATH/kanban/board.json" "$REPO_PATH/data/crm/kanban/"
echo "✅ Kanban synced"

# Leads
cp "$CRM_PATH/leads/sa-basketball-clubs.json" "$REPO_PATH/data/crm/leads/"
echo "✅ SA leads synced"

# Affiliates
cp "$CRM_PATH/affiliate-leads-v1.json" "$REPO_PATH/data/crm/affiliates/"
echo "✅ Affiliates synced"

# Twitter drafts
cp "$CRM_PATH/twitter-drafts.json" "$REPO_PATH/data/crm/twitter/"
echo "✅ Twitter drafts synced"

cd "$REPO_PATH"
git add data/crm
if git diff --cached --quiet; then
  echo "✨ No changes to commit"
else
  git commit -m "Auto-sync: CRM data updated"
  git push origin main
  echo "🚀 Pushed to GitHub - Vercel will auto-deploy"
fi
