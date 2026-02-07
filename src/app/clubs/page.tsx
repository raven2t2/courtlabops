import { Building2, MapPin, Trophy } from "lucide-react"

export default function ClubsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Clubs</h1>
        <p className="text-[#A1A1AA] mt-2 text-base">Australian basketball club directory and partnerships</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F97316]/10 rounded-xl">
              <Building2 size={24} className="text-[#F97316]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">10</div>
              <div className="text-sm text-[#71717A]">SA Clubs</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#18181B] rounded-xl">
              <MapPin size={24} className="text-[#71717A]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-sm text-[#71717A]">Venues</div>
            </div>
          </div>
        </div>

        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-400/10 rounded-xl">
              <Trophy size={24} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-sm text-[#71717A]">Tier 1 Clubs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#27272A]">
          <h2 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider">Club Map</h2>
        </div>
        <div className="h-96 flex items-center justify-center">
          <p className="text-[#71717A]">Interactive map coming soon</p>
        </div>
      </div>
    </div>
  )
}
