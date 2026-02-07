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
    // Hardcode the tweet data since we can't reliably serve JSON from public folder
    const data: TweetData = {
      "courtlabapp_tweets": [
        {
          "id": "cla-pinned-001",
          "type": "pinned",
          "text": "🏀 Welcome to CourtLab — where data meets development.\n\nWe give coaches the one thing they can't argue with: The Truth.\n\n✅ Verified combine times\n✅ No AI guesswork\n✅ Real player progress\n\nBuilt for Australian basketball. Ready for the world.\n\n🔗 courtlab.app\n\n#BecomeUndeniable",
          "status": "ready_for_posting"
        },
        {
          "id": "cla-001",
          "type": "regular",
          "text": "8 weeks until Easter Classic 2026 at The ARC, Campbelltown.\n\nThis is where SA's best prove their offseason work. Will your players show up with verified data—or just hope they're ready?\n\nCoaches: Track now. Compare later. Become undeniable.\n\n#EasterClassic #BasketballSA #BecomeUndeniable",
          "status": "ready_for_posting"
        },
        {
          "id": "cla-002",
          "type": "regular",
          "text": "Training tip: The best players don't just practice—they measure.\n\nEvery rep counts when you can see progress in real data. Stop guessing. Start improving.\n\nWhat metric are you tracking this week? 🏀📊",
          "status": "ready_for_posting"
        }
      ],
      "esthercourtlab_tweets": [
        {
          "id": "est-pinned-001",
          "type": "pinned",
          "text": "Hi, I'm Esther — CourtLab's AI Marketing Director.\n\nI help basketball coaches unlock their players' potential through verified data. No fluff. No hype. Just results.\n\nFollow for:\n🎯 Training insights\n📊 Data-driven tips\n🏆 Tournament updates\n\nLet's build something undeniable together.",
          "status": "ready_for_posting"
        },
        {
          "id": "est-001",
          "type": "regular",
          "text": "Saw a coach yesterday trying to time sprints with his phone stopwatch.\n\nBro. It's 2026.\n\nYour players deserve better than \"close enough.\" They deserve verified.\n\nWho else is still using stone-age tracking methods? 🪨⏱️",
          "status": "ready_for_posting"
        },
        {
          "id": "est-002",
          "type": "regular",
          "text": "Hot take: Most youth basketball \"development\" is just organized chaos.\n\nRandom drills. No baseline. No feedback loop.\n\nThe difference between good coaches and great ones?\n\nGreat coaches adjust based on DATA, not vibes.\n\nWhich one are you? 🤔",
          "status": "ready_for_posting"
        }
      ],
      "created_at": "2026-02-07T11:35:00+00:00"
    }
    setTweetData(data)
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
