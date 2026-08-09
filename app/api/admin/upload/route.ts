import { NextResponse } from 'next/server';
import { createRequire } from 'node:module';
import path from 'node:path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Selected file must be an image (JPEG, PNG, WebP)' }, { status: 400 });
    }

    // Generate clean unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const sanitizeName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const fileName = `${Date.now()}-${sanitizeName}.${fileExt}`;

    // Ensure path resolves to /app/public/uploads inside Docker container
    const baseDir = process.cwd() === '/' ? '/app' : process.cwd();
    const uploadsDir = path.join(baseDir, 'public', 'uploads');
    const distUploadsDir = path.join(baseDir, 'dist', 'client', 'uploads');

    const filePath = path.join(uploadsDir, fileName);
    const distFilePath = path.join(distUploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let written = false;
    let writeErr = '';

    try {
      const nativeRequire = createRequire(import.meta.url);
      const fs = nativeRequire('fs');

      // 1. Write to /app/public/uploads (Docker volume location)
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(filePath, buffer);

      // 2. Write to /app/dist/client/uploads (Vinext static client bundle location)
      try {
        if (!fs.existsSync(distUploadsDir)) {
          fs.mkdirSync(distUploadsDir, { recursive: true });
        }
        fs.writeFileSync(distFilePath, buffer);
      } catch (distErr: any) {
        console.log('[dist write notice]', distErr?.message);
      }

      written = true;
    } catch (err: any) {
      writeErr = err?.message || String(err);
    }

    if (!written) {
      return NextResponse.json(
        { error: `Hostinger VPS disk write failed: ${writeErr}` },
        { status: 500 }
      );
    }

    const publicUrl = `/uploads/${fileName}`;

    console.log(`[HOSTINGER VPS STORAGE] Successfully saved image to VPS disk: ${filePath}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      storage: 'Hostinger VPS Local Storage'
    });
  } catch (error: any) {
    console.error('Hostinger VPS Local Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Hostinger image upload failed' },
      { status: 500 }
    );
  }
}
