import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:SupaBase@2026@db.wnbckffbhhmxxjbetzvs.supabase.co:5432/postgres';

const sql = `
-- SEED ALL PRODUCTS FOR TANAVI BY DEEPIKA

-- 1. Insert/Update Categories
INSERT INTO public.categories (id, name, slug, description, sort_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Sarees', 'sarees', 'Handwoven Chanderi, Organza and Silk Sarees crafted by traditional artisans.', 1),
  ('c2222222-2222-2222-2222-222222222222', 'Kurta Sets', 'kurta-sets', 'Comfortable hand-block printed cotton and mulmul kurta sets for everyday and festive ease.', 2),
  ('c3333333-3333-3333-3333-333333333333', 'Co-ords', 'co-ords', 'Contemporary linen and bandhani co-ord sets with soft hand-finished details.', 3),
  ('c4444444-4444-4444-4444-444444444444', 'Dresses & Kaftans', 'dresses', 'Breezy printed mulmul kaftans and embroidered silhouettes designed for effortless wear.', 4),
  ('c5555555-5555-5555-5555-555555555555', 'Dupattas', 'dupattas', 'Hand-painted organza and kota doria dupattas to elevate any silhouette.', 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

-- 2. Insert Products
INSERT INTO public.products (id, name, slug, subtitle, short_description, description, sku, category_id, base_price, compare_at_price, fabric, craft, occasion, care_instructions, dispatch_information, status, is_featured, is_new_arrival) VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'Noor Hand-Block Kurta Set',
    'noor-hand-block-kurta-set',
    'Rose Pink Cotton Kurta with Pants',
    'A soft rose pink hand-block printed cotton kurta set with delicate ladder lace trim.',
    'The Noor set is tailored in 100% breathable cotton, featuring intricate hand-block prints created by master artisans in Jaipur. Designed with a soft straight silhouette, quarter sleeves, and finished with delicate hand-stitched details. Comes with matching straight pants.',
    'TNV-NOOR-01',
    'c2222222-2222-2222-2222-222222222222',
    245000,
    285000,
    '100% Breathable Cotton',
    'Hand-Block Printing',
    'Everyday & Festive',
    'Gentle hand wash separately in cold water with mild detergent. Line dry in shade.',
    'Dispatches within 3-5 business days across India.',
    'active',
    TRUE,
    TRUE
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'Sitara Chanderi Silk Saree',
    'sitara-chanderi-saree',
    'Coral Pink Handwoven Chanderi Saree',
    'Handwoven Chanderi silk saree with silver zari border and unstitched blouse piece.',
    'Sitara captures the understated splendour of woven textiles. Crafted in lightweight Chanderi silk with subtle metallic zari woven through the drape. Soft on skin and graceful in drape, perfect for festive celebrations.',
    'TNV-SITARA-02',
    'c1111111-1111-1111-1111-111111111111',
    485000,
    540000,
    'Chanderi Silk Blend',
    'Handloom Weaving',
    'Festive & Weddings',
    'Dry clean only. Store wrapped in clean white cotton cloth.',
    'Dispatches within 2-4 business days.',
    'active',
    TRUE,
    TRUE
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'Zoya Bandhani Co-Ord Set',
    'zoya-bandhani-coord',
    'Marigold Yellow Bandhani Top & Trousers',
    'Vibrant marigold yellow bandhani tie-dye co-ord set in pure cotton.',
    'Crafted with authentic hand-tied Bandhani resist dyeing, the Zoya co-ord set pairs a modern relaxed shirt top with tailored wide-leg trousers for a balance of traditional craft and contemporary ease.',
    'TNV-ZOYA-03',
    'c3333333-3333-3333-3333-333333333333',
    265000,
    310000,
    'Pure Cotton',
    'Bandhani Tie-Dye',
    'Festive & Casual',
    'Hand wash separately in cold water. Do not soak.',
    'Dispatches in 3-5 days.',
    'active',
    TRUE,
    FALSE
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'Anaya Printed Mulmul Kaftan',
    'anaya-mulmul-kaftan',
    'Sage Green Botanical Printed Kaftan Dress',
    'Feather-light mulmul kaftan dress with drawstring waist and hand-tasselled tie.',
    'The Anaya kaftan dress is cut from ultra-soft mulmul cotton featuring exclusive botanical block prints. Designed with an adjustable waist drawstring for customizable shape and ultimate summer comfort.',
    'TNV-ANAYA-04',
    'c4444444-4444-4444-4444-444444444444',
    195000,
    225000,
    'Mulmul Cotton',
    'Hand-Block Print',
    'Resort & Vacation',
    'Gentle hand wash in cold water.',
    'Dispatches in 2-4 days.',
    'active',
    TRUE,
    TRUE
  ),
  (
    'b5555555-5555-5555-5555-555555555555',
    'Ambar Linen Co-Ord Set',
    'ambar-linen-coord',
    'Ivory Tailored Linen Top & Wide Trousers',
    'Crisp ivory linen co-ord set with refined stitch detailing and relaxed silhouette.',
    'The Ambar co-ord set is tailored in 100% pure breathable linen. Features a structured top with delicate hand-finished horn buttons paired with relaxed, high-waisted wide trousers. Effortlessly versatile for elevated everyday dressing.',
    'TNV-AMBAR-05',
    'c3333333-3333-3333-3333-333333333333',
    215000,
    250000,
    '100% Pure Linen',
    'Tailored Hand-Stitch',
    'Everyday & Travel',
    'Hand wash in cold water or dry clean. Iron while slightly damp.',
    'Dispatches in 3-5 business days.',
    'active',
    TRUE,
    TRUE
  ),
  (
    'b6666666-6666-6666-6666-666666666666',
    'Kesar Kota Doria Kurta',
    'kesar-kota-kurta',
    'Blush Pink Kota Doria Kurta with Pants',
    'Light blush pink sheer Kota Doria kurta paired with soft cotton lining and pants.',
    'Hand-crafted in airy Kota Doria fabric with subtle weave patterns, the Kesar set captures summer lightness in a delicate blush pink hue. Comes with soft cotton lining and matching straight trousers.',
    'TNV-KESAR-06',
    'c2222222-2222-2222-2222-222222222222',
    185000,
    210000,
    'Kota Doria Cotton',
    'Kota Weaving',
    'Everyday Ease',
    'Gentle hand wash in cold water. Line dry in shade.',
    'Dispatches in 2-4 business days.',
    'active',
    TRUE,
    TRUE
  ),
  (
    'b7777777-7777-7777-7777-777777777777',
    'Mahi Hand-Painted Organza Dupatta',
    'mahi-organza-dupatta',
    'Rose Hand-Painted Floral Organza Dupatta',
    'Sheer organza dupatta featuring hand-painted botanical roses and finished with scalloped border.',
    'Delicate, weightless hand-painted organza dupatta with painterly rose motifs across the body and scalloped zari edges. Designed to elevate any solid kurta or saree ensemble.',
    'TNV-MAHI-07',
    'c5555555-5555-5555-5555-555555555555',
    115000,
    140000,
    'Pure Organza Silk',
    'Hand Painting',
    'Festive & Celebrations',
    'Dry clean only.',
    'Dispatches in 2-4 business days.',
    'active',
    TRUE,
    FALSE
  ),
  (
    'b8888888-8888-8888-8888-888888888888',
    'Gulnaar Embroidered Mul Anarkali',
    'gulnaar-anarkali',
    'Deep Wine Embroidered Mulmul Anarkali Dress',
    'Rich wine red mulmul flared Anarkali dress with delicate neck embroidery.',
    'Cut in a generous flared silhouette from soft mulmul cotton, Gulnaar is embellished with tonal hand embroidery along the neckline and cuffs. A festive statement piece designed for maximum grace and ease.',
    'TNV-GULNAAR-08',
    'c4444444-4444-4444-4444-444444444444',
    320000,
    370000,
    'Mulmul Cotton',
    'Tonal Hand Embroidery',
    'Occasion & Festive',
    'Dry clean or gentle hand wash.',
    'Dispatches in 3-5 business days.',
    'active',
    TRUE,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  compare_at_price = EXCLUDED.compare_at_price,
  fabric = EXCLUDED.fabric,
  craft = EXCLUDED.craft,
  occasion = EXCLUDED.occasion,
  care_instructions = EXCLUDED.care_instructions,
  dispatch_information = EXCLUDED.dispatch_information,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  is_new_arrival = EXCLUDED.is_new_arrival;

-- 3. Insert Product Variants
INSERT INTO public.product_variants (id, product_id, sku, size, colour_name, colour_hex, price_override, active) VALUES
  -- Noor variants
  ('d1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'TNV-NOOR-S', 'S', 'Rose Pink', '#E8A5A5', NULL, TRUE),
  ('d1111111-1111-1111-1111-222222222222', 'b1111111-1111-1111-1111-111111111111', 'TNV-NOOR-M', 'M', 'Rose Pink', '#E8A5A5', NULL, TRUE),
  ('d1111111-1111-1111-1111-333333333333', 'b1111111-1111-1111-1111-111111111111', 'TNV-NOOR-L', 'L', 'Rose Pink', '#E8A5A5', NULL, TRUE),
  -- Sitara variants
  ('d2222222-2222-2222-2222-111111111111', 'b2222222-2222-2222-2222-222222222222', 'TNV-SITARA-FS', 'Free Size', 'Coral Zari', '#E56B55', NULL, TRUE),
  -- Zoya variants
  ('d3333333-3333-3333-3333-111111111111', 'b3333333-3333-3333-3333-333333333333', 'TNV-ZOYA-M', 'M', 'Marigold', '#F2994A', NULL, TRUE),
  ('d3333333-3333-3333-3333-222222222222', 'b3333333-3333-3333-3333-333333333333', 'TNV-ZOYA-L', 'L', 'Marigold', '#F2994A', NULL, TRUE),
  -- Anaya variants
  ('d4444444-4444-4444-4444-111111111111', 'b4444444-4444-4444-4444-444444444444', 'TNV-ANAYA-FS', 'Free Size', 'Sage Green', '#829E84', NULL, TRUE),
  -- Ambar variants
  ('d5555555-5555-5555-5555-111111111111', 'b5555555-5555-5555-5555-555555555555', 'TNV-AMBAR-S', 'S', 'Ivory', '#F5F5F0', NULL, TRUE),
  ('d5555555-5555-5555-5555-222222222222', 'b5555555-5555-5555-5555-555555555555', 'TNV-AMBAR-M', 'M', 'Ivory', '#F5F5F0', NULL, TRUE),
  ('d5555555-5555-5555-5555-333333333333', 'b5555555-5555-5555-5555-555555555555', 'TNV-AMBAR-L', 'L', 'Ivory', '#F5F5F0', NULL, TRUE),
  -- Kesar variants
  ('d6666666-6666-6666-6666-111111111111', 'b6666666-6666-6666-6666-666666666666', 'TNV-KESAR-M', 'M', 'Blush Pink', '#FFB6C1', NULL, TRUE),
  ('d6666666-6666-6666-6666-222222222222', 'b6666666-6666-6666-6666-666666666666', 'TNV-KESAR-L', 'L', 'Blush Pink', '#FFB6C1', NULL, TRUE),
  -- Mahi variants
  ('d7777777-7777-7777-7777-111111111111', 'b7777777-7777-7777-7777-777777777777', 'TNV-MAHI-FS', 'Free Size', 'Rose', '#E8A5A5', NULL, TRUE),
  -- Gulnaar variants
  ('d8888888-8888-8888-8888-111111111111', 'b8888888-8888-8888-8888-888888888888', 'TNV-GULNAAR-M', 'M', 'Wine', '#722F37', NULL, TRUE),
  ('d8888888-8888-8888-8888-222222222222', 'b8888888-8888-8888-8888-888888888888', 'TNV-GULNAAR-L', 'L', 'Wine', '#722F37', NULL, TRUE)
ON CONFLICT (sku) DO NOTHING;

-- 4. Insert Inventory
INSERT INTO public.inventory (variant_id, quantity_on_hand, quantity_reserved, low_stock_threshold) VALUES
  ('d1111111-1111-1111-1111-111111111111', 5, 0, 2),
  ('d1111111-1111-1111-1111-222222222222', 8, 0, 2),
  ('d1111111-1111-1111-1111-333333333333', 4, 0, 2),
  ('d2222222-2222-2222-2222-111111111111', 2, 0, 1),
  ('d3333333-3333-3333-3333-111111111111', 6, 0, 2),
  ('d3333333-3333-3333-3333-222222222222', 3, 0, 2),
  ('d4444444-4444-4444-4444-111111111111', 7, 0, 2),
  ('d5555555-5555-5555-5555-111111111111', 8, 0, 2),
  ('d5555555-5555-5555-5555-222222222222', 10, 0, 2),
  ('d5555555-5555-5555-5555-333333333333', 6, 0, 2),
  ('d6666666-6666-6666-6666-111111111111', 4, 0, 2),
  ('d6666666-6666-6666-6666-222222222222', 5, 0, 2),
  ('d7777777-7777-7777-7777-111111111111', 4, 0, 2),
  ('d8888888-8888-8888-8888-111111111111', 3, 0, 1),
  ('d8888888-8888-8888-8888-222222222222', 2, 0, 1)
ON CONFLICT (variant_id) DO NOTHING;

-- 5. Insert Product Images
INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85', 'Noor Rose Pink Kurta Set Front View', 1, TRUE),
  ('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'Sitara Coral Chanderi Silk Saree Drape', 1, TRUE),
  ('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=85', 'Zoya Marigold Bandhani Co-Ord Set', 1, TRUE),
  ('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1583391733975-d8a04f1c2367?auto=format&fit=crop&w=1200&q=85', 'Anaya Sage Mulmul Kaftan Dress', 1, TRUE),
  ('b5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=1200&q=85', 'Ambar Ivory Linen Co-Ord Set', 1, TRUE),
  ('b6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=85', 'Kesar Blush Kota Doria Kurta', 1, TRUE),
  ('b7777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1611042553365-9b101441c135?auto=format&fit=crop&w=1200&q=85', 'Mahi Hand-Painted Organza Dupatta', 1, TRUE),
  ('b8888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=85', 'Gulnaar Deep Wine Embroidered Mul Anarkali', 1, TRUE);
`;

async function seed() {
  console.log('Connecting to Supabase database...');
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected! Executing seeding SQL...');
    await client.query(sql);
    console.log('Successfully seeded all 8 products into Supabase DB!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seed();
