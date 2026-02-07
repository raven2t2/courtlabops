import { readJsonFile, CompetitorsData } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, XCircle, CheckCircle, DollarSign, AlertTriangle } from "lucide-react"

export default function CompetitorsPage() {
  const data = readJsonFile<CompetitorsData>("./assets/competitor-analysis.json")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Competitor Analysis</h1>
        <p className="text-gray-500 mt-1">What they claim, what they charge, what they do poorly</p>
      </div>

      {/* Summary */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Biggest Threats</h3>
              <p className="text-lg font-semibold">{data.summary.biggestThreats.join(" & ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Our Differentiation</h3>
              <p className="text-lg font-semibold text-[#FF6B00]">{data.summary.differentiation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitors */}
      <div className="space-y-4">
        {data.competitors.map((competitor) => (
          <CompetitorCard key={competitor.name} competitor={competitor} />
        ))}
      </div>
    </div>
  )
}

function CompetitorCard({ competitor }: { competitor: CompetitorsData["competitors"][0] }) {
  const threatColors: Record<string, string> = {
    "High": "bg-red-100 text-red-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Low-Medium": "bg-amber-50 text-amber-600",
    "Low": "bg-green-100 text-green-700",
  }

  const price = competitor.whatTheyCharge.monthly 
    || competitor.whatTheyCharge.yearly 
    || competitor.whatTheyCharge.model 
    || "Freemium"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gray-50 p-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{competitor.name}</h2>
            <p className="text-gray-500">{competitor.company}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#FF6B00] font-bold text-xl">
              <DollarSign size={20} />
              {price}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${threatColors[competitor.threatLevel]}`}>
              {competitor.threatLevel} THREAT
            </span>
          </div>
        </div>
      </div>

      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">What They Claim</h3>
              <p className="text-gray-600">{competitor.whatTheyClaim.primary}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-red-600 uppercase mb-2 flex items-center gap-2">
                <XCircle size={16} />
                User Complaints
              </h3>
              <ul className="space-y-2">
                {competitor.whatTheyDontDoWell.userComplaints.slice(0, 4).map((complaint, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-500 mt-0.5">✗</span>
                    {complaint}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-green-600 uppercase mb-2 flex items-center gap-2">
              <CheckCircle size={16} />
              CourtLab Advantage
            </h3>
            <ul className="space-y-3">
              {competitor.courtLabAdvantage.slice(0, 4).map((advantage, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">{advantage}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-[#FF6B00]">
              <p className="text-xs text-gray-600 italic">{competitor.notes}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
