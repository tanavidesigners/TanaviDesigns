# Supabase Row Level Security (RLS) Guide

Row Level Security is enabled on **all 27 tables** in the Tanavi database.

## Public Storefront Policies (Anonymous & Authenticated Users)
- **`products`**: Can read active products (`status = 'active'`).
- **`categories` & `collections`**: Can read all active categories and collections.
- **`product_variants` & `product_images`**: Public read access for active variants.
- **`announcements` & `shipping_methods`**: Public read access.
- **`newsletter_subscribers` & `contact_enquiries`**: Public insert access.

## Customer Policies (Authenticated Users)
- **`orders` & `order_items`**: Customers can read only orders matching `auth.uid() = user_id`.
- **`payments`**: Customers can read payment summary belonging to their own orders.
- **`carts` & `wishlists`**: Customers can create and manage their own cart and wishlist records.

## Administrative Policies (`admin` / `staff` User Role)
- Managed via `public.is_admin_or_staff(auth.uid())` SECURITY DEFINER helper function.
- Full SELECT, INSERT, UPDATE, and DELETE access across products, inventory, orders, payments, coupons, site settings, and audit logs.
