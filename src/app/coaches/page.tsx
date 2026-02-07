import coachPartnersData from "../../../assets/coach-partners-australia.json"
import type { CoachesData } from "@/lib/data"
import { MapPin, Instagram, Target, Trophy } from "lucide-react"

export default function CoachesPage() {
  const data = coachPartnersData as CoachesData

  const sortedProspects = [...data.prospects].sort((a, b) => {
    const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 }
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
  })

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Coach Partners</h1>
        <p className="text-[#A1A1AA] mt-2 text-base">Micro-influencers for affiliate program</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="text-3xl font-bold text-white">{data.prospects.length}</div>
          <div className="text-sm text-[#71717A] mt-1">Total Prospects</div>
        </div>
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="text-3xl font-bold text-white">1</div>
          <div className="text-sm text-[#71717A] mt-1">Critical Priority</div>
        </div>
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="text-3xl font-bold text-white">2</div>
          <div className="text-sm text-[#71717A] mt-1">High Priority</div>
        </div>
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="text-3xl font-bold text-white">158K</div>
          <div className="text-sm text-[#71717A] mt-1">Max Reach (Nay)</div>
        </div>
      </div>

      {/* Criteria */}
      <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
        <h3 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider mb-5">Target Criteria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[#71717A] uppercase tracking-wide">Followers</div>
            <div className="font-medium text-white mt-1">{data.criteria.followerRange}</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] uppercase tracking-wide">Location</div>
            <div className="font-medium text-white mt-1">{data.criteria.location}</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] uppercase tracking-wide">Vibe</div>
            <div className="font-medium text-white mt-1">{data.criteria.vibe}</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] uppercase tracking-wide">Content</div>
            <div className="font-medium text-white mt-1">{data.criteria.contentType}</div>
          </div>
        </div>
      </div>

      {/* Prospects Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {sortedProspects.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
      </div>
    </div>
  )
}

function CoachCard({ coach }: { coach: CoachesData["prospects"][0] }) {
  const priorityColors: Record<string, string> = {
    "Critical": "text-white bg-red-500 border-red-500 shadow-lg shadow-red-500/20",
    "High": "text-amber-950 bg-amber-400 border-amber-400",
    "Medium": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  }

  return (
    <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6 hover:border-[#3F3F46] transition-all duration-200">
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border mb-3 ${priorityColors[coach.priority] || "text-[#71717A] bg-[#18181B] border-[#27272A]"}`}>
            {coach.priority.toUpperCase()}
          </span>
          <h3 className="text-xl font-bold text-white">{coach.name}</h3>
          <div className="flex items-center gap-2 text-[#F97316] font-medium mt-1.5">
            <Instagram size={16} />
            {coach.handle}
          </div>
        </div>
        <div className="bg-[#18181B] px-4 py-2 rounded-xl text-center">
          <div className="text-lg font-bold text-white">{coach.followers >= 1000 ? `${(coach.followers / 1000).toFixed(0)}K` : coach.followers}</div>
          <div className="text-xs text-[#71717A]">followers</div>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
          <MapPin size={16} className="text-[#71717A]" />
          {coach.location}
        </div>
        <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
          <Trophy size={16} className="text-[#71717A]" />
          {coach.role}
        </div>
      </div>

      <div className="bg-[#18181B] rounded-xl p-4 mb-5">
        <p className="text-sm text-[#A1A1AA] italic">&ldquo;{coach.vibe}&rdquo;</p>
      </div>

      <div className="mb-5">
        <h4 className="text-xs font-bold text-[#A1A1AA] uppercase mb-1.5 flex items-center gap-1.5">
          <Target size={12} />
          Why Good Fit
        </h4>
        <p className="text-sm text-[#71717A]">{coach.whyGoodFit}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {coach.tags.map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[#18181B] text-[#71717A] border border-[#27272A]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
