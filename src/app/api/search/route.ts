import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const collection = searchParams.get('collection') || 'all';

  if (!query || query.length < 2) {
    return Response.json({ error: 'Query too short (min 2 chars)' }, { status: 400 });
  }

  try {
    const { stdout } = await execAsync(
      `/data/.openclaw/workspace/search-workspace.sh "${query}" ${collection}`,
      { timeout: 10000, maxBuffer: 1024 * 1024 }
    );

    // Parse the output into structured results
    const results = stdout
      .split('\n')
      .filter(line => line.includes('📄'))
      .map(line => {
        const match = line.match(/📄 (.+?)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    return Response.json({
      query,
      collection,
      results: Array.from(new Set(results)), // Dedupe
      count: results.length,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return Response.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}
