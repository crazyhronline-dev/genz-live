import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const cleanFilename = path.basename(filename);

    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', cleanFilename),
      path.join(process.cwd(), 'uploads', cleanFilename),
    ];

    for (const filePath of candidatePaths) {
      try {
        const fileBuffer = await fs.readFile(filePath);
        const ext = path.extname(cleanFilename).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.webp') contentType = 'image/webp';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.svg') contentType = 'image/svg+xml';

        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch {
        // Continue to next path
      }
    }
  } catch (err) {
    console.error('SERVE_UPLOAD_ERROR:', err);
  }

  return new NextResponse('Image file not found', { status: 404 });
}
