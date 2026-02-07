import competitorAnalysisData from "../../../assets/competitor-analysis.json"
import type { CompetitorsData } from "@/lib/data"
import { XCircle, CheckCircle, DollarSign } from "lucide-react"

export default function CompetitorsPage() {
  const data = competitorAnalysisData as CompetitorsData

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Competitor Analysis</h1>
        <p className="text-[#A1A1AA] mt-2 text-base">What they claim, what they charge, what they do poorly</p>
      </div>

      {/* Summary */}
      <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-[#71717A] uppercase tracking-wider mb-2">Biggest Threats</h3>
            <p className="text-lg font-semibold text-white">{data.summary.biggestThreats.join(" & ")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#71717A] uppercase tracking-wider mb-2">Our Differentiation</h3>
            <p className="text-lg font-semibold text-[#F97316]">{data.summary.differentiation}</p>
          </div>
        </div>
      </div>

      {/* Competitors */}
      <div className="space-y-6">
        {data.competitors.map((competitor) => (
          <CompetitorCard key={competitor.name} competitor={competitor} />
        ))}
      </div>
    </div>
  )
}

function CompetitorCard({ competitor }: { competitor: CompetitorsData["competitors"][0] }) {
  const threatColors: Record<string, string> = {
    "High": "text-white bg-red-500 border-red-500 shadow-lg shadow-red-500/20",
    "Medium": "text-amber-950 bg-amber-400 border-amber-400",
    "Low-Medium": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    "Low": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  }

  const price = competitor.whatTheyCharge.monthly
    || competitor.whatTheyCharge.yearly
    || competitor.whatTheyCharge.model
    || "Freemium"

  return (
    <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden hover:border-[#3F3F46] transition-all duration-200">
      {/* Header */}
      <div className="bg-[#18181B] p-6 border-b border-[#27272A]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{competitor.name}</h2>
            <p className="text-[#71717A]">{competitor.company}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#F97316] font-bold text-xl">
              <DollarSign size={20} />
              {price}
            </span>
            <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${threatColors[competitor.threatLevel] || "text-[#71717A] bg-[#18181B] border-[#27272A]"}`}>
              {competitor.threatLevel.toUpperCase()} THREAT
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">What They Claim</h3>
              <p className="text-[#A1A1AA]">{competitor.whatTheyClaim.primary}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <XCircle size={16} />
                User Complaints
              </h3>
              <ul className="space-y-2">
                {competitor.whatTheyDontDoWell.userComplaints.slice(0, 4).map((complaint, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                    <span className="text-red-400 mt-0.5 shrink-0">&#10005;</span>
                    {complaint}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle size={16} />
              CourtLab Advantage
            </h3>
            <ul className="space-y-3">
              {competitor.courtLabAdvantage.slice(0, 4).map((advantage, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#10003;</span>
                  <span className="text-[#A1A1AA]">{advantage}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 p-4 bg-[#18181B] rounded-xl border-l-4 border-[#F97316]">
              <p className="text-sm text-[#71717A] italic">{competitor.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
