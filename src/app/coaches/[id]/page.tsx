"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Twitter, ExternalLink, Copy, Check } from "lucide-react"

type Coach = {
  id: string
  firstName: string
  lastName: string
  club: string
  role: string
  state: string
  contactEmail: string
  twitter?: string
  contactMethod: string
  personalizationAnchor: string
  draftedIntro: string
  status: string
  priority: string
  tags: string[]
  lastContact: string | null
  nextAction: string
}

export default function CoachDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const coachId = params.id as string
    
    fetch('/api/coaches')
      .then(res => res.json())
      .then(data => {
        const found = data.coachProspects.find((c: Coach) => c.id === coachId)
        if (found) {
          setCoach(found)
        }
      })
      .catch(err => console.error('Failed to load coach:', err))
  }, [params.id])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addToCampaign = () => {
    if (!coach) return
    
    const campaignData = {
      recipient: coach.contactEmail,
      subject: `${coach.firstName} — CourtLab for ${coach.club}`,
      body: coach.draftedIntro,
      coachId: coach.id,
      coachName: `${coach.firstName} ${coach.lastName}`,
      club: coach.club
    }
    
    localStorage.setItem('pending-campaign', JSON.stringify(campaignData))
    router.push('/campaigns')
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-text-secondary">Loading coach...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-5xl p-6">
        <Link 
          href="/coaches"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Coaches
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                {coach.firstName} {coach.lastName}
              </h1>
              <p className="text-text-secondary mt-1">{coach.role} at {coach.club}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              coach.priority === 'Critical' ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' :
              coach.priority === 'High' ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' :
              'bg-hyper-blue/10 text-hyper-blue border border-hyper-blue/20'
            }`}>
              {coach.priority} Priority
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {coach.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded bg-bg-tertiary text-text-muted text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
          <h3 className="text-sm font-bold text-text-primary mb-3">Contact Information</h3>
          
          <div className="space-y-2">
            {coach.contactEmail && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-text-muted" />
                <a href={`mailto:${coach.contactEmail}`} className="text-sm text-hyper-blue hover:underline">
                  {coach.contactEmail}
                </a>
              </div>
            )}
            
            {coach.twitter && (
              <div className="flex items-center gap-2">
                <Twitter size={14} className="text-text-muted" />
                <a href={`https://twitter.com/${coach.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-hyper-blue hover:underline">
                  {coach.twitter}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Why This Coach */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
          <h3 className="text-sm font-bold text-text-primary mb-2">Why This Coach Fits</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{coach.personalizationAnchor}</p>
        </div>

        {/* Custom Outreach */}
        <div className="rounded-xl border border-hyper-blue/20 bg-hyper-blue/5 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Mail size={18} className="text-hyper-blue" />
              Custom Email Outreach
            </h3>
            
            <button
              onClick={() => copyToClipboard(coach.draftedIntro, 'email')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hyper-blue text-white text-sm font-semibold hover:bg-hyper-blue-hover transition-colors"
            >
              {copied === 'email' ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Email
                </>
              )}
            </button>
          </div>

          <div className="rounded-lg bg-bg-primary p-4 border border-border-subtle">
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed font-mono">
              {coach.draftedIntro}
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={addToCampaign}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-white text-sm font-semibold hover:bg-accent-green/90 transition-colors"
            >
              <ExternalLink size={14} />
              Add to Campaign Queue
            </button>
            
            <a
              href={`mailto:${coach.contactEmail}?subject=${encodeURIComponent(coach.firstName + ' — CourtLab Partnership')}&body=${encodeURIComponent(coach.draftedIntro)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default bg-bg-secondary text-text-primary text-sm font-semibold hover:bg-bg-tertiary transition-colors"
            >
              <Mail size={14} />
              Open in Email Client
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
