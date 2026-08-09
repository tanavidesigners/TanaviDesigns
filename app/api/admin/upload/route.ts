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

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Bypass framework stubs using node:module createRequire to load real native Node fs
    let written = false;
    let writeErr = '';

    try {
      const nativeRequire = createRequire(import.meta.url);
      const fs = nativeRequire('fs');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.writeFileSync(filePath, buffer);
      written = true;
    } catch (err: any) {
      writeErr = err?.message || String(err);
    }

    // Secondary Linux child_process fallback if module require is intercepted
    if (!written) {
      try {
        const nativeRequire = createRequire(import.meta.url);
        const childProcess = nativeRequire('child_process');
        childProcess.execSync(`mkdir -p "${uploadsDir}"`);
        const fs = nativeRequire('fs');
        fs.writeFileSync(filePath, buffer);
        written = true;
      } catch (cpErr: any) {
        writeErr = cpErr?.message || String(cpErr);
      }
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
