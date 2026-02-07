import { 
  Users, 
  Calendar, 
  Target, 
  Trophy,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-[#A1A1AA] mt-2 text-base max-w-xl">Australia-first execution. Combines are the Trojan horse.</p>
        </div>
        <span className="text-sm text-[#71717A] font-medium">Feb 7, 2026</span>
      </div>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard icon={Users} value="18" label="Total Club Leads" trend="+8 VIC" />
          <StatCard icon={Calendar} value="6" label="Upcoming Events" trend="1 critical" critical />
          <StatCard icon={Trophy} value="5" label="Coach Prospects" trend="3 high" />
          <StatCard icon={Target} value="5" label="Competitors" trend="Tracking" />
        </div>
      </section>

      {/* Two columns */}
      <div className="grid xl:grid-cols-2 gap-8">
        {/* Priority Actions */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Priority Actions</h2>
            <span className="text-xs font-semibold px-3 py-1.5 bg-[#F97316]/10 text-[#F97316] rounded-full border border-[#F97316]/20">
              3 items
            </span>
          </div>
          
          <div className="space-y-3">
            <ActionCard 
              priority="Critical"
              title="Easter Classic 2026"
              desc="Apr 3-6, 2026 — 8 weeks out. Perfect combine opportunity."
              meta="8 weeks"
            />
            <ActionCard 
              priority="High"
              title="Dodo Elyazar Follow-up"
              desc="Jan tour completed. Pitch ongoing 2026 camp partnerships."
              meta="Follow-up"
            />
            <ActionCard 
              priority="Medium"
              title="Forestville Eagles Outreach"
              desc="Zane's club — warm lead. Personalized email ready."
              meta="Ready"
            />
          </div>
        </section>

        {/* Campaign Performance */}
        <section className="space-y-5">
          <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Performance</h2>
          
          <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A1A1AA]">Apple Search Ads</span>
                <span className="text-sm font-semibold text-white">161 imp</span>
              </div>
              <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                <div className="h-full w-[12%] bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full" />
              </div>
              <p className="text-xs text-[#71717A]">Too early for conclusions. Check Feb 13.</p>
            </div>

            <div className="pt-5 border-t border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A1A1AA]">Outreach</span>
                <span className="text-sm font-semibold text-white">0/10 sent</span>
              </div>
              <p className="text-xs text-[#71717A]">Waiting for your review.</p>
            </div>

            <div className="pt-5 border-t border-[#27272A]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Next Review</span>
                <span className="text-sm text-[#71717A]">Feb 13</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Links */}
      <section className="space-y-5">
        <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLink title="Leads" desc="18 clubs ready (SA + VIC)" href="/leads" />
          <QuickLink title="Events" desc="Easter Classic" href="/events" />
          <QuickLink title="Competitors" desc="5 analyzed" href="/competitors" />
          <QuickLink title="Coaches" desc="5 prospects" href="/coaches" />
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, value, label, trend, critical }: { 
  icon: typeof Users
  value: string
  label: string
  trend: string
  critical?: boolean
}) {
  return (
    <div className="group bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6 hover:border-[#3F3F46] transition-all duration-200 active:scale-[0.99]">
      <div className="flex items-start justify-between">
        <div className="p-2.5 bg-[#18181B] rounded-xl">
          <Icon size={20} className="text-[#71717A]" />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${critical ? "text-white bg-red-500 shadow-lg shadow-red-500/20" : "text-[#71717A]"}`}>
          {trend}
        </span>
      </div>
      <div className="mt-5">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm text-[#71717A] mt-1">{label}</div>
      </div>
    </div>
  )
}

function ActionCard({ priority, title, desc, meta }: { 
  priority: string
  title: string
  desc: string
  meta: string
}) {
  const colors: Record<string, string> = {
    "Critical": "text-white bg-red-500 border-red-500 shadow-lg shadow-red-500/20",
    "High": "text-amber-950 bg-amber-400 border-amber-400",
    "Medium": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  }

  return (
    <button className="w-full group flex items-center gap-4 p-5 bg-[#0F0F11] rounded-2xl border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181B] transition-all duration-200 text-left active:scale-[0.98]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${colors[priority]}`}>
            {priority.toUpperCase()}
          </span>
          <span className="text-xs font-medium text-[#71717A]">{meta}</span>
        </div>
        <h3 className="font-semibold text-white truncate">{title}</h3>
        <p className="text-sm text-[#71717A] mt-1 line-clamp-1">{desc}</p>
      </div>
      <div className="p-2 rounded-xl bg-[#18181B] group-hover:bg-[#27272A] transition-colors shrink-0">
        <ChevronRight size={18} className="text-[#3F3F46] group-hover:text-[#A1A1AA] transition-colors" />
      </div>
    </button>
  )
}

function QuickLink({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <a href={href} className="group block p-5 bg-[#0F0F11] rounded-2xl border border-[#27272A] hover:border-[#F97316]/40 hover:bg-[#18181B] transition-all duration-200 active:scale-[0.98]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">{title}</span>
        <div className="p-1.5 rounded-lg bg-[#18181B] group-hover:bg-[#27272A] transition-colors">
          <ArrowUpRight size={14} className="text-[#3F3F46] group-hover:text-[#F97316] transition-colors" />
        </div>
      </div>
      <span className="text-sm text-[#71717A]">{desc}</span>
    </a>
  )
}
