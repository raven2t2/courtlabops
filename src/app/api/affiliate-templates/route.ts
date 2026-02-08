import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const TEMPLATES_FILE = path.join(process.cwd(), 'data', 'crm', 'affiliate-templates-commission.json')

export async function GET() {
  try {
    const data = await readFile(TEMPLATES_FILE, 'utf-8')
    const templatesData = JSON.parse(data)
    return NextResponse.json(templatesData)
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to load templates' 
    }, { status: 500 })
  }
}
