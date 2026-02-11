import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return Response.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    // Security: prevent directory traversal
    if (file.includes('..') || file.includes('/')) {
      return Response.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const cwd = process.cwd();
    const briefsDir = join(cwd, '..', 'courtlab-briefings');
    
    let fileContent = '';
    let filePath = join(briefsDir, file);
    
    try {
      fileContent = readFileSync(filePath, 'utf-8');
    } catch (e) {
      // Try root directory
      filePath = join(cwd, file);
      fileContent = readFileSync(filePath, 'utf-8');
    }
    
    const data = JSON.parse(fileContent);

    return Response.json({
      ...data,
      content: data.content
    });
  } catch (error) {
    console.error('Error reading briefing:', error);
    return Response.json(
      { error: 'Failed to read briefing' },
      { status: 500 }
    );
  }
}
