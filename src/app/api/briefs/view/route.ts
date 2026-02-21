import { getBriefDocumentByFile } from '@/lib/briefs-source';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return Response.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    const doc = getBriefDocumentByFile(file);
    if (!doc) {
      return Response.json({ error: 'Briefing not found' }, { status: 404 });
    }

    return Response.json(doc);
  } catch (error) {
    console.error('Error reading briefing:', error);
    return Response.json({ error: 'Failed to read briefing' }, { status: 500 });
  }
}
