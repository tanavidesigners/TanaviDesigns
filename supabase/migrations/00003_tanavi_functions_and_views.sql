-- Migration: 00003_tanavi_functions_and_views.sql
-- Goal: PostgreSQL RPC functions for atomic inventory reservations & SQL analytics views for Studio Admin

-- 1. ATOMIC INVENTORY RESERVATION RPC
CREATE OR REPLACE FUNCTION public.reserve_inventory_for_order(
  p_variant_ids UUID[],
  p_quantities INT[]
)
RETURNS TABLE (
  success BOOLEAN,
  error_message TEXT,
  variant_id UUID
) AS $$
DECLARE
  i INT;
  v_id UUID;
  v_qty INT;
  v_hand INT;
  v_res INT;
BEGIN
  IF array_length(p_variant_ids, 1) IS NULL OR array_length(p_variant_ids, 1) != array_length(p_quantities, 1) THEN
    RETURN QUERY SELECT FALSE, 'Variant IDs and quantities array length mismatch'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  -- Lock target inventory rows for update
  PERFORM 1 FROM public.inventory
  WHERE variant_id = ANY(p_variant_ids)
  FOR UPDATE;

  -- Validate stock availability
  FOR i IN 1..array_length(p_variant_ids, 1) LOOP
    v_id := p_variant_ids[i];
    v_qty := p_quantities[i];

    SELECT quantity_on_hand, quantity_reserved INTO v_hand, v_res
    FROM public.inventory
    WHERE variant_id = v_id;

    IF v_hand IS NULL THEN
      RETURN QUERY SELECT FALSE, ('Variant not found: ' || v_id::TEXT)::TEXT, v_id;
      RETURN;
    END IF;

    IF (v_hand - v_res) < v_qty THEN
      RETURN QUERY SELECT FALSE, ('Insufficient stock available for variant: ' || v_id::TEXT)::TEXT, v_id;
      RETURN;
    END IF;
  END LOOP;

  -- Reserve stock
  FOR i IN 1..array_length(p_variant_ids, 1) LOOP
    v_id := p_variant_ids[i];
    v_qty := p_quantities[i];

    UPDATE public.inventory
    SET quantity_reserved = quantity_reserved + v_qty,
        updated_at = NOW()
    WHERE variant_id = v_id;

    INSERT INTO public.inventory_movements (
      variant_id,
      movement_type,
      quantity,
      notes
    ) VALUES (
      v_id,
      'reservation',
      v_qty,
      'Checkout atomic reservation lock'
    );
  END LOOP;

  RETURN QUERY SELECT TRUE, NULL::TEXT, NULL::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. CONVERT RESERVATION TO SALE RPC
CREATE OR REPLACE FUNCTION public.convert_reservation_to_sale(
  p_variant_ids UUID[],
  p_quantities INT[],
  p_order_id UUID
)
RETURNS VOID AS $$
DECLARE
  i INT;
  v_id UUID;
  v_qty INT;
BEGIN
  IF array_length(p_variant_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  FOR i IN 1..array_length(p_variant_ids, 1) LOOP
    v_id := p_variant_ids[i];
    v_qty := p_quantities[i];

    UPDATE public.inventory
    SET quantity_on_hand = GREATEST(0, quantity_on_hand - v_qty),
        quantity_reserved = GREATEST(0, quantity_reserved - v_qty),
        updated_at = NOW()
    WHERE variant_id = v_id;

    INSERT INTO public.inventory_movements (
      variant_id,
      movement_type,
      quantity,
      order_id,
      notes
    ) VALUES (
      v_id,
      'sale',
      v_qty,
      p_order_id,
      'Captured Razorpay Payment'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. RELEASE RESERVATION RPC
CREATE OR REPLACE FUNCTION public.release_inventory_reservation(
  p_variant_ids UUID[],
  p_quantities INT[]
)
RETURNS VOID AS $$
DECLARE
  i INT;
  v_id UUID;
  v_qty INT;
BEGIN
  IF array_length(p_variant_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  FOR i IN 1..array_length(p_variant_ids, 1) LOOP
    v_id := p_variant_ids[i];
    v_qty := p_quantities[i];

    UPDATE public.inventory
    SET quantity_reserved = GREATEST(0, quantity_reserved - v_qty),
        updated_at = NOW()
    WHERE variant_id = v_id;

    INSERT INTO public.inventory_movements (
      variant_id,
      movement_type,
      quantity,
      notes
    ) VALUES (
      v_id,
      'reservation_release',
      v_qty,
      'Payment cancelled/failed reservation release'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. ANALYTICS VIEWS FOR STUDIO ADMIN

-- Daily Revenue View
CREATE OR REPLACE VIEW public.admin_daily_revenue AS
SELECT
  DATE_TRUNC('day', placed_at)::DATE AS date,
  COUNT(id) AS total_orders,
  COALESCE(SUM(grand_total), 0) AS gross_revenue_paise
FROM public.orders
WHERE status IN ('paid', 'processing', 'packed', 'shipped', 'delivered')
GROUP BY DATE_TRUNC('day', placed_at)
ORDER BY date DESC;

-- Low Stock Alerts View
CREATE OR REPLACE VIEW public.admin_inventory_alerts AS
SELECT
  pv.id AS variant_id,
  pv.sku,
  p.name AS product_name,
  pv.size,
  pv.colour_name,
  inv.quantity_on_hand,
  inv.quantity_reserved,
  (inv.quantity_on_hand - inv.quantity_reserved) AS quantity_available,
  inv.low_stock_threshold,
  CASE
    WHEN (inv.quantity_on_hand - inv.quantity_reserved) <= 0 THEN 'out_of_stock'
    WHEN (inv.quantity_on_hand - inv.quantity_reserved) <= inv.low_stock_threshold THEN 'low_stock'
    ELSE 'healthy'
  END AS alert_status
FROM public.product_variants pv
JOIN public.products p ON p.id = pv.product_id
JOIN public.inventory inv ON inv.variant_id = pv.id
WHERE (inv.quantity_on_hand - inv.quantity_reserved) <= inv.low_stock_threshold;

-- Sales by Category View
CREATE OR REPLACE VIEW public.admin_sales_by_category AS
SELECT
  c.id AS category_id,
  c.name AS category_name,
  COUNT(DISTINCT oi.order_id) AS total_orders,
  COALESCE(SUM(oi.quantity), 0) AS units_sold,
  COALESCE(SUM(oi.line_total), 0) AS total_revenue_paise
FROM public.categories c
JOIN public.products p ON p.category_id = c.id
JOIN public.order_items oi ON oi.product_id = p.id
JOIN public.orders o ON o.id = oi.order_id
WHERE o.status IN ('paid', 'processing', 'packed', 'shipped', 'delivered')
GROUP BY c.id, c.name;
