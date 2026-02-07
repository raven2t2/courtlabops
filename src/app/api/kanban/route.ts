import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'kanban.json');

export async function GET(request: NextRequest) {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const kanban = JSON.parse(data);
    return NextResponse.json(kanban);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
