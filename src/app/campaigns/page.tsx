"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Check,
  Clock,
  Edit3,
  Eye,
  Filter,
  Mail,
  MessageSquare,
  Search,
  Send,
  Trash2,
  User,
  Users,
  ChevronRight,
  ChevronDown,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

type CampaignStatus = "draft" | "ready" | "sending" | "sent" | "scheduled"
type EmailStatus = "pending" | "sent" | "opened" | "replied" | "bounced"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  tone: "friendly" | "professional" | "urgent"
}

interface Recipient {
  id: string
  name: string
  email: string
  club: string
  role?: string
  location: string
  status: EmailStatus
  sentAt?: string
  openedAt?: string
}

interface Campaign {
  id: string
  name: string
  description: string
  templateId: string
  status: CampaignStatus
  recipients: Recipient[]
  createdAt: string
  scheduledFor?: string
  sentAt?: string
  stats: {
    total: number
    sent: number
    opened: number
    replied: number
  }
}

// Sample campaigns from our research
const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: "campaign-001",
    name: "SA Basketball Clubs — Initial Outreach",
    description: "First touch to South Australian district clubs introducing CourtLab combines",
    templateId: "template-001",
    status: "ready",
    recipients: [
      { id: "r1", name: "Forestville Eagles", email: "admin@forestvilleeagles.com.au", club: "Forestville Eagles", location: "SA", status: "pending" },
      { id: "r2", name: "Sturt Sabres", email: "info@sturtbasketball.com", club: "Sturt Sabres", location: "SA", status: "pending" },
      { id: "r3", name: "North Adelaide Rockets", email: "admin@nabasketball.com.au", club: "North Adelaide Rockets", location: "SA", status: "pending" },
      { id: "r4", name: "West Adelaide Bearcats", email: "info@westadelaidebearcats.com.au", club: "West Adelaide Bearcats", location: "SA", status: "pending" },
      { id: "r5", name: "South Adelaide Panthers", email: "admin@sabasketball.com", club: "South Adelaide Panthers", location: "SA", status: "pending" },
      { id: "r6", name: "Eastern Mavericks", email: "info@easternmavericks.com.au", club: "Eastern Mavericks", location: "SA", status: "pending" },
    ],
    createdAt: "2026-02-07T10:00:00",
    stats: { total: 6, sent: 0, opened: 0, replied: 0 },
  },
  {
    id: "campaign-002",
    name: "Melbourne Expansion — Elite Clubs",
    description: "Outreach to Victorian NBL1 and Big V clubs",
    templateId: "template-002",
    status: "ready",
    recipients: [
      { id: "r7", name: "Melbourne Tigers", email: "info@melbournetigers.com.au", club: "Melbourne Tigers", location: "VIC", status: "pending" },
      { id: "r8", name: "Knox Raiders", email: "admin@knoxbasketball.com.au", club: "Knox Raiders", location: "VIC", status: "pending" },
      { id: "r9", name: "Eltham Wildcats", email: "info@elthamwildcats.com.au", club: "Eltham Wildcats", location: "VIC", status: "pending" },
      { id: "r10", name: "Nunawading Spectres", email: "admin@nunawadingbasketball.com.au", club: "Nunawading Spectres", location: "VIC", status: "pending" },
      { id: "r11", name: "Frankston Blues", email: "mitchell.condick@fdba.com.au", club: "Frankston Blues", location: "VIC", role: "GM", status: "pending" },
    ],
    createdAt: "2026-02-07T11:00:00",
    stats: { total: 5, sent: 0, opened: 0, replied: 0 },
  },
  {
    id: "campaign-003",
    name: "Easter Classic 2026 — Sponsor Outreach",
    description: "Sponsorship proposals for Easter Classic event",
    templateId: "template-003",
    status: "draft",
    recipients: [
      { id: "r12", name: "Revo Fitness", email: "partnerships@revofitness.com.au", club: "Revo Fitness", location: "SA", status: "pending" },
      { id: "r13", name: "Adelaide 36ers", email: "commercial@adelaide36ers.com", club: "Adelaide 36ers", location: "SA", status: "pending" },
    ],
    createdAt: "2026-02-07T12:00:00",
    stats: { total: 2, sent: 0, opened: 0, replied: 0 },
  },
]

const TEMPLATES: Record<string, EmailTemplate> = {
  "template-001": {
    id: "template-001",
    name: "Initial Club Outreach",
    subject: "Verified combines for {{club_name}} — Easter Classic 2026",
    body: `Hi {{name}},

I'm reaching out from CourtLab — we're building the digital infrastructure for elite basketball development here in Australia.

We're running verified combines at Easter Classic 2026 (April 3-6, The ARC Campbelltown) and I'd love to discuss how {{club_name}} could benefit:

• Live leaderboards on big screens — your players get the spotlight
• Scout-ready PDFs distributed to college recruiters
• 23% faster improvement through verified tracking (not AI guesswork)
• Free club portal to track all your players year-round

Would you be open to a 10-minute call this week to discuss partnership options?

Best,
Michael Ragland
Founder, CourtLab
https://courtlab.app`,
    tone: "professional",
  },
  "template-002": {
    id: "template-002",
    name: "Victorian Expansion",
    subject: "Bringing verified combines to {{club_name}}",
    body: `Hi {{name}},

CourtLab is expanding to Victoria, and {{club_name}} is on our radar as a leading development program.

Our verified combine technology is being used at Easter Classic 2026 with 300+ players. We're offering Victorian clubs early access to:

• Verified player tracking (no AI gimmicks)
• Live tournament leaderboards
• Recruiting exposure to US college coaches
• Year-round player development data

Are you the right person to discuss partnership opportunities? If not, could you point me in the right direction?

Thanks,
Michael Ragland
Founder, CourtLab`,
    tone: "professional",
  },
  "template-003": {
    id: "template-003",
    name: "Sponsorship Proposal",
    subject: "Easter Classic 2026 — Partnership Opportunity",
    body: `Hi {{name}},

Easter Classic 2026 (April 3-6, The ARC Campbelltown) is bringing together 300+ elite youth basketball players from across Australia — and we're looking for partners who want to reach this audience.

Sponsorship tiers available:
• Platinum ($5-10K): Title sponsor, logo on all leaderboards, 50 player kits
• Gold ($2.5-5K): Co-sponsor, digital branding, 25 player kits
• Silver ($1-2.5K): Logo placement, 10 player kits
• Bronze ($500-1K): Brand mention, 5 player kits

All sponsors get visibility on our live leaderboards viewed by 300+ players and 500+ parents throughout the weekend.

Can we schedule a 15-minute call to discuss?

Best,
Michael Ragland
Founder, CourtLab
https://courtlab.app`,
    tone: "professional",
  },
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; tone: string; icon: typeof Clock }> = {
  draft: { label: "Draft", tone: "border-text-muted bg-bg-tertiary text-text-muted", icon: Edit3 },
  ready: { label: "Ready to Send", tone: "border-accent-green/40 bg-accent-green-muted text-accent-green", icon: Check },
  sending: { label: "Sending...", tone: "border-accent-amber/40 bg-accent-amber-muted text-accent-amber", icon: Clock },
  sent: { label: "Sent", tone: "border-hyper-blue/40 bg-hyper-blue-muted text-hyper-blue", icon: Send },
  scheduled: { label: "Scheduled", tone: "border-accent-violet/40 bg-accent-violet-muted text-accent-violet", icon: Clock },
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-bg-secondary/75 p-4 sm:p-5", className)}>{children}</section>
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", className)}>
      {children}
    </span>
  )
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set())
  const [previewMode, setPreviewMode] = useState(false)
  const [previewRecipient, setPreviewRecipient] = useState<Recipient | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | "all">("all")
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set())
  const [isSending, setIsSending] = useState(false)

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const toggleCampaignExpand = (campaignId: string) => {
    setExpandedCampaigns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId)
      } else {
        newSet.add(campaignId)
      }
      return newSet
    })
  }

  const toggleRecipient = (recipientId: string) => {
    setSelectedRecipients(prev => {
      const newSet = new Set(prev)
      if (newSet.has(recipientId)) {
        newSet.delete(recipientId)
      } else {
        newSet.add(recipientId)
      }
      return newSet
    })
  }

  const selectAllRecipients = (campaign: Campaign) => {
    const pendingRecipients = campaign.recipients.filter(r => r.status === "pending")
    if (pendingRecipients.length === 0) return
    
    setSelectedRecipients(prev => {
      const newSet = new Set(prev)
      const allSelected = pendingRecipients.every(r => newSet.has(r.id))
      
      if (allSelected) {
        pendingRecipients.forEach(r => newSet.delete(r.id))
      } else {
        pendingRecipients.forEach(r => newSet.add(r.id))
      }
      return newSet
    })
  }

  const personalizeTemplate = (template: EmailTemplate, recipient: Recipient): { subject: string; body: string } => {
    let subject = template.subject.replace(/\{\{club_name\}\}/g, recipient.club)
    let body = template.body.replace(/\{\{name\}\}/g, recipient.name)
    body = body.replace(/\{\{club_name\}\}/g, recipient.club)
    
    return { subject, body }
  }

  const handleSend = async (campaign: Campaign, recipientIds?: string[]) => {
    setIsSending(true)
    
    const targets = recipientIds 
      ? campaign.recipients.filter(r => recipientIds.includes(r.id))
      : campaign.recipients.filter(r => r.status === "pending")
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update campaign status
    setCampaigns(prev => prev.map(c => {
      if (c.id !== campaign.id) return c
      
      const updatedRecipients = c.recipients.map(r => {
        if (targets.some(t => t.id === r.id)) {
          return { ...r, status: "sent" as EmailStatus, sentAt: new Date().toISOString() }
        }
        return r
      })
      
      const sentCount = updatedRecipients.filter(r => r.status === "sent").length
      
      return {
        ...c,
        recipients: updatedRecipients,
        status: sentCount === updatedRecipients.length ? "sent" : "sending",
        sentAt: sentCount === updatedRecipients.length ? new Date().toISOString() : c.sentAt,
        stats: {
          ...c.stats,
          sent: sentCount,
        }
      }
    }))
    
    setSelectedRecipients(new Set())
    setIsSending(false)
    
    alert(`Sent to ${targets.length} recipients!`)
  }

  const handleQuickSend = (campaign: Campaign) => {
    const pendingCount = campaign.recipients.filter(r => r.status === "pending").length
    if (pendingCount === 0) {
      alert("No pending recipients to send to")
      return
    }
    
    if (confirm(`Send to all ${pendingCount} pending recipients?`)) {
      handleSend(campaign)
    }
  }

  const totalStats = {
    campaigns: campaigns.length,
    totalRecipients: campaigns.reduce((acc, c) => acc + c.recipients.length, 0),
    pendingRecipients: campaigns.reduce((acc, c) => acc + c.recipients.filter(r => r.status === "pending").length, 0),
    sentEmails: campaigns.reduce((acc, c) => acc + c.stats.sent, 0),
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_-20%,oklch(0.45_0.14_258/.18),transparent_36%),radial-gradient(circle_at_92%_-18%,oklch(0.58_0.17_42/.16),transparent_40%)]">
      <div className="mx-auto w-full max-w-none p-4 pb-8 pt-4 sm:p-6 lg:px-8">
        {/* Header */}
        <Surface className="mb-4 border-border-default bg-bg-secondary/85">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Email Campaigns</p>
                {totalStats.pendingRecipients > 0 && (
                  <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                    {totalStats.pendingRecipients} Pending
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Campaign Manager</h1>
              <p className="mt-1 text-sm text-text-secondary">Select recipients and send with one click</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-primary px-3 py-2">
                <Search size={14} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted sm:w-44"
                />
              </label>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-green px-3 py-2 text-sm font-semibold text-white">
                <Mail size={14} /> New Campaign
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Campaigns", value: totalStats.campaigns, icon: MessageSquare, tone: "text-text-primary" },
              { label: "Total Recipients", value: totalStats.totalRecipients, icon: Users, tone: "text-hyper-blue" },
              { label: "Pending", value: totalStats.pendingRecipients, icon: Clock, tone: "text-accent-amber" },
              { label: "Sent", value: totalStats.sentEmails, icon: Send, tone: "text-accent-green" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-xl border border-border-subtle bg-bg-primary p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">{item.label}</p>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl bg-bg-tertiary", item.tone)}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <p className={cn("text-3xl font-extrabold", item.tone)}>{item.value}</p>
                </div>
              )
            })}
          </div>
        </Surface>

        {/* Campaigns List */}
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">Active Campaigns</h2>
            <div className="flex gap-1">
              {["all", "ready", "sent", "draft"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as CampaignStatus | "all")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    filterStatus === status
                      ? "bg-hyper-blue text-white"
                      : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-bg-primary py-12">
                <Mail size={32} className="mb-2 text-text-muted" />
                <p className="text-sm text-text-secondary">No campaigns found</p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => {
                const status = STATUS_CONFIG[campaign.status]
                const StatusIcon = status.icon
                const template = TEMPLATES[campaign.templateId]
                const isExpanded = expandedCampaigns.has(campaign.id)
                const pendingRecipients = campaign.recipients.filter(r => r.status === "pending")
                const selectedCount = campaign.recipients.filter(r => selectedRecipients.has(r.id)).length

                return (
                  <div
                    key={campaign.id}
                    className="rounded-xl border border-border-subtle bg-bg-primary overflow-hidden"
                  >
                    {/* Campaign Header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-bg-tertiary/30 transition-colors"
                      onClick={() => toggleCampaignExpand(campaign.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={status.tone}>
                              <StatusIcon size={10} className="mr-1" />
                              {status.label}
                            </Badge>
                            <span className="text-xs text-text-muted">{campaign.recipients.length} recipients</span>
                            {pendingRecipients.length > 0 && (
                              <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                                {pendingRecipients.length} pending
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-base font-semibold text-text-primary">{campaign.name}</h3>
                          <p className="text-sm text-text-secondary mt-1">{campaign.description}</p>
                          
                          {/* Quick Stats */}
                          <div className="flex gap-4 mt-2 text-xs">
                            <span className="text-text-muted">
                              <CheckCircle size={12} className="inline mr-1 text-accent-green" />
                              {campaign.stats.sent} sent
                            </span>
                            <span className="text-text-muted">
                              <Eye size={12} className="inline mr-1 text-hyper-blue" />
                              {campaign.stats.opened} opened
                            </span>
                            <span className="text-text-muted">
                              <MessageSquare size={12} className="inline mr-1 text-accent-violet" />
                              {campaign.stats.replied} replied
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {pendingRecipients.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickSend(campaign)
                              }}
                              disabled={isSending}
                              className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-3 py-2 text-sm font-semibold text-white hover:bg-accent-green/90 disabled:opacity-50"
                            >
                              <Send size={14} />
                              Send All ({pendingRecipients.length})
                            </button>
                          )}
                          <button className="p-2 rounded-lg hover:bg-bg-tertiary">
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Recipients List */}
                    {isExpanded && (
                      <div className="border-t border-border-subtle p-4 bg-bg-secondary/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="text-sm font-semibold text-text-primary">Recipients</h4>
                            {pendingRecipients.length > 0 && (
                              <button
                                onClick={() => selectAllRecipients(campaign)}
                                className="text-xs text-hyper-blue hover:underline"
                              >
                                {selectedCount === pendingRecipients.length ? "Deselect All" : "Select All Pending"}
                              </button>
                            )}
                          </div>
                          {selectedCount > 0 && (
                            <button
                              onClick={() => handleSend(campaign, Array.from(selectedRecipients))}
                              disabled={isSending}
                              className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-green/90 disabled:opacity-50"
                            >
                              <Send size={12} />
                              Send Selected ({selectedCount})
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {campaign.recipients.map((recipient) => {
                            const isSelected = selectedRecipients.has(recipient.id)
                            
                            return (
                              <div
                                key={recipient.id}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                  isSelected
                                    ? "border-accent-green bg-accent-green-muted/20"
                                    : "border-border-subtle bg-bg-primary hover:border-border-default"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleRecipient(recipient.id)}
                                  disabled={recipient.status !== "pending"}
                                  className="h-4 w-4 rounded border-border-default bg-bg-primary text-accent-green focus:ring-accent-green"
                                />
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <User size={14} className="text-text-muted" />
                                    <span className="text-sm font-medium text-text-primary truncate">{recipient.name}</span>
                                    {recipient.role && (
                                      <Badge className="border-border-default bg-bg-tertiary text-text-secondary">
                                        {recipient.role}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail size={12} className="text-text-muted" />
                                    <span className="text-xs text-text-secondary truncate">{recipient.email}</span>
                                    <span className="text-text-muted">·</span>
                                    <span className="text-xs text-text-muted">{recipient.location}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {recipient.status === "sent" && (
                                    <Badge className="border-accent-green/40 bg-accent-green-muted text-accent-green">
                                      <Check size={10} className="mr-1" />
                                      Sent
                                    </Badge>
                                  )}
                                  {recipient.status === "pending" && (
                                    <Badge className="border-accent-amber/40 bg-accent-amber-muted text-accent-amber">
                                      <Clock size={10} className="mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      setPreviewRecipient(recipient)
                                      setPreviewMode(true)
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary"
                                    title="Preview email"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  
                                  <a
                                    href={`mailto:${recipient.email}?subject=${encodeURIComponent(template?.subject || "")}`}
                                    className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary"
                                    title="Open in mail client"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </Surface>
      </div>

      {/* Email Preview Modal */}
      {previewMode && previewRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border border-border-subtle bg-bg-secondary">
            <div className="sticky top-0 flex items-center justify-between border-b border-border-subtle bg-bg-secondary/95 p-4 backdrop-blur">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Email Preview</h3>
                <p className="text-sm text-text-secondary">To: {previewRecipient.name} &lt;{previewRecipient.email}&gt;</p>
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="p-2 rounded-lg hover:bg-bg-tertiary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {(() => {
                const campaign = campaigns.find(c => c.recipients.some(r => r.id === previewRecipient.id))
                const template = campaign ? TEMPLATES[campaign.templateId] : null
                const { subject, body } = template ? personalizeTemplate(template, previewRecipient) : { subject: "", body: "" }
                
                return (
                  <>
                    <div className="mb-6">
                      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Subject</label>
                      <p className="mt-1 text-lg font-medium text-text-primary">{subject}</p>
                    </div>
                    
                    <div className="rounded-xl border border-border-subtle bg-white p-6">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                        {body}
                      </pre>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => {
                          setPreviewMode(false)
                          if (campaign) handleSend(campaign, [previewRecipient.id])
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-green py-3 text-sm font-semibold text-white hover:bg-accent-green/90"
                      >
                        <Send size={16} />
                        Send Now
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(body)
                          alert("Copied to clipboard!")
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-primary px-4 py-3 text-sm font-semibold text-text-secondary hover:bg-bg-tertiary"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
