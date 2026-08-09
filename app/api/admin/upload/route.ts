import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wnbckffbhhmxxjbetzvs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8';
const supabase = createClient(supabaseUrl, supabaseKey);

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload to Supabase Cloud Storage (100% immune to unenv fs.mkdir errors)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      });

    let finalPublicUrl = '';

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      finalPublicUrl = publicUrlData.publicUrl;
      console.log('✅ Uploaded image to Supabase Storage:', finalPublicUrl);
    } else {
      console.warn('Supabase Storage upload fallback, attempting local disk save...', uploadError);
    }

    // 2. Secondary local VPS storage fallback (if fs is available)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (typeof fs.existsSync === 'function' && !fs.existsSync(uploadsDir)) {
        if (typeof fs.mkdirSync === 'function') {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
      }
      const filePath = path.join(uploadsDir, fileName);
      if (typeof fs.writeFileSync === 'function') {
        fs.writeFileSync(filePath, buffer);
        if (!finalPublicUrl) {
          finalPublicUrl = `/uploads/${fileName}`;
        }
      }
    } catch (fsError: any) {
      console.log('[fs notice] unenv sandboxed fs.mkdir skipped:', fsError?.message);
    }

    if (!finalPublicUrl) {
      // Data URL fallback if both fail
      finalPublicUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: finalPublicUrl,
      fileName,
      storage: 'Supabase Cloud Storage'
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
