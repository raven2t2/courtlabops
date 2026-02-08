import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const AFFILIATES_FILE = path.join(process.cwd(), 'data', 'crm', 'affiliates-complete.json')

export async function GET() {
  try {
    const data = await readFile(AFFILIATES_FILE, 'utf-8')
    const affiliatesData = JSON.parse(data)
    return NextResponse.json(affiliatesData)
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to load affiliates' 
    }, { status: 500 })
  }
}
