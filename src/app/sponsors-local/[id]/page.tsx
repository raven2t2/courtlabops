"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Globe, ExternalLink, Copy, Check } from "lucide-react"

type LocalSponsor = {
  id: string
  tier: string
  companyName: string
  industry: string
  website: string
  contactEmail: string
  contactPerson: string
  currentPartnerships: string
  personalizationAnchor: string
  activationBooth: string
  prizeCategory: string
  combineRoles: string[]
  draftedIntro: string
  status: string
  priority: string
  tags: string[]
  nextAction: string
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'BRONZE': { bg: 'bg-amber-900/10', text: 'text-amber-900', border: 'border-amber-900/20' },
  'SILVER': { bg: 'bg-slate-400/10', text: 'text-slate-600', border: 'border-slate-400/20' },
  'GOLD': { bg: 'bg-yellow-500/10', text: 'text-yellow-700', border: 'border-yellow-500/20' }
}

export default function LocalSponsorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [sponsor, setSponsor] = useState<LocalSponsor | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const sponsorId = params.id as string
    
    fetch('/api/sponsors-local')
      .then(res => res.json())
      .then(data => {
        const found = data.sponsors.find((s: LocalSponsor) => s.id === sponsorId)
        if (found) {
          setSponsor(found)
        }
      })
      .catch(err => console.error('Failed to load sponsor:', err))
  }, [params.id])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addToCampaign = () => {
    if (!sponsor) return
    
    const campaignData = {
      recipient: sponsor.contactEmail,
      subject: `Easter Classic 2026 Sponsorship: ${sponsor.companyName}`,
      body: sponsor.draftedIntro,
      sponsorId: sponsor.id,
      company: sponsor.companyName,
      tier: sponsor.tier
    }
    
    localStorage.setItem('pending-campaign', JSON.stringify(campaignData))
    router.push('/campaigns')
  }

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-text-secondary">Loading sponsor...</div>
      </div>
    )
  }

  const tierColor = TIER_COLORS[sponsor.tier]

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-5xl p-6">
        <Link 
          href="/sponsors-local"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Local Sponsors
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{sponsor.companyName}</h1>
              <p className="text-text-secondary mt-1">{sponsor.industry}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${tierColor.bg} ${tierColor.text} ${tierColor.border}`}>
              {sponsor.tier}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sponsor.tags.map(tag => (
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
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-text-muted" />
              <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-hyper-blue hover:underline">
                {sponsor.website}
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-text-muted" />
              <a href={`mailto:${sponsor.contactEmail}`} className="text-sm text-hyper-blue hover:underline">
                {sponsor.contactEmail}
              </a>
            </div>

            <div className="text-sm">
              <span className="text-text-muted">Contact:</span>
              <span className="ml-2 text-text-primary">{sponsor.contactPerson}</span>
            </div>
          </div>
        </div>

        {/* Combine Activation */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
          <h3 className="text-sm font-bold text-text-primary mb-3">Combine Activation</h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-text-muted text-xs">Booth Activation:</span>
              <p className="text-sm text-text-primary mt-1">{sponsor.activationBooth}</p>
            </div>
            
            <div>
              <span className="text-text-muted text-xs">Prize Category:</span>
              <p className="text-sm text-text-primary mt-1">{sponsor.prizeCategory}</p>
            </div>

            <div>
              <span className="text-text-muted text-xs">Combine Roles:</span>
              <ul className="text-sm text-text-primary mt-1 ml-4 list-disc">
                {sponsor.combineRoles.map(role => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why This Sponsor */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
          <h3 className="text-sm font-bold text-text-primary mb-2">Why This Sponsor Fits</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{sponsor.personalizationAnchor}</p>
        </div>

        {/* Custom Pitch */}
        <div className="rounded-xl border border-hyper-blue/20 bg-hyper-blue/5 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Mail size={18} className="text-hyper-blue" />
              Custom Sponsorship Pitch
            </h3>
            
            <button
              onClick={() => copyToClipboard(sponsor.draftedIntro, 'pitch')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hyper-blue text-white text-sm font-semibold hover:bg-hyper-blue-hover transition-colors"
            >
              {copied === 'pitch' ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Pitch
                </>
              )}
            </button>
          </div>

          <div className="rounded-lg bg-bg-primary p-4 border border-border-subtle">
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed font-mono">
              {sponsor.draftedIntro}
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={addToCampaign}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-hyper-blue text-white text-sm font-semibold hover:bg-hyper-blue-hover transition-colors"
            >
              <ExternalLink size={14} />
              Add to Campaign Queue
            </button>
            
            <a
              href={`mailto:${sponsor.contactEmail}?subject=${encodeURIComponent('Easter Classic 2026 Sponsorship: ' + sponsor.companyName)}&body=${encodeURIComponent(sponsor.draftedIntro)}`}
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
