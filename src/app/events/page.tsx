import { readJsonFile, EventsData } from "@/lib/data";
import { Calendar, MapPin, Users, Target, ExternalLink, AlertCircle } from "lucide-react";

export default function EventsPage() {
  const data = readJsonFile<EventsData>("./assets/event-calendar-sa.json");

  // Sort by priority
  const sortedEvents = [...data.events].sort((a, b) => {
    const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">
          Event <span className="gradient-text">Calendar 2026</span>
        </h1>
        <p className="text-court-muted text-lg">
          Physical presence opportunities. Combines are the Trojan horse.
        </p>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        {sortedEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: EventsData["events"][0]; index: number }) {
  const priorityColors: Record<string, { bg: string; text: string }> = {
    "Critical": { bg: "bg-court-accent", text: "text-white" },
    "High": { bg: "bg-court-warning", text: "text-black" },
    "Medium": { bg: "bg-court-muted", text: "text-white" },
    "Low": { bg: "bg-court-highlight", text: "text-court-muted" }
  };

  const colors = priorityColors[event.priority] || priorityColors["Medium"];

  return (
    <div 
      className="bg-court-secondary rounded-2xl p-6 border-l-4 border-court-success card-hover animate-slide-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Info */}
        <div className="md:col-span-1">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${colors.bg} ${colors.text}`}>
            {event.priority} PRIORITY
          </span>
          
          <div className="flex items-center gap-2 text-court-accent font-bold mb-2">
            <Calendar size={18} />
            {event.dates}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{event.name}</h3>
          
          <div className="flex items-center gap-2 text-court-muted text-sm mb-1">
            <MapPin size={16} className="text-court-accent" />
            {event.location}
          </div>
          
          <div className="flex items-center gap-2 text-court-muted text-sm mb-3">
            <Users size={16} className="text-court-accent" />
            {event.expectedAttendance}
          </div>

          <div className="flex flex-wrap gap-2">
            {event.ageGroups.map((age) => (
              <span 
                key={age} 
                className="text-xs px-2 py-1 rounded bg-court-primary text-court-muted"
              >
                {age}
              </span>
            ))}
          </div>
        </div>

        {/* Middle Column - Opportunity */}
        <div className="md:col-span-2">
          <div className="bg-court-primary rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-court-success" />
              <span className="font-bold text-court-success">CourtLab Opportunity</span>
            </div>
            <p className="text-court-muted">{event.courtLabOpportunity}</p>
          </div>

          {/* Action Items */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-court-muted uppercase tracking-wide">Action Items</h4>
            <ul className="space-y-2">
              {event.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-court-accent mt-0.5">•</span>
                  <span className="text-court-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {event.website && (
            <a 
              href={event.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-court-accent hover:underline"
            >
              <ExternalLink size={14} />
              View Event Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
