import { NextResponse } from 'next/server'
import affiliatesData from '../../../../data/crm/affiliates/affiliate-leads-v1.json'

export async function GET() {
  return NextResponse.json(affiliatesData)
}
