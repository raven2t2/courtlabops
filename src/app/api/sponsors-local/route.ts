import { NextResponse } from 'next/server'
import sponsorsData from '../../../../data/crm/sponsors-adelaide-local.json'

export async function GET() {
  return NextResponse.json(sponsorsData)
}
