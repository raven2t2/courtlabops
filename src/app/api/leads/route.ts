import { NextResponse } from 'next/server'
import leadsData from '../../../../data/crm/leads/sa-basketball-clubs.json'

export async function GET() {
  return NextResponse.json(leadsData)
}
