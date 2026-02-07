import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Mail, Users, TrendingUp } from "lucide-react"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500 mt-1">Outreach and marketing campaigns</p>
        </div>
        <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
          New Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">10</div>
            <div className="text-sm text-gray-500">Emails Drafted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-gray-500">Emails Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">0%</div>
            <div className="text-sm text-gray-500">Response Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">0</div>
            <div className="text-sm text-gray-500">Meetings Set</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
        </CardContent>
      </Card>
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
    "Draft": "bg-gray-100 text-gray-700",
    "Planning": "bg-amber-100 text-amber-700",
    "Research": "bg-blue-100 text-blue-700",
    "Active": "bg-green-100 text-green-700",
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[status]}`}>
            {status}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>{leads} leads</span>
          <span>{sent} sent</span>
        </div>
      </div>
      <div className="w-32">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FF6B00] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
