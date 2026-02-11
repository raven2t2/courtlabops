"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Twitter, Copy, Check } from "lucide-react"

type Tweet = {
  id: string
  type: string
  text: string
  status: string
}

type TweetData = {
  courtlabapp_tweets: Tweet[]
  esthercourtlab_tweets: Tweet[]
  created_at: string
}

export default function TweetsPage() {
  const [tweetData, setTweetData] = useState<TweetData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Fetch tweet data from API route
    const fetchTweets = async () => {
      try {
        const response = await fetch("/api/tweets")
        if (!response.ok) throw new Error("Failed to fetch tweets")
        const data = await response.json()
        setTweetData(data)
      } catch (error) {
        console.error("Error loading tweets:", error)
        // Fallback to empty state if fetch fails
        setTweetData({
          courtlabapp_tweets: [],
          esthercourtlab_tweets: [],
          created_at: new Date().toISOString()
        })
      }
    }
    fetchTweets()
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!tweetData) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-text-secondary">Loading tweets...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="mx-auto max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-text-primary mb-2">Twitter Drafts</h1>
        <p className="text-text-secondary mb-8">Ready-to-post tweets for @CourtLabApp and @EstherCourtLab</p>

        {/* @CourtLabApp Tweets */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Twitter size={20} className="text-hyper-blue" />
            <h2 className="text-xl font-bold text-text-primary">@CourtLabApp (Brand)</h2>
          </div>

          <div className="space-y-4">
            {tweetData.courtlabapp_tweets.map((tweet) => (
              <div 
                key={tweet.id}
                className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-hyper-blue/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    tweet.type === 'pinned' 
                      ? 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20'
                      : 'bg-hyper-blue/10 text-hyper-blue border border-hyper-blue/20'
                  }`}>
                    {tweet.type === 'pinned' ? '📌 Pinned Tweet' : '🐦 Regular Tweet'}
                  </span>
                  
                  <button
                    onClick={() => copyToClipboard(tweet.text, tweet.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-xs transition-colors"
                  >
                    {copied === tweet.id ? (
                      <>
                        <Check size={12} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                  {tweet.text}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-text-muted">Status:</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20">
                    {tweet.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* @EstherCourtLab Tweets */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Twitter size={20} className="text-velocity-orange" />
            <h2 className="text-xl font-bold text-text-primary">@EstherCourtLab (CMO)</h2>
          </div>

          <div className="space-y-4">
            {tweetData.esthercourtlab_tweets.map((tweet) => (
              <div 
                key={tweet.id}
                className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-velocity-orange/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    tweet.type === 'pinned' 
                      ? 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20'
                      : 'bg-velocity-orange/10 text-velocity-orange border border-velocity-orange/20'
                  }`}>
                    {tweet.type === 'pinned' ? '📌 Pinned Tweet' : '🐦 Regular Tweet'}
                  </span>
                  
                  <button
                    onClick={() => copyToClipboard(tweet.text, tweet.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-xs transition-colors"
                  >
                    {copied === tweet.id ? (
                      <>
                        <Check size={12} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                  {tweet.text}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-text-muted">Status:</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-accent-green/10 text-accent-green border border-accent-green/20">
                    {tweet.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 p-4 rounded-xl bg-bg-secondary border border-border-subtle">
          <p className="text-xs text-text-muted">
            <strong>Note:</strong> These tweets are ready to post. Click "Copy" to copy the tweet text, 
            then paste into Twitter/X. Pinned tweets should be posted first and pinned to the profile.
          </p>
        </div>
      </div>
    </div>
  )
}
