#!/usr/bin/env python3
"""
Twitter API v2 Posting Script
Posts tweets to @CourtLabApp or @EstherCourtLab
"""

import tweepy
import sys
import os
from pathlib import Path

# Load credentials from .env.twitter
env_path = Path(__file__).parent.parent / '.env.twitter'
credentials = {}
with open(env_path) as f:
    for line in f:
        if line.strip() and not line.startswith('#'):
            key, val = line.strip().split('=', 1)
            credentials[key] = val

def post_tweet(account, text):
    """Post tweet to specified account"""
    if account == 'courtlab':
        client = tweepy.Client(
            consumer_key=credentials['COURTLAB_API_KEY'],
            consumer_secret=credentials['COURTLAB_API_SECRET'],
            access_token=credentials['COURTLAB_ACCESS_TOKEN'],
            access_token_secret=credentials['COURTLAB_ACCESS_SECRET']
        )
    elif account == 'esther':
        client = tweepy.Client(
            consumer_key=credentials['ESTHER_API_KEY'],
            consumer_secret=credentials['ESTHER_API_SECRET'],
            access_token=credentials['ESTHER_ACCESS_TOKEN'],
            access_token_secret=credentials['ESTHER_ACCESS_SECRET']
        )
    else:
        print(f"Error: Unknown account '{account}'")
        sys.exit(1)
    
    try:
        response = client.create_tweet(text=text)
        tweet_id = response.data['id']
        print(f"✅ Tweet posted! ID: {tweet_id}")
        print(f"🔗 https://twitter.com/{account}/status/{tweet_id}")
        return tweet_id
    except Exception as e:
        print(f"❌ Failed to post: {e}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: post-tweet.py <account> <text>")
        print("  account: 'courtlab' or 'esther'")
        sys.exit(1)
    
    account = sys.argv[1]
    text = sys.argv[2]
    post_tweet(account, text)
