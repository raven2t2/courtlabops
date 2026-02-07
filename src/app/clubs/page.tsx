import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Users, Trophy } from "lucide-react"

export default function ClubsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
        <p className="text-gray-500 mt-1">Australian basketball club directory and partnerships</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FF6B00] text-white rounded-xl">
                <Building2 size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">10</div>
                <div className="text-sm text-gray-500">SA Clubs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-900 text-white rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-gray-500">Venues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 text-white rounded-xl">
                <Trophy size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-gray-500">Tier 1 Clubs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Club Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive map coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
