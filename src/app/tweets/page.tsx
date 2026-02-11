"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Twitter, Copy, Check, Edit2, Trash2, Plus, X } from "lucide-react"

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editType, setEditType] = useState<"regular" | "pinned">("regular")
  const [editStatus, setEditStatus] = useState("ready_for_posting")
  const [isSaving, setIsSaving] = useState(false)
  const [showNewTweetForm, setShowNewTweetForm] = useState(false)
  const [newTweetAccount, setNewTweetAccount] = useState<"courtlabapp_tweets" | "esthercourtlab_tweets">("courtlabapp_tweets")

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

  const startEdit = (tweet: Tweet, account: string) => {
    setEditingId(tweet.id)
    setEditText(tweet.text)
    setEditType(tweet.type as "regular" | "pinned")
    setEditStatus(tweet.status)
    setNewTweetAccount(account as "courtlabapp_tweets" | "esthercourtlab_tweets")
  }

  const saveTweet = async () => {
    if (!tweetData || !editingId) return
    
    setIsSaving(true)
    try {
      const response = await fetch("/api/tweets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          account: newTweetAccount,
          text: editText,
          type: editType,
          status: editStatus
        })
      })

      if (!response.ok) throw new Error("Failed to save tweet")
      
      const updatedData = await response.json()
      setTweetData(updatedData)
      setEditingId(null)
    } catch (error) {
      console.error("Error saving tweet:", error)
      alert("Failed to save tweet")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteTweet = async (id: string, account: string) => {
    if (!confirm("Delete this tweet?")) return
    
    try {
      const response = await fetch("/api/tweets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, account })
      })

      if (!response.ok) throw new Error("Failed to delete tweet")
      
      const updatedData = await response.json()
      setTweetData(updatedData)
    } catch (error) {
      console.error("Error deleting tweet:", error)
      alert("Failed to delete tweet")
    }
  }

  const addNewTweet = async () => {
    if (!editText.trim()) {
      alert("Tweet text is required")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: newTweetAccount,
          text: editText,
          type: editType,
          status: editStatus
        })
      })

      if (!response.ok) throw new Error("Failed to create tweet")
      
      const updatedData = await response.json()
      setTweetData(updatedData)
      setEditText("")
      setEditType("regular")
      setEditStatus("ready_for_posting")
      setShowNewTweetForm(false)
    } catch (error) {
      console.error("Error creating tweet:", error)
      alert("Failed to create tweet")
    } finally {
      setIsSaving(false)
    }
  }

  if (!tweetData) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-text-secondary">Loading tweets...</div>
      </div>
    )
  }

  const renderTweetCard = (tweet: Tweet, account: "courtlabapp_tweets" | "esthercourtlab_tweets") => {
    const isEditing = editingId === tweet.id
    const isCourtLab = account === "courtlabapp_tweets"
    const accentColor = isCourtLab ? "hyper-blue" : "velocity-orange"

    if (isEditing) {
      return (
        <div key={tweet.id} className="rounded-xl border border-border-default bg-bg-secondary p-4">
          <div className="mb-4 flex items-center gap-2">
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value as "regular" | "pinned")}
              className="rounded px-2 py-1 text-xs bg-bg-tertiary text-text-primary border border-border-default"
            >
              <option value="regular">Regular Tweet</option>
              <option value="pinned">Pinned Tweet</option>
            </select>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="rounded px-2 py-1 text-xs bg-bg-tertiary text-text-primary border border-border-default"
            >
              <option value="ready_for_posting">Ready for Posting</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
            </select>
          </div>
          
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full rounded border border-border-default bg-bg-tertiary p-3 text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-hyper-blue/50"
            rows={6}
          />
          
          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => setEditingId(null)}
              className="px-3 py-2 text-sm rounded bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveTweet}
              disabled={isSaving}
              className="px-3 py-2 text-sm rounded bg-hyper-blue text-white hover:bg-hyper-blue-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )
    }

    return (
      <div 
        key={tweet.id}
        className="rounded-xl border border-border-default bg-bg-secondary p-4 hover:border-hyper-blue/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            tweet.type === 'pinned' 
              ? 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20'
              : `bg-${accentColor}/10 text-${accentColor} border border-${accentColor}/20`
          }`}>
            {tweet.type === 'pinned' ? '📌 Pinned Tweet' : '🐦 Regular Tweet'}
          </span>
          
          <div className="flex items-center gap-1">
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
            <button
              onClick={() => startEdit(tweet, account)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-bg-tertiary hover:bg-bg-primary text-text-secondary text-xs transition-colors"
              title="Edit tweet"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => deleteTweet(tweet.id, account)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-bg-tertiary hover:bg-red-500/10 text-red-500 text-xs transition-colors"
              title="Delete tweet"
            >
              <Trash2 size={12} />
            </button>
          </div>
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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Twitter Drafts</h1>
            <p className="text-text-secondary">Ready-to-post tweets for @CourtLabApp and @EstherCourtLab</p>
          </div>
          <button
            onClick={() => {
              setShowNewTweetForm(!showNewTweetForm)
              setEditText("")
              setEditType("regular")
              setEditStatus("ready_for_posting")
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-hyper-blue px-4 py-2 text-sm font-semibold text-white hover:bg-hyper-blue-hover transition-colors"
          >
            <Plus size={16} />
            New Tweet
          </button>
        </div>

        {showNewTweetForm && (
          <div className="mb-8 rounded-xl border border-hyper-blue/30 bg-hyper-blue/5 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Create New Tweet</h3>
              <button
                onClick={() => setShowNewTweetForm(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>

            <select
              value={newTweetAccount}
              onChange={(e) => setNewTweetAccount(e.target.value as "courtlabapp_tweets" | "esthercourtlab_tweets")}
              className="w-full mb-3 rounded border border-border-default bg-bg-tertiary px-3 py-2 text-text-primary text-sm"
            >
              <option value="courtlabapp_tweets">@CourtLabApp (Brand)</option>
              <option value="esthercourtlab_tweets">@EstherCourtLab (CMO)</option>
            </select>

            <div className="mb-3 flex gap-2">
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value as "regular" | "pinned")}
                className="rounded px-2 py-1 text-xs bg-bg-tertiary text-text-primary border border-border-default"
              >
                <option value="regular">Regular Tweet</option>
                <option value="pinned">Pinned Tweet</option>
              </select>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="rounded px-2 py-1 text-xs bg-bg-tertiary text-text-primary border border-border-default"
              >
                <option value="ready_for_posting">Ready for Posting</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Write your tweet here..."
              className="w-full rounded border border-border-default bg-bg-tertiary p-3 text-text-primary text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-hyper-blue/50 mb-3"
              rows={5}
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNewTweetForm(false)}
                className="px-4 py-2 text-sm rounded bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewTweet}
                disabled={isSaving}
                className="px-4 py-2 text-sm rounded bg-hyper-blue text-white hover:bg-hyper-blue-hover transition-colors disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create Tweet"}
              </button>
            </div>
          </div>
        )}

        {/* @CourtLabApp Tweets */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Twitter size={20} className="text-hyper-blue" />
            <h2 className="text-xl font-bold text-text-primary">@CourtLabApp (Brand)</h2>
          </div>

          <div className="space-y-4">
            {tweetData.courtlabapp_tweets.length === 0 ? (
              <p className="text-text-muted text-sm">No tweets yet. Create one to get started.</p>
            ) : (
              tweetData.courtlabapp_tweets.map((tweet) => renderTweetCard(tweet, "courtlabapp_tweets"))
            )}
          </div>
        </section>

        {/* @EstherCourtLab Tweets */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Twitter size={20} className="text-velocity-orange" />
            <h2 className="text-xl font-bold text-text-primary">@EstherCourtLab (CMO)</h2>
          </div>

          <div className="space-y-4">
            {tweetData.esthercourtlab_tweets.length === 0 ? (
              <p className="text-text-muted text-sm">No tweets yet. Create one to get started.</p>
            ) : (
              tweetData.esthercourtlab_tweets.map((tweet) => renderTweetCard(tweet, "esthercourtlab_tweets"))
            )}
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
