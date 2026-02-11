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

    const briefsDir = join(process.cwd(), '..', 'courtlab-briefings');
    const filePath = join(briefsDir, file);

    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    return Response.json({
      ...data,
      content: data.content // Plaintext content
    });
  } catch (error) {
    console.error('Error reading briefing:', error);
    return Response.json(
      { error: 'Failed to read briefing' },
      { status: 500 }
    );
  }
}
