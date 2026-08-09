import { NextResponse } from 'next/server';
import { createRequire } from 'node:module';
import path from 'node:path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];
    const fileName = pathSegments.join('/');

    if (!fileName) {
      return new NextResponse('Image path missing', { status: 400 });
    }

    const baseDir = process.cwd() === '/' ? '/app' : process.cwd();

    // Check possible local VPS upload disk paths
    const candidates = [
      path.join(baseDir, 'public', 'uploads', fileName),
      path.join(baseDir, 'dist', 'client', 'uploads', fileName),
      path.join('/public', 'uploads', fileName),
      path.join('/app', 'public', 'uploads', fileName)
    ];

    let buffer: Buffer | null = null;

    try {
      const nativeRequire = createRequire(import.meta.url);
      const fs = nativeRequire('fs');

      for (const filePath of candidates) {
        if (fs.existsSync(filePath)) {
          buffer = fs.readFileSync(filePath);
          break;
        }
      }
    } catch (e) {
      console.error('[Upload Serve Error]', e);
    }

    if (!buffer) {
      return new NextResponse('Upload file not found on VPS disk', { status: 404 });
    }

    // Determine content type
    const lowerName = fileName.toLowerCase();
    let contentType = 'image/jpeg';
    if (lowerName.endsWith('.png')) contentType = 'image/png';
    else if (lowerName.endsWith('.webp')) contentType = 'image/webp';
    else if (lowerName.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (lowerName.endsWith('.gif')) contentType = 'image/gif';

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    return new NextResponse(`Error serving upload: ${error?.message}`, { status: 500 });
  }
}
