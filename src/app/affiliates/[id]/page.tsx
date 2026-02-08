"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Link2, Copy, Check, ExternalLink } from "lucide-react"

type Affiliate = {
  id: string
  type: string
  name: string
  email?: string
  commission: string
  affiliateLink: string
  status: string
  priority: string
  platform?: string
  followers?: string
  category?: string
  organization?: string
  outreachTemplate: string
  notes?: string
}

type OutreachTemplate = {
  id: string
  type: string
  platform: string
  subject?: string
  body?: string
  text?: string
  variables: string[]
  notes: string
}

export default function AffiliateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [template, setTemplate] = useState<OutreachTemplate | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const affiliateId = params.id as string
    
    Promise.all([
      fetch('/api/affiliates-complete').then(r => r.json()),
      fetch('/api/affiliate-templates').then(r => r.json())
    ]).then(([affData, templData]) => {
      // Find affiliate
      let found: Affiliate | null = null
      
      if (affData.affiliates) {
        const allAff = [
          ...affData.affiliates.COACHES || [],
          ...affData.affiliates.INFLUENCERS || [],
          ...affData.affiliates.MEDIA || [],
          ...affData.affiliates.FACILITIES || [],
          ...affData.affiliates.VENDORS || [],
          ...affData.affiliates.BASKETBALL_ORGS || []
        ]
        found = allAff.find((a: any) => a.id === affiliateId)
      }
      
      if (found) {
        setAffiliate(found as Affiliate)
        
        // Find template
        if (templData.templates) {
          const tmpl = templData.templates.find((t: any) => t.id === (found as Affiliate).outreachTemplate)
          if (tmpl) setTemplate(tmpl)
        }
      }
    }).catch(err => console.error('Failed to load:', err))
  }, [params.id])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addToCampaign = () => {
    if (!affiliate || !template) return
    
    const campaignData = {
      recipient: affiliate.email || affiliate.affiliateLink,
      subject: (template as any).subject || `Partnership: ${affiliate.name}`,
      body: (template as any).body || (template as any).text || 'See template below',
      affiliateId: affiliate.id,
      name: affiliate.name,
      commission: affiliate.commission,
      templateId: template.id
    }
    
    localStorage.setItem('pending-campaign', JSON.stringify(campaignData))
    router.push('/campaigns')
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-text-secondary">Loading affiliate...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-5xl p-6">
        <Link 
          href="/affiliates"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Affiliates
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{affiliate.name}</h1>
              <p className="text-text-secondary mt-1 capitalize">{(affiliate.type ?? "").toLowerCase()}</p>
            </div>
            <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-500/10 text-green-700 border border-green-500/20">
              {affiliate.commission} Commission
            </span>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid gap-4 mb-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Affiliate Link</h3>
            <div className="flex items-center gap-2">
              <code className="text-xs text-text-secondary bg-bg-tertiary px-2 py-1 rounded flex-1">
                {affiliate.affiliateLink}
              </code>
              <button
                onClick={() => copyToClipboard(affiliate.affiliateLink, 'link')}
                className="p-2 hover:bg-bg-tertiary rounded transition-colors"
              >
                {copied === 'link' ? (
                  <Check size={14} className="text-accent-green" />
                ) : (
                  <Copy size={14} className="text-text-muted" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border-default bg-bg-secondary p-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Status</h3>
            <div className="space-y-1">
              <p className="text-sm text-text-primary">{affiliate.status}</p>
              <p className="text-xs text-text-muted capitalize">{affiliate.priority} Priority</p>
            </div>
          </div>
        </div>

        {affiliate.category && (
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
            <h3 className="text-sm font-bold text-text-primary mb-2">Category</h3>
            <p className="text-sm text-text-secondary">{affiliate.category}</p>
          </div>
        )}

        {affiliate.email && (
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
            <h3 className="text-sm font-bold text-text-primary mb-3">Contact</h3>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-text-muted" />
              <a href={`mailto:${affiliate.email}`} className="text-sm text-hyper-blue hover:underline">
                {affiliate.email}
              </a>
            </div>
          </div>
        )}

        {affiliate.notes && (
          <div className="rounded-xl border border-border-default bg-bg-secondary p-4 mb-6">
            <h3 className="text-sm font-bold text-text-primary mb-2">Notes</h3>
            <p className="text-sm text-text-secondary">{affiliate.notes}</p>
          </div>
        )}

        {/* Outreach Template */}
        {template && (
          <div className="rounded-xl border border-hyper-blue/20 bg-hyper-blue/5 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Mail size={18} className="text-hyper-blue" />
                Outreach Template ({template.platform})
              </h3>
              
              <button
                onClick={() => copyToClipboard(
                  `Subject: ${(template as any).subject || ''}\n\n${(template as any).body || (template as any).text || ''}`,
                  'template'
                )}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hyper-blue text-white text-sm font-semibold hover:bg-hyper-blue-hover transition-colors"
              >
                {copied === 'template' ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy Template
                  </>
                )}
              </button>
            </div>

            {(template as any).subject && (
              <div className="mb-3">
                <p className="text-xs text-text-muted mb-1">Subject:</p>
                <div className="rounded-lg bg-bg-primary p-3 border border-border-subtle">
                  <p className="text-sm text-text-primary font-mono">{(template as any).subject}</p>
                </div>
              </div>
            )}

            <div className="mb-3">
              <p className="text-xs text-text-muted mb-1">Body:</p>
              <div className="rounded-lg bg-bg-primary p-4 border border-border-subtle max-h-96 overflow-y-auto">
                <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed font-mono">
                  {(template as any).body || (template as any).text}
                </p>
              </div>
            </div>

            {template.variables && template.variables.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-text-muted mb-2">Variables to customize:</p>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map(v => (
                    <span key={v} className="px-2 py-1 rounded bg-bg-tertiary text-text-primary text-xs font-mono">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-text-muted mb-3 italic">{template.notes}</p>

            <div className="flex gap-2">
              <button
                onClick={addToCampaign}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-hyper-blue text-white text-sm font-semibold hover:bg-hyper-blue-hover transition-colors"
              >
                <ExternalLink size={14} />
                Add to Campaign Queue
              </button>
              
              {affiliate.email && (
                <a
                  href={`mailto:${affiliate.email}?subject=${encodeURIComponent((template as any).subject || 'Partnership Opportunity')}&body=${encodeURIComponent((template as any).body || (template as any).text || '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default bg-bg-secondary text-text-primary text-sm font-semibold hover:bg-bg-tertiary transition-colors"
                >
                  <Mail size={14} />
                  Open in Email Client
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
