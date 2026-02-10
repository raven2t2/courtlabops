import { readFileSync } from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('file');

  if (!filePath) {
    return Response.json({ error: 'No file specified' }, { status: 400 });
  }

  // Security: only allow files in courtlab-crm directory
  if (!filePath.includes('courtlab-crm')) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Parse JSON if applicable
    let data = content;
    if (filePath.endsWith('.json')) {
      try {
        data = JSON.parse(content);
      } catch {
        // Return as text if JSON parsing fails
      }
    }

    return Response.json({ content: data, filename: filePath.split('/').pop() });
  } catch (error) {
    console.error('Error reading file:', error);
    return Response.json({ error: 'File not found' }, { status: 404 });
  }
}
