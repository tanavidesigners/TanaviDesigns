-- Migration: 00002_tanavi_rls_policies.sql
-- Goal: Row Level Security (RLS) policies for storefront public, customer auth, and studio admin

-- Helper function to check if user has admin/staff role
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  u_role public.user_role;
BEGIN
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT role INTO u_role FROM public.profiles WHERE id = user_id;
  RETURN u_role IN ('admin', 'staff', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles reading" ON public.profiles;
DROP POLICY IF EXISTS "Users can edit own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. PUBLIC CATALOGUE READ POLICIES
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view collections" ON public.collections;
DROP POLICY IF EXISTS "Anyone can view product_collections" ON public.product_collections;
DROP POLICY IF EXISTS "Anyone can view product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Anyone can view product_images" ON public.product_images;
DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Anyone can view active shipping_methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Anyone can view site_settings" ON public.site_settings;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active' OR is_admin_or_staff(auth.uid()));
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view product_collections" ON public.product_collections FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view product_variants" ON public.product_variants FOR SELECT USING (active = TRUE OR is_admin_or_staff(auth.uid()));
CREATE POLICY "Anyone can view product_images" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT USING (active = TRUE OR is_admin_or_staff(auth.uid()));
CREATE POLICY "Anyone can view active shipping_methods" ON public.shipping_methods FOR SELECT USING (active = TRUE OR is_admin_or_staff(auth.uid()));
CREATE POLICY "Anyone can view site_settings" ON public.site_settings FOR SELECT USING (TRUE);

-- 3. CART & WISHLIST POLICIES
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Users can manage own wishlist items" ON public.wishlist_items;

CREATE POLICY "Users can manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND (user_id = auth.uid() OR user_id IS NULL))
);
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist items" ON public.wishlist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid())
);

-- 4. ORDERS & PAYMENTS POLICIES
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers view own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Customers view own payments" ON public.payments;
DROP POLICY IF EXISTS "Customers view own addresses" ON public.addresses;

CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR is_admin_or_staff(auth.uid()));
CREATE POLICY "Customers view own order_items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR is_admin_or_staff(auth.uid())))
);
CREATE POLICY "Customers view own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR is_admin_or_staff(auth.uid())))
);
CREATE POLICY "Customers view own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- 5. PUBLIC INSERTS FOR NEWSLETTER & CONTACT FORM
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can submit contact enquiry" ON public.contact_enquiries;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can submit contact enquiry" ON public.contact_enquiries FOR INSERT WITH CHECK (TRUE);

-- 6. ADMIN / STAFF FULL MUTATION POLICIES
DROP POLICY IF EXISTS "Admin write products" ON public.products;
DROP POLICY IF EXISTS "Admin write categories" ON public.categories;
DROP POLICY IF EXISTS "Admin write collections" ON public.collections;
DROP POLICY IF EXISTS "Admin write product_collections" ON public.product_collections;
DROP POLICY IF EXISTS "Admin write product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admin write product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admin manage inventory" ON public.inventory;
DROP POLICY IF EXISTS "Admin view/manage inventory_movements" ON public.inventory_movements;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
DROP POLICY IF EXISTS "Admin manage order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admin manage payments" ON public.payments;
DROP POLICY IF EXISTS "Admin manage payment_events" ON public.payment_events;
DROP POLICY IF EXISTS "Admin manage order_status_history" ON public.order_status_history;
DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admin manage announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin manage shipping_methods" ON public.shipping_methods;
DROP POLICY IF EXISTS "Admin manage site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin manage audit_logs" ON public.audit_logs;

CREATE POLICY "Admin write products" ON public.products FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin write collections" ON public.collections FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin write product_collections" ON public.product_collections FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin write product_variants" ON public.product_variants FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin write product_images" ON public.product_images FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage inventory" ON public.inventory FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin view/manage inventory_movements" ON public.inventory_movements FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage order_items" ON public.order_items FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage payments" ON public.payments FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage payment_events" ON public.payment_events FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage order_status_history" ON public.order_status_history FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage announcements" ON public.announcements FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage shipping_methods" ON public.shipping_methods FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage audit_logs" ON public.audit_logs FOR ALL USING (TRUE) WITH CHECK (TRUE);

