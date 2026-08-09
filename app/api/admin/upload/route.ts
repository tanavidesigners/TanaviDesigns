import { NextResponse } from 'next/server';
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

    // Bypass unenv framework polyfill by loading un-stubbed native Node fs
    let written = false;
    try {
      const realFs = (globalThis as any).process?.mainModule?.require
        ? (globalThis as any).process.mainModule.require('node:fs')
        : (await import('node:fs')).default || (await import('node:fs'));

      if (realFs && typeof realFs.writeFileSync === 'function') {
        if (typeof realFs.existsSync === 'function' && !realFs.existsSync(uploadsDir)) {
          realFs.mkdirSync(uploadsDir, { recursive: true });
        }
        realFs.writeFileSync(filePath, buffer);
        written = true;
      }
    } catch (e: any) {
      console.warn('Native fs bypass attempt failed:', e?.message);
    }

    // Fallback: Use Supabase Storage if native fs is completely blocked by unenv
    let publicUrl = `/uploads/${fileName}`;

    if (!written) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wnbckffbhhmxxjbetzvs.supabase.co';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: uploadData } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, { contentType: file.type || 'image/jpeg', upsert: true });

      if (uploadData) {
        const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        publicUrl = publicUrlData.publicUrl;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      storage: written ? 'Hostinger VPS Local Storage' : 'Supabase Storage'
    });
  } catch (error: any) {
    console.error('Hostinger VPS Local Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Hostinger image upload failed' },
      { status: 500 }
    );
  }
}
