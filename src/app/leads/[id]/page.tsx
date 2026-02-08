"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Twitter, ExternalLink, Copy, Check, Globe, Facebook, Instagram } from "lucide-react"

type Lead = {
  id: string
  clubName: string
  location: string
  state: string
  tier: string
  contactEmail: string
  website: string
  facebook?: string
  instagram?: string
  personalizationAnchor: string
  draftedIntro: string
  status: string
  lastContact: string | null
  nextAction: string
  priority: string
  notes: string
  tags: string[]
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const leadId = params.id as string
    
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        const found = (data.leads || []).find((l: Lead) => l.id === leadId)
        if (found) {
          setLead(found)
        } else {
          console.error('Lead not found:', leadId)
        }
      })
      .catch(err => console.error('Failed to load lead:', err))
  }, [params.id])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addToCampaign = () => {
    if (!lead) return
    
    // Create campaign entry
    const campaignData = {
      recipient: lead.contactEmail,
      subject: `${lead.clubName} + CourtLab Partnership Opportunity`,
      body: lead.draftedIntro,
      leadId: lead.id,
      clubName: lead.clubName
    }
    
    localStorage.setItem('pending-campaign', JSON.stringify(campaignData))
    router.push('/campaigns')
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-text-secondary">Loading lead...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-5xl p-6">
        <Link 
          href="/leads"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Leads
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{lead.clubName}</h1>
              <p className="text-text-secondary mt-1">{lead.location}, {lead.state}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              lead.priority === 'High' ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' :
              lead.priority === 'Medium' ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' :
              'bg-hyper-blue/10 text-hyper-blue border border-hyper-blue/20'
            }`}>
              {lead.priority} Priority
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {lead.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded bg-bg-tertiary text-text-muted text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid gap-4 mb-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Contact Information</h3>
            
            <div className="space-y-2">
              {lead.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-text-muted" />
                  <a href={`mailto:${lead.contactEmail}`} className="text-sm text-hyper-blue hover:underline">
                    {lead.contactEmail}
                  </a>
                </div>
              )}
              
              {lead.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-text-muted" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sm text-hyper-blue hover:underline">
                    Website
                  </a>
                </div>
              )}
              
              {lead.facebook && (
                <div className="flex items-center gap-2">
                  <Facebook size={14} className="text-text-muted" />
                  <a href={`https://${lead.facebook}`} target="_blank" rel="noopener noreferrer" className="text-sm text-hyper-blue hover:underline">
                    Facebook
                  </a>
                </div>
              )}
              
              {lead.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram size={14} className="text-text-muted" />
                  <a href={`https://${lead.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-hyper-blue hover:underline">
                    Instagram
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Lead Intelligence</h3>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-text-muted">Tier:</span>
                <span className="ml-2 text-text-primary font-medium">{lead.tier}</span>
              </div>
              <div>
                <span className="text-text-muted">Status:</span>
                <span className="ml-2 text-text-primary font-medium">{lead.status}</span>
              </div>
              <div>
                <span className="text-text-muted">Next Action:</span>
                <span className="ml-2 text-text-primary font-medium">{lead.nextAction}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Lead Fits */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
          <h3 className="text-sm font-bold text-text-primary mb-2">Why CourtLab Fits</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{lead.personalizationAnchor}</p>
        </div>

        {/* Custom Outreach */}
        <div className="rounded-xl border border-hyper-blue/20 bg-hyper-blue/5 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Mail size={18} className="text-hyper-blue" />
              Custom Email Outreach
            </h3>
            
            <button
              onClick={() => copyToClipboard(lead.draftedIntro, 'email')}
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
              {lead.draftedIntro}
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
              href={`mailto:${lead.contactEmail}?subject=${encodeURIComponent(lead.clubName + ' + CourtLab Partnership')}&body=${encodeURIComponent(lead.draftedIntro)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default bg-bg-secondary text-text-primary text-sm font-semibold hover:bg-bg-tertiary transition-colors"
            >
              <Mail size={14} />
              Open in Email Client
            </a>
          </div>
        </div>

        {/* Internal Notes */}
        <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
          <h3 className="text-sm font-bold text-text-primary mb-2">Internal Notes</h3>
          <p className="text-sm text-text-secondary">{lead.notes}</p>
        </div>
      </div>
    </div>
  )
}
