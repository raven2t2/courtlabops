"use client"

import { useState } from "react"

export default function AffiliateDashboard() {
  const [code, setCode] = useState("")

  const affiliates: Record<string, any> = {
    "aff-coachpro-001": {
      name: "CoachPro Network",
      email: "partnerships@coachpro.com",
      referrals: 42,
      conversions: 8,
      earnings: 2400,
    },
    "aff-basketball-001": {
      name: "BasketballInsiders",
      email: "affiliates@basketballinsiders.com",
      referrals: 28,
      conversions: 5,
      earnings: 1500,
    },
  }

  const affiliate = code ? affiliates[code] : null

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8">
      <h1 className="text-4xl font-bold mb-8">Affiliate Portal</h1>

      {!affiliate ? (
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Enter affiliate code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary mb-4"
          />
          <div className="text-sm text-text-secondary">Demo codes: aff-coachpro-001, aff-basketball-001</div>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">{affiliate.name}</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <p className="text-text-secondary text-sm">Referrals Sent</p>
              <p className="text-3xl font-bold">{affiliate.referrals}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Conversions</p>
              <p className="text-3xl font-bold">{affiliate.conversions}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Earnings</p>
              <p className="text-3xl font-bold">${affiliate.earnings}</p>
            </div>
          </div>
          <button
            onClick={() => setCode("")}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
