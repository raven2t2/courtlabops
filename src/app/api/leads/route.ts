import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const SA_LEADS_FILE = path.join(process.cwd(), 'data', 'crm', 'leads', 'sa-basketball-clubs.json')

export async function GET() {
  try {
    const data = await readFile(SA_LEADS_FILE, 'utf-8')
    const leadsData = JSON.parse(data)
    return NextResponse.json(leadsData)
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to load leads' 
    }, { status: 500 })
  }
}
