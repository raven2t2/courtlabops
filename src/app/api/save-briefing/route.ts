import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, type, date } = body;

    if (!title || !content || !type) {
      return Response.json(
        { error: 'Missing required fields: title, content, type' },
        { status: 400 }
      );
    }

    // Use provided date or today
    const saveDate = date || new Date().toISOString().split('T')[0];
    
    // Create briefing directory structure
    const briefingsDir = join(process.cwd(), '..', 'courtlab-briefings');
    mkdirSync(briefingsDir, { recursive: true });

    // Save as JSON
    const filename = `${type}-${saveDate}.json`;
    const filepath = join(briefingsDir, filename);
    
    const briefingData = {
      title,
      type,
      date: saveDate,
      timestamp: new Date().toISOString(),
      content
    };

    writeFileSync(filepath, JSON.stringify(briefingData, null, 2));

    // Also save as HTML for readability
    const htmlFilename = `${type}-${saveDate}.html`;
    const htmlFilepath = join(briefingsDir, htmlFilename);
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 40px; max-width: 900px; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    .meta { color: #7f8c8d; font-size: 14px; margin-bottom: 20px; }
    .content { background: #f8f9fa; padding: 20px; border-left: 4px solid #3498db; border-radius: 4px; }
    pre { background: #ecf0f1; padding: 15px; border-radius: 4px; overflow-x: auto; }
    code { font-family: 'Monaco', 'Courier New', monospace; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Date:</strong> ${saveDate}</p>
    <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
  </div>
  <div class="content">
    <pre>${content}</pre>
  </div>
</body>
</html>`;

    writeFileSync(htmlFilepath, htmlContent);

    return Response.json({
      success: true,
      filename,
      path: filepath,
      message: `Briefing saved: ${filename}`
    });
  } catch (error) {
    console.error('Error saving briefing:', error);
    return Response.json(
      { error: 'Failed to save briefing' },
      { status: 500 }
    );
  }
}
