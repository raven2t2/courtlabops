"use client"

import { useEffect, useState } from "react"

export default function BriefingsPage() {
  const [briefing, setBriefing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/briefings/${selectedDate}`)
        if (response.ok) {
          const data = await response.json()
          setBriefing(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBriefing()
  }, [selectedDate])

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="text-4xl font-bold mb-8">Daily Briefing</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : briefing ? (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
          <p className="text-text-secondary">Briefing for {briefing.date}</p>
          <pre className="mt-4 text-sm overflow-auto">{JSON.stringify(briefing, null, 2)}</pre>
        </div>
      ) : (
        <div className="text-center text-text-secondary">No briefing found for this date</div>
      )}
    </div>
  )
}
