import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
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

    // Target upload path on Hostinger VPS disk (/public/uploads)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      await fs.promises.mkdir(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save image to Hostinger VPS Disk Storage ($0 cost, 60GB+ space)
    await fs.promises.writeFile(filePath, buffer);

    // Return the relative public image URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      storage: 'Hostinger VPS Local Storage'
    });
  } catch (error: any) {
    console.error('Hostinger local upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Hostinger image upload failed' },
      { status: 500 }
    );
  }
}
