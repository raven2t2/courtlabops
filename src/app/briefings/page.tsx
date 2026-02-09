"use client"

import { useEffect, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Users, Zap, AlertCircle, Cloud } from "lucide-react"

interface BriefingData {
  date: string
  timestamp: number
  sections: Record<string, any>
}

export default function BriefingsPage() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    fetchBriefing(selectedDate)
  }, [selectedDate])

  const fetchBriefing = async (date: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/briefings/${date}`)
      if (response.ok) {
        const data = await response.json()
        setBriefing(data)
      } else {
        setBriefing(null)
      }
    } catch (error) {
      console.error("Error fetching briefing:", error)
      setBriefing(null)
    } finally {
      setLoading(false)
    }
  }

  const goToPreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split("T")[0])
  }

  const goToNextDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + 1)
    setSelectedDate(date.toISOString().split("T")[0])
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-2">Daily Briefing</h1>
          <p className="text-text-secondary">Your CourtLab morning intelligence report</p>
        </div>
      </div>

      <div className="bg-bg-secondary border-b border-border-primary sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center">
              <p className="text-lg font-semibold">{formatDate(selectedDate)}</p>
            </div>

            <button
              onClick={goToNextDay}
              disabled={selectedDate >= new Date().toISOString().split("T")[0]}
              className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors disabled:opacity-50"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : briefing ? (
          <div className="space-y-8">
            {Object.entries(briefing.sections).map(([key, section]: [string, any]) => (
              <div key={key} className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.items?.map((item: string, idx: number) => (
                    <li key={idx} className="text-text-secondary flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
            <p className="text-text-secondary">No briefing available for {formatDate(selectedDate)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
