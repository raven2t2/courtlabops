import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Bell, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={20} className="text-[#FF6B00]" />
              <CardTitle>Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input defaultValue="Michael Ragland" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input defaultValue="michael@courtlab.app" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <Input defaultValue="Founder" disabled className="mt-1 bg-gray-50" />
            </div>
            <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-[#FF6B00]" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Email notifications</span>
              <Badge variant="success">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Lead alerts</span>
              <Badge variant="success">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Campaign updates</span>
              <Badge variant="secondary">Disabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-[#FF6B00]" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <Input type="password" value="********" className="mt-1" />
            </div>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-[#FF6B00]" />
              <CardTitle>Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Apple Search Ads</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Google Sheets</span>
                <Badge variant="secondary">Disconnected</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Brave Search API</span>
                <Badge variant="success">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
