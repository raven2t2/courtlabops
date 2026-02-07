import { NextResponse } from "next/server"
import { getCampaignsData } from "@/lib/campaigns-store"

export async function GET() {
  try {
    const data = await getCampaignsData()

    return NextResponse.json({
      source: data.source,
      connected: data.connected,
      total: data.campaigns.length,
      campaigns: data.campaigns,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load campaigns",
      },
      { status: 500 }
    )
  }
}
