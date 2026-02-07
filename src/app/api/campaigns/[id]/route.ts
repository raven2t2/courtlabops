import { NextRequest, NextResponse } from "next/server"
import { getCampaignsData, saveCampaignPatch } from "@/lib/campaigns-store"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const data = await getCampaignsData()
    const campaign = data.campaigns.find((item) => item.id === id)

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      source: data.source,
      connected: data.connected,
      campaign,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load campaign",
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const patch = (await request.json()) as Record<string, unknown>

    const allowedKeys = new Set([
      "name",
      "status",
      "subject",
      "tailoredOutreach",
      "notes",
      "leadsCount",
      "sentCount",
      "repliedCount",
      "meetingsCount",
      "progress",
      "responseRate",
      "updatedAt",
      "outreachItems",
    ])

    const safePatch = Object.fromEntries(Object.entries(patch).filter(([key]) => allowedKeys.has(key)))
    const result = await saveCampaignPatch(id, safePatch)

    if (!result.campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      source: result.source,
      connected: result.connected,
      campaign: result.campaign,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update campaign",
      },
      { status: 500 }
    )
  }
}
