# Supabase PostgreSQL Setup & Seed Guide: Tanavi by Deepika

This guide details how to initialize and connect your Supabase project as the system of record for **Tanavi by Deepika**.

## 1. Credentials Configuration

Add your Supabase project credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wnbckffbhhmxxjbetzvs.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8
DATABASE_URL=postgresql://postgres:SupaBase@2026@db.wnbckffbhhmxxjbetzvs.supabase.co:5432/postgres
```

---

## 2. Automated SQL Migration Commands

To execute all database schema migrations, RLS security policies, PostgreSQL RPC functions, analytics views, and initial catalogue seeding:

```bash
npm run db:migrate
```

This runner script (`scripts/migrate.js`) executes the following version-controlled migration files in sequence:

1. `supabase/migrations/00001_tanavi_core_schema.sql`: Core tables (`products`, `product_variants`, `inventory`, `orders`, `order_items`, `payments`, `payment_events`, `carts`, `wishlists`, `coupons`, `announcements`, `site_settings`, etc.) and database indexes.
2. `supabase/migrations/00002_tanavi_rls_policies.sql`: Row Level Security policies protecting customer data while enabling public storefront reads and administrative writes.
3. `supabase/migrations/00003_tanavi_functions_and_views.sql`: PostgreSQL RPC functions (`reserve_inventory_for_order`, `convert_reservation_to_sale`, `release_inventory_reservation`) and analytics SQL views (`admin_daily_revenue`, `admin_inventory_alerts`, `admin_sales_by_category`).
4. `supabase/seed.development.sql`: Authentic designer catalogue seed (categories, collections, products, variants, images, announcements, shipping methods).

---

## 3. Seed Execution Instructions

When setting up a fresh development environment or linking a new Supabase project:

1. Ensure `.env.local` contains valid `DATABASE_URL` credentials.
2. Run `npm run db:migrate`.
3. Verify that products appear on `http://localhost:3000/shop` and in the Supabase Table Editor.
