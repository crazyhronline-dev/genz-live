import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension
    const ext = path.extname(file.name) || '.jpg';
    const cleanExt = (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext.toLowerCase())) ? ext.toLowerCase() : '.jpg';
    const filename = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${cleanExt}`;

    // Write to both public/uploads and root uploads directory to guarantee persistence
    const dir1 = path.join(process.cwd(), 'public', 'uploads');
    const dir2 = path.join(process.cwd(), 'uploads');

    try { await fs.mkdir(dir1, { recursive: true }); } catch {}
    try { await fs.mkdir(dir2, { recursive: true }); } catch {}

    await fs.writeFile(path.join(dir1, filename), buffer);
    await fs.writeFile(path.join(dir2, filename), buffer);

    // Return the dynamic API endpoint URL so Next.js server ALWAYS serves it with proper image headers
    const publicUrl = `/api/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl, filename });
  } catch (err) {
    console.error('UPLOAD_ERROR:', err);
    return NextResponse.json({ error: 'Failed to upload image file.' }, { status: 500 });
  }
}
