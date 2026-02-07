import { Settings, User, Bell, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#A1A1AA] mt-2 text-base">Manage your account and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27272A] flex items-center gap-2">
            <User size={18} className="text-[#F97316]" />
            <h2 className="font-semibold text-white">Profile</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-[#A1A1AA]">Name</label>
              <input defaultValue="Michael Ragland" className="w-full mt-1.5 px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#A1A1AA]">Email</label>
              <input defaultValue="michael@courtlab.app" className="w-full mt-1.5 px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#A1A1AA]">Role</label>
              <input defaultValue="Founder" disabled className="w-full mt-1.5 px-4 py-2.5 bg-[#09090B] border border-[#27272A] rounded-xl text-sm text-[#71717A] cursor-not-allowed" />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#F97316] rounded-xl hover:bg-[#FB923C] hover:shadow-lg hover:shadow-[#F97316]/20 transition-all duration-200 active:scale-[0.98]">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27272A] flex items-center gap-2">
            <Bell size={18} className="text-[#F97316]" />
            <h2 className="font-semibold text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-1 divide-y divide-[#27272A]">
            <div className="flex items-center justify-between py-3">
              <span className="text-[#A1A1AA]">Email notifications</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#A1A1AA]">Lead alerts</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#A1A1AA]">Campaign updates</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#18181B] text-[#71717A]">Disabled</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27272A] flex items-center gap-2">
            <Shield size={18} className="text-[#F97316]" />
            <h2 className="font-semibold text-white">Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-[#A1A1AA]">Current Password</label>
              <input type="password" defaultValue="********" className="w-full mt-1.5 px-4 py-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 transition-all" />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#A1A1AA] bg-[#0F0F11] border border-[#27272A] rounded-xl hover:bg-[#18181B] hover:text-white hover:border-[#3F3F46] transition-all duration-200">
              Change Password
            </button>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-[#0F0F11] rounded-2xl border border-[#27272A] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27272A] flex items-center gap-2">
            <Settings size={18} className="text-[#F97316]" />
            <h2 className="font-semibold text-white">Integrations</h2>
          </div>
          <div className="p-6 space-y-1 divide-y divide-[#27272A]">
            <div className="flex items-center justify-between py-3">
              <span className="text-[#A1A1AA]">Apple Search Ads</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">Connected</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#A1A1AA]">Google Sheets</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#18181B] text-[#71717A]">Disconnected</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#A1A1AA]">Brave Search API</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
