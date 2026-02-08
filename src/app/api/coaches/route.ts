import { NextResponse } from 'next/server'
import coachesData from '../../../../data/crm/coaches/coach-prospects.json'

export async function GET() {
  return NextResponse.json(coachesData)
}
