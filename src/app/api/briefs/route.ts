import { listBriefMetadata } from '@/lib/briefs-source';

export async function GET() {
  try {
    const briefs = listBriefMetadata();
    return Response.json({ briefs, total: briefs.length });
  } catch (error) {
    console.error('Error fetching briefs:', error);
    return Response.json({ error: 'Failed to fetch briefs', briefs: [], total: 0 }, { status: 500 });
  }
}
