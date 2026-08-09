import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      categoryId,
      basePriceINR,
      fabric,
      craft,
      occasion,
      description,
      imageUrl,
      status,
      stockS = '0',
      stockM = '0',
      stockL = '0',
      stockXS = '0',
      stockXL = '0',
      stockXXL = '0'
    } = body;

    if (!name || !slug || !sku || !basePriceINR || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const basePricePaise = Math.round(parseFloat(basePriceINR) * 100);
    const supabase = createAdminClient();

    // 1. Create Main Product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        sku,
        category_id: categoryId || null,
        base_price: basePricePaise,
        fabric,
        craft,
        occasion,
        description,
        status: status || 'active',
        is_featured: true,
        is_new_arrival: true
      })
      .select()
      .single();

    if (prodErr || !product) {
      return NextResponse.json({ error: prodErr?.message || 'Failed to insert product' }, { status: 500 });
    }

    // 2. Create Primary Image
    if (imageUrl) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        storage_path: imageUrl,
        alt_text: `${name} Front View`,
        is_primary: true
      });
    }

    // 3. Create Variants & Inventory for each Size based on user input
    const sizeConfig: Record<string, number> = {
      S: parseInt(stockS) || 0,
      M: parseInt(stockM) || 0,
      L: parseInt(stockL) || 0,
      XS: parseInt(stockXS) || 0,
      XL: parseInt(stockXL) || 0,
      XXL: parseInt(stockXXL) || 0
    };

    for (const [size, qty] of Object.entries(sizeConfig)) {
      if (['S', 'M', 'L'].includes(size) || qty > 0) {
        const varSku = `${sku}-${size}`;
        const { data: variant } = await supabase
          .from('product_variants')
          .insert({
            product_id: product.id,
            sku: varSku,
            size,
            colour_name: 'Original',
            active: true
          })
          .select()
          .single();

        if (variant) {
          await supabase.from('inventory').insert({
            variant_id: variant.id,
            quantity_on_hand: qty,
            quantity_reserved: 0,
            low_stock_threshold: 2
          });
        }
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error creating product' }, { status: 500 });
  }
}
