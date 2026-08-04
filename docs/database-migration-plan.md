# Database Migration & Schema Design Plan: D1/Drizzle → Supabase PostgreSQL

## 1. Migration Strategy

We are migrating from SQLite (Cloudflare D1) to **Supabase PostgreSQL**.

Key changes:
- All schema migrations stored under `supabase/migrations/*.sql`.
- Direct Supabase client libraries (`@supabase/supabase-js`, `@supabase/ssr`).
- Row Level Security (RLS) policies on every table.
- PostgreSQL enums, foreign keys, timestamps, indexes, and custom functions.
- Integer amounts stored in **paise** (1 INR = 100 paise).

---

## 2. PostgreSQL Relational Schema Architecture

```
auth.users (Supabase Managed)
    │
    ├──> profiles (id REFERENCES auth.users)
    ├──> addresses (user_id REFERENCES auth.users)
    ├──> carts (user_id REFERENCES auth.users)
    ├──> wishlists (user_id REFERENCES auth.users)
    └──> orders (user_id REFERENCES auth.users)

categories ──> products ──> product_variants ──> inventory
                 │               │                    │
                 ├──> images     ├──> cart_items      └──> inventory_movements
                 └──> reviews    └──> order_items
```

### Table Definitions Summary
1. `profiles`: User roles (`customer`, `staff`, `admin`, `super_admin`), full name, phone.
2. `categories` & `collections` & `product_collections`: Catalogue categorization & merchandising hierarchy.
3. `products`: Core product metadata, base price, SEO fields, status (`draft`, `active`, `archived`), fabric, occasion, care instructions.
4. `product_variants`: Size, colour, SKU, price override, active status.
5. `product_images`: Storage path, alt text, sort order, primary flag.
6. `inventory`: Variant stock (`quantity_on_hand`, `quantity_reserved`, `low_stock_threshold`). Constraints: `quantity_on_hand >= 0`, `quantity_reserved <= quantity_on_hand`.
7. `inventory_movements`: Audit ledger for inventory changes (`purchase`, `reservation`, `sale`, `release`, `manual_adjustment`, `return`).
8. `carts` & `cart_items`: Guest cart session tokens and authenticated user carts.
9. `wishlists` & `wishlist_items`: Customer saved products.
10. `orders`: Order number (`TNV-YYYYMMDD-XXXX`), totals (subtotal, shipping, tax, discount, grand total in paise), shipping address JSON, payment status, fulfilment status, order status.
11. `order_items`: Product snapshot (name, SKU, variant, unit price in paise, quantity) to preserve historical accuracy.
12. `payments`: Payment records linked to Razorpay `provider_order_id`, `provider_payment_id`, status (`created`, `pending`, `authorized`, `captured`, `failed`, `refunded`).
13. `payment_events`: Idempotency tracking table with `provider_event_id` UNIQUE constraint.
14. `coupons` & `coupon_redemptions`: Code, discount type (`fixed`, `percentage`), min order, usage limits.
15. `announcements`: Store banner announcements (`message`, `link_url`, `active`, `starts_at`, `ends_at`).
16. `site_settings`: Store configuration settings.
17. `audit_logs` & `order_status_history`: Tracking admin actions and order status transitions.

---

## 3. SQL Migrations Execution Order

1. `supabase/migrations/00001_tanavi_core_schema.sql` - Enums, extensions, core tables, constraints, indexes.
2. `supabase/migrations/00002_tanavi_rls_policies.sql` - Row Level Security policies for storefront, customer & admin roles.
3. `supabase/migrations/00003_tanavi_functions_and_views.sql` - PostgreSQL atomic inventory reservation RPCs & analytics SQL views.
