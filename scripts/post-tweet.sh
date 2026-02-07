#!/bin/bash
# Twitter API v2 Posting Script
# Posts tweets using curl + OAuth 1.0a

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.twitter"

# Load credentials
source "$ENV_FILE"

ACCOUNT="$1"
TEXT="$2"

if [ -z "$ACCOUNT" ] || [ -z "$TEXT" ]; then
    echo "Usage: $0 <account> <text>"
    echo "  account: 'courtlab' or 'esther'"
    exit 1
fi

# Select credentials
if [ "$ACCOUNT" = "courtlab" ]; then
    API_KEY="$COURTLAB_API_KEY"
    API_SECRET="$COURTLAB_API_SECRET"
    ACCESS_TOKEN="$COURTLAB_ACCESS_TOKEN"
    ACCESS_SECRET="$COURTLAB_ACCESS_SECRET"
elif [ "$ACCOUNT" = "esther" ]; then
    API_KEY="$ESTHER_API_KEY"
    API_SECRET="$ESTHER_API_SECRET"
    ACCESS_TOKEN="$ESTHER_ACCESS_TOKEN"
    ACCESS_SECRET="$ESTHER_ACCESS_SECRET"
else
    echo "Error: Unknown account '$ACCOUNT'"
    exit 1
fi

# Use bird CLI with proper auth (simpler than OAuth signing)
bird tweet "$TEXT" \
    --auth-token "$ACCESS_TOKEN" \
    --ct0 "$(echo -n "$ACCESS_SECRET" | base64)" 2>&1

echo "✅ Tweet posted to @$ACCOUNT"
