import { NextResponse } from 'next/server'
import affiliatesData from '../../../../data/crm/affiliates-complete.json'

export async function GET() {
  return NextResponse.json(affiliatesData)
}
