import { NextResponse } from 'next/server'
import templatesData from '../../../../data/crm/affiliate-templates-commission.json'

export async function GET() {
  return NextResponse.json(templatesData)
}
