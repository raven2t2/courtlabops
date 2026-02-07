import { readJsonFile, CoachesData } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, MapPin, Instagram, Target, Users } from "lucide-react"

export default function CoachesPage() {
  const data = readJsonFile<CoachesData>("./assets/coach-partners-australia.json")

  // Sort by priority
  const sortedProspects = [...data.prospects].sort((a, b) => {
    const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 }
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Coach Partners</h1>
        <p className="text-gray-500 mt-1">Micro-influencers for affiliate program</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{data.prospects.length}</div>
            <div className="text-sm text-gray-500">Total Prospects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">1</div>
            <div className="text-sm text-gray-500">Critical Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">2</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">158K</div>
            <div className="text-sm text-gray-500">Max Reach (Nay)</div>
          </CardContent>
        </Card>
      </div>

      {/* Criteria */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Target Criteria</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase">Followers</div>
              <div className="font-medium">{data.criteria.followerRange}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Location</div>
              <div className="font-medium">{data.criteria.location}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Vibe</div>
              <div className="font-medium">{data.criteria.vibe}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Content</div>
              <div className="font-medium">{data.criteria.contentType}</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
    "Critical": "bg-red-100 text-red-700",
    "High": "bg-[#FF6B00] text-white",
    "Medium": "bg-gray-100 text-gray-700",
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${priorityColors[coach.priority]}`}>
              {coach.priority}
            </span>
            <h3 className="text-xl font-bold text-gray-900">{coach.name}</h3>
            <div className="flex items-center gap-2 text-[#FF6B00] font-medium mt-1">
              <Instagram size={16} />
              {coach.handle}
            </div>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <div className="text-lg font-bold">{coach.followers >= 1000 ? `${(coach.followers / 1000).toFixed(0)}K` : coach.followers}</div>
            <div className="text-xs text-gray-500">followers</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={16} className="text-gray-400" />
            {coach.location}
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Trophy size={16} className="text-gray-400" />
            {coach.role}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 italic">"{coach.vibe}"</p>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase mb-1 flex items-center gap-1">
            <Target size={12} />
            Why Good Fit
          </h4>
          <p className="text-sm text-gray-600">{coach.whyGoodFit}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {coach.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <Button className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}
