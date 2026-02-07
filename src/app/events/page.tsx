import { readJsonFile, EventsData } from "@/lib/data"
import { Calendar, MapPin, Users, Target, ExternalLink } from "lucide-react"

export default function EventsPage() {
  const data = readJsonFile<EventsData>("./assets/event-calendar-sa.json")

  const sortedEvents = [...data.events].sort((a, b) => {
    const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 }
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
  })

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Event Calendar <span className="text-[#F97316]">2026</span>
        </h1>
        <p className="text-[#A1A1AA] mt-2 text-base">Physical presence opportunities. Combines are the Trojan horse.</p>
      </div>

      {/* Events */}
      <div className="space-y-5">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: EventsData["events"][0] }) {
  const priorityColors: Record<string, string> = {
    "Critical": "text-white bg-red-500 border-red-500 shadow-lg shadow-red-500/20",
    "High": "text-amber-950 bg-amber-400 border-amber-400",
    "Medium": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "Low": "text-[#71717A] bg-[#18181B] border-[#27272A]",
  }

  const borderAccent: Record<string, string> = {
    "Critical": "border-l-red-500",
    "High": "border-l-amber-400",
    "Medium": "border-l-blue-400",
    "Low": "border-l-[#3F3F46]",
  }

  return (
    <div className={`bg-[#0F0F11] rounded-2xl border border-[#27272A] border-l-4 ${borderAccent[event.priority] || borderAccent["Medium"]} p-6 hover:border-[#3F3F46] transition-all duration-200`}>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left - Info */}
        <div className="md:col-span-1">
          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border mb-3 ${priorityColors[event.priority] || priorityColors["Medium"]}`}>
            {event.priority.toUpperCase()} PRIORITY
          </span>

          <div className="flex items-center gap-2 text-[#F97316] font-bold mb-2">
            <Calendar size={18} />
            {event.dates}
          </div>

          <h3 className="text-xl font-bold text-white mb-3">{event.name}</h3>

          <div className="flex items-center gap-2 text-[#A1A1AA] text-sm mb-1.5">
            <MapPin size={16} className="text-[#71717A]" />
            {event.location}
          </div>

          <div className="flex items-center gap-2 text-[#A1A1AA] text-sm mb-4">
            <Users size={16} className="text-[#71717A]" />
            {event.expectedAttendance}
          </div>

          <div className="flex flex-wrap gap-2">
            {event.ageGroups.map((age) => (
              <span key={age} className="text-xs px-2.5 py-1 rounded-full bg-[#18181B] text-[#71717A] border border-[#27272A]">
                {age}
              </span>
            ))}
          </div>
        </div>

        {/* Right - Opportunity */}
        <div className="md:col-span-2">
          <div className="bg-[#18181B] rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-emerald-400" />
              <span className="font-bold text-emerald-400 text-sm">CourtLab Opportunity</span>
            </div>
            <p className="text-[#A1A1AA]">{event.courtLabOpportunity}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-[#71717A] uppercase tracking-wider">Action Items</h4>
            <ul className="space-y-2">
              {event.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-[#F97316] mt-0.5 shrink-0">&bull;</span>
                  <span className="text-[#A1A1AA]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-[#F97316] hover:text-[#FB923C] transition-colors"
            >
              <ExternalLink size={14} />
              View Event Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
