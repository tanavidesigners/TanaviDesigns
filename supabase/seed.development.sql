-- Seed File: supabase/seed.development.sql
-- Goal: Populate authentic Tanavi by Deepika catalogue categories, collections, apparel products, variants & inventory

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, sort_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Sarees', 'sarees', 'Handwoven Chanderi, Organza and Silk Sarees crafted by traditional artisans.', 1),
  ('c2222222-2222-2222-2222-222222222222', 'Kurta Sets', 'kurta-sets', 'Comfortable hand-block printed cotton and mulmul kurta sets for everyday and festive ease.', 2),
  ('c3333333-3333-3333-3333-333333333333', 'Co-ords', 'co-ords', 'Contemporary linen and bandhani co-ord sets with soft hand-finished details.', 3),
  ('c4444444-4444-4444-4444-444444444444', 'Dresses & Kaftans', 'dresses', 'Breezy printed mulmul kaftans and embroidered silhouettes designed for effortless wear.', 4),
  ('c5555555-5555-5555-5555-555555555555', 'Dupattas', 'dupattas', 'Hand-painted organza and kota doria dupattas to elevate any silhouette.', 5)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED COLLECTIONS
INSERT INTO public.collections (id, name, slug, description, is_featured) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'New Arrivals', 'new-arrivals', 'Fresh from our studio—the latest hand-finished edits in small, considered quantities.', TRUE),
  ('a2222222-2222-2222-2222-222222222222', 'Monsoon Edit 2026', 'monsoon-edit', 'Lightweight cottons, soft hues, and painterly prints made to breathe in high humidity.', TRUE),
  ('a3333333-3333-3333-3333-333333333333', 'Festive Craft', 'festive-craft', 'Elevated Chanderi silk and intricate embroidery for celebratory occasions.', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PRODUCTS
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
    245000, -- ₹2,450
    285000, -- ₹2,850
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
    485000, -- ₹4,850
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
    265000, -- ₹2,650
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
    195000, -- ₹1,950
    225000,
    'Mulmul Cotton',
    'Hand-Block Print',
    'Resort & Vacation',
    'Gentle hand wash in cold water.',
    'Dispatches in 2-4 days.',
    'active',
    FALSE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PRODUCT VARIANTS
INSERT INTO public.product_variants (id, product_id, sku, size, colour_name, colour_hex, price_override, active) VALUES
  -- Noor variants
  ('d1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'TNV-NOOR-S', 'S', 'Rose Pink', '#E8A5A5', NULL, TRUE),
  ('d1111111-1111-1111-1111-222222222222', 'b1111111-1111-1111-1111-111111111111', 'TNV-NOOR-M', 'M', 'Rose Pink', '#E8A5A5', NULL, TRUE),
  ('d1111111-1111-1111-1111-333333333333', 'b1111111-1111-1111-1111-111111111111', 'TNV-NOOR-L', 'L', 'Rose Pink', '#E8A5A5', NULL, TRUE),
  -- Sitara variants (Free Size Saree)
  ('d2222222-2222-2222-2222-111111111111', 'b2222222-2222-2222-2222-222222222222', 'TNV-SITARA-FS', 'Free Size', 'Coral Zari', '#E56B55', NULL, TRUE),
  -- Zoya variants
  ('d3333333-3333-3333-3333-111111111111', 'b3333333-3333-3333-3333-333333333333', 'TNV-ZOYA-M', 'M', 'Marigold', '#F2994A', NULL, TRUE),
  ('d3333333-3333-3333-3333-222222222222', 'b3333333-3333-3333-3333-333333333333', 'TNV-ZOYA-L', 'L', 'Marigold', '#F2994A', NULL, TRUE),
  -- Anaya variants
  ('d4444444-4444-4444-4444-111111111111', 'b4444444-4444-4444-4444-444444444444', 'TNV-ANAYA-FS', 'Free Size', 'Sage Green', '#829E84', NULL, TRUE)
ON CONFLICT (sku) DO NOTHING;

-- 5. SEED INVENTORY
INSERT INTO public.inventory (variant_id, quantity_on_hand, quantity_reserved, low_stock_threshold) VALUES
  ('d1111111-1111-1111-1111-111111111111', 5, 0, 2),
  ('d1111111-1111-1111-1111-222222222222', 8, 0, 2),
  ('d1111111-1111-1111-1111-333333333333', 4, 0, 2),
  ('d2222222-2222-2222-2222-111111111111', 2, 0, 1),
  ('d3333333-3333-3333-3333-111111111111', 6, 0, 2),
  ('d3333333-3333-3333-3333-222222222222', 3, 0, 2),
  ('d4444444-4444-4444-4444-111111111111', 7, 0, 2)
ON CONFLICT (variant_id) DO NOTHING;

-- 6. SEED PRODUCT IMAGES
INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=85', 'Noor Rose Pink Kurta Set Front View', 1, TRUE),
  ('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', 'Sitara Coral Chanderi Silk Saree Drape', 1, TRUE),
  ('b3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=85', 'Zoya Marigold Bandhani Co-Ord Set', 1, TRUE),
  ('b4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1583391733975-d8a04f1c2367?auto=format&fit=crop&w=1200&q=85', 'Anaya Sage Mulmul Kaftan Dress', 1, TRUE);

-- 7. SEED ANNOUNCEMENTS
INSERT INTO public.announcements (message, link_url, active) VALUES
  ('Complimentary shipping across India on orders above ₹2,999 · Small-batch Indian craftsmanship', '/collections/new-arrivals', TRUE);

-- 8. SEED SHIPPING METHODS
INSERT INTO public.shipping_methods (name, rate_paise, free_above_paise, active, min_days, max_days) VALUES
  ('Standard Delivery across India', 14900, 299900, TRUE, 3, 7);
