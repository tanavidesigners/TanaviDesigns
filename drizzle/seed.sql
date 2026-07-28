-- Seed Categories
INSERT OR IGNORE INTO categories (id, name, slug, description, image_url) VALUES
('cat_sarees', 'Handloom Sarees', 'handloom-sarees', 'Slowly woven silk and linen sarees with subtle zari details.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop'),
('cat_kurtas', 'Kurta Sets', 'kurta-sets', 'Minimalist Chanderi and Organza kurta sets with hand embroidery.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop'),
('cat_lehengas', 'Occasion Wear', 'occasion-wear', 'Lightweight festive lehengas for modern celebrations.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop');

-- Seed Products
INSERT OR IGNORE INTO products (id, category_id, name, slug, subtitle, description, status, fabric, occasion) VALUES
('prod_1', 'cat_sarees', 'Gulzar Tissue Silk Saree', 'gulzar-tissue-silk-saree', 'Pure Handloom Silk with Soft Rose Gold Zari', 'Handwoven tissue silk saree in dusty rose, paired with a matching unstitched blouse piece.', 'PUBLISHED', 'Tissue Silk', 'Festive / Wedding'),
('prod_2', 'cat_kurtas', 'Noor Organza Kurta Set', 'noor-organza-kurta-set', '3-Piece Set with Hand Embroidery & Dupatta', 'Powder blue organza tunic embroidered with subtle cutdana work, paired with silk trousers.', 'PUBLISHED', 'Organza & Chanderi', 'Day Festive / Sangeet'),
('prod_3', 'cat_sarees', 'Kashvi Chanderi Saree', 'kashvi-chanderi-saree', 'Sheer Handloom Chanderi in Ivory', 'Lightweight ivory Chanderi saree highlighted with delicate gold foil block printing.', 'PUBLISHED', 'Chanderi Silk', 'Pooja / Ceremony'),
('prod_4', 'cat_lehengas', 'Zaria Bandhani Lehenga', 'zaria-bandhani-lehenga', 'Traditional Bandhani with Pearl Detailing', 'Coral crimson bandhani printed silk lehenga set with hand-stitched pearl borders.', 'PUBLISHED', 'Raw Silk', 'Festive Celebration');

-- Seed Product Images
INSERT OR IGNORE INTO product_images (id, product_id, url, alt, position) VALUES
('img_1', 'prod_1', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop', 'Gulzar Tissue Silk Saree Front View', 1),
('img_2', 'prod_2', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop', 'Noor Organza Kurta Set Model View', 1),
('img_3', 'prod_3', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop', 'Kashvi Chanderi Saree Drape View', 1),
('img_4', 'prod_4', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop', 'Zaria Bandhani Lehenga View', 1);

-- Seed Variants (price_paise = price * 100)
INSERT OR IGNORE INTO product_variants (id, product_id, sku, size, colour, price_paise, compare_at_paise, active) VALUES
('var_1_free', 'prod_1', 'TNV-GUL-FREE', 'Free Size', 'Dusty Rose', 1850000, 2200000, 1),
('var_2_s', 'prod_2', 'TNV-NOR-S', 'S', 'Powder Blue', 1450000, 1650000, 1),
('var_2_m', 'prod_2', 'TNV-NOR-M', 'M', 'Powder Blue', 1450000, 1650000, 1),
('var_2_l', 'prod_2', 'TNV-NOR-L', 'L', 'Powder Blue', 1450000, 1650000, 1),
('var_3_free', 'prod_3', 'TNV-KSH-FREE', 'Free Size', 'Ivory Gold', 1280000, 1500000, 1),
('var_4_s', 'prod_4', 'TNV-ZAR-S', 'S', 'Coral Crimson', 2450000, 2800000, 1),
('var_4_m', 'prod_4', 'TNV-ZAR-M', 'M', 'Coral Crimson', 2450000, 2800000, 1);

-- Seed Inventory
INSERT OR IGNORE INTO inventory (id, variant_id, available, reserved, version) VALUES
('inv_1', 'var_1_free', 10, 0, 1),
('inv_2', 'var_2_s', 5, 0, 1),
('inv_3', 'var_2_m', 8, 0, 1),
('inv_4', 'var_2_l', 4, 0, 1),
('inv_5', 'var_3_free', 12, 0, 1),
('inv_6', 'var_4_s', 3, 0, 1),
('inv_7', 'var_4_m', 5, 0, 1);

-- Seed Shipping Methods
INSERT OR IGNORE INTO shipping_methods (id, name, rate_paise, free_above_paise, active, min_days, max_days) VALUES
('ship_std', 'Standard Pan-India Shipping', 25000, 1000000, 1, 4, 7),
('ship_exp', 'Express Studio Shipping', 50000, NULL, 1, 2, 3);
