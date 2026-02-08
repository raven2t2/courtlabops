import { NextResponse } from 'next/server'
import sponsorsData from '../../../../data/crm/sponsors.json'

export async function GET() {
  return NextResponse.json(sponsorsData)
}
