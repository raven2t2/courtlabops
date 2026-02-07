import { Mail, Target, TrendingUp, Plus } from "lucide-react"

export default function CampaignsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Campaigns</h1>
          <p className="text-[#A1A1AA] mt-2 text-base">Outreach and marketing campaigns</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#F97316] rounded-xl hover:bg-[#FB923C] hover:shadow-lg hover:shadow-[#F97316]/20 transition-all duration-200 active:scale-[0.98]">
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Mail} value="10" label="Emails Drafted" />
        <StatCard icon={Target} value="0" label="Emails Sent" />
        <StatCard icon={TrendingUp} value="0%" label="Response Rate" />
        <StatCard icon={Mail} value="0" label="Meetings Set" />
      </div>

      {/* Active Campaigns */}
      <section className="space-y-5">
        <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Active Campaigns</h2>
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] divide-y divide-[#27272A]">
          <CampaignRow
            name="SA Club Outreach"
            status="Draft"
            leads={10}
            sent={0}
            progress={0}
          />
          <CampaignRow
            name="Easter Classic Sponsorship"
            status="Planning"
            leads={1}
            sent={0}
            progress={10}
          />
          <CampaignRow
            name="Coach Affiliate Program"
            status="Research"
            leads={5}
            sent={0}
            progress={5}
          />
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: typeof Mail; value: string; label: string }) {
  return (
    <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6 hover:border-[#3F3F46] transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="p-2.5 bg-[#18181B] rounded-xl">
          <Icon size={20} className="text-[#71717A]" />
        </div>
      </div>
      <div className="mt-5">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-[#71717A] mt-1">{label}</div>
      </div>
    </div>
  )
}

function CampaignRow({
  name,
  status,
  leads,
  sent,
  progress
}: {
  name: string
  status: string
  leads: number
  sent: number
  progress: number
}) {
  const statusColors: Record<string, string> = {
    "Draft": "text-[#71717A] bg-[#18181B] border-[#27272A]",
    "Planning": "text-amber-950 bg-amber-400 border-amber-400",
    "Research": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "Active": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  }

  return (
    <div className="flex items-center justify-between p-5 hover:bg-[#18181B]/50 transition-colors duration-200">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">{name}</h3>
          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[status] || statusColors["Draft"]}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-[#71717A]">
          <span>{leads} leads</span>
          <span>{sent} sent</span>
        </div>
      </div>
      <div className="w-36">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[#71717A]">Progress</span>
          <span className="font-semibold text-white">{progress}%</span>
        </div>
        <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full transition-all"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
