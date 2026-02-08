import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const SPONSORS_LOCAL_FILE = path.join(process.cwd(), 'data', 'crm', 'sponsors-adelaide-local.json')

export async function GET() {
  try {
    const data = await readFile(SPONSORS_LOCAL_FILE, 'utf-8')
    const sponsorsData = JSON.parse(data)
    return NextResponse.json(sponsorsData)
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to load local sponsors' 
    }, { status: 500 })
  }
}
