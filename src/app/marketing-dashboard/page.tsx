"use client"

import { useState } from "react"

export default function MarketingDashboard() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="text-4xl font-bold mb-8">Marketing Command Center</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <p className="text-text-secondary text-sm">Leads In Progress</p>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <p className="text-text-secondary text-sm">Leads Sent</p>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <p className="text-text-secondary text-sm">Content Ready</p>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <p className="text-text-secondary text-sm">Active Campaigns</p>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <p className="text-text-secondary text-sm">Response Rate</p>
          <p className="text-3xl font-bold">32%</p>
        </div>
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
          <p className="text-text-secondary text-sm">Conversion Rate</p>
          <p className="text-3xl font-bold">18%</p>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Recent Qualified Leads</h2>
        <p className="text-text-secondary">Lead generation running. Check Kanban board for full list.</p>
      </div>
    </div>
  )
}
