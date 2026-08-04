# Tanavi by Deepika - Master Implementation Plan

## Overview
Enhance and restructure the existing **Tanavi by Deepika** e-commerce codebase into a production-grade Indian designer fashion platform with:
- **Supabase** as the primary system of record (PostgreSQL, Auth, RLS, Storage).
- **Razorpay** payment gateway (Server order creation, signature verification, idempotent webhooks).
- **WhatsApp Integration** (PDP, Cart, Order support wa.me links).
- **Storefront**: High-conversion, luxury visual identity, responsive navigation, dynamic category/collection hierarchy, announcement bar, filters, PDP, Wishlist, Cart Drawer.
- **Admin Dashboard**: Real-time Supabase analytics, inventory ledger, order fulfillment, product management, zero-data empty states (no fake figures!).
- **Security & Quality**: Server-calculated pricing, WCAG 2.2 AA accessibility, SEO schema markup, unit & integration tests, CI/CD workflow.

---

## Phases & Milestones

### Phase 1: Audit & Documentation
- [x] Audit reference site `aanyasri.com` (`docs/reference-feature-audit.md`).
- [x] Audit current state & code weaknesses (`docs/current-state-audit.md`).
- [x] Database migration plan (`docs/database-migration-plan.md`).
- [x] Security review (`docs/security-review.md`).
- [x] Master implementation plan (`docs/implementation-plan.md`).

### Phase 2: Core Data Foundation & Supabase Integration
- Install `@supabase/supabase-js`, `@supabase/ssr`, `razorpay`.
- Create SQL migration files in `supabase/migrations/`:
  - `00001_tanavi_core_schema.sql` (Tables: profiles, categories, collections, product_collections, products, product_variants, product_images, inventory, inventory_movements, carts, cart_items, wishlists, wishlist_items, orders, order_items, payments, payment_events, coupons, coupon_redemptions, shipping_methods, announcements, site_settings, audit_logs).
  - `00002_tanavi_rls_policies.sql` (RLS policies for public storefront, authenticated customers, and admin/staff).
  - `00003_tanavi_functions_and_views.sql` (PostgreSQL RPC for atomic inventory reservation & SQL analytics views).
- Implement Supabase clients (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `lib/supabase/admin.ts`).
- Create typed database interfaces (`lib/types/database.ts`).
- Create modular service abstractions (`lib/services/*`): `catalog-service.ts`, `cart-service.ts`, `checkout-service.ts`, `inventory-service.ts`, `order-service.ts`, `payment-service.ts`, `analytics-service.ts`, `admin-service.ts`.

### Phase 3: Visual Design System & Storefront Rebuilding
- Configure Tailwind CSS design tokens & CSS variables in `app/globals.css`.
- Install & configure shadcn/ui components (`components/ui/*`): Button, Card, Dialog, Sheet, Drawer, Select, Tabs, Accordion, Badge, Data Table, Dropdown Menu, Skeleton, Empty, Alert, Toast/Sonner.
- Deconstruct monolithic `app/storefront.tsx` into modular Next.js App Router components:
  - Header & Navigation (`components/storefront/header.tsx`, `nav-menu.tsx`, `announcement-bar.tsx`).
  - Homepage (`components/storefront/hero.tsx`, `featured-collections.tsx`, `new-arrivals.tsx`, `category-grid.tsx`, `brand-story.tsx`).
  - Product Catalog (`app/shop/page.tsx`, `components/storefront/product-grid.tsx`, `product-card.tsx`, `product-filters.tsx`, `sort-dropdown.tsx`).
  - Product Detail Page (`app/products/[slug]/page.tsx`, `components/storefront/product-gallery.tsx`, `variant-selector.tsx`, `size-guide-modal.tsx`, `pdp-whatsapp-btn.tsx`).
  - Cart & Checkout (`components/storefront/cart-drawer.tsx`, `app/cart/page.tsx`, `app/checkout/page.tsx`).
  - Customer Account & Auth (`app/account/*`, `app/auth/login/page.tsx`, `app/auth/register/page.tsx`).
  - Policy & Informational Pages (`app/about/page.tsx`, `app/contact/page.tsx`, `app/shipping-policy/page.tsx`, `app/returns/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/size-guide/page.tsx`, `app/track-order/page.tsx`, `app/faqs/page.tsx`).
  - Reusable empty states (`components/shared/data-empty-state.tsx`).

### Phase 4: Checkout, Razorpay Integration & Inventory Lock Engine
- `POST /api/payments/razorpay/create-order`:
  - Recalculate price in paise on server.
  - Create internal pending order in Supabase.
  - Create atomic inventory reservation.
  - Create Razorpay order via Razorpay SDK.
- `POST /api/payments/razorpay/verify`:
  - Timing-safe HMAC-SHA256 signature verification.
  - Update payment record & finalize inventory reservation to sale.
- `POST /api/webhooks/razorpay`:
  - Verify raw body HMAC signature.
  - Check & insert `event_id` in `payment_events` table (idempotent).
  - Handle `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.

### Phase 5: Production Admin Dashboard & Real Analytics
- Build layout shell (`components/admin/admin-layout.tsx`, `admin-sidebar.tsx`).
- Overview Page (`app/admin/page.tsx`): Real Supabase SQL analytics queries (Gross captured revenue, paid orders, pending orders, low stock count, sales by category). Show polished empty states when 0 records exist (NO fake charts/numbers!).
- Catalogue Management (`app/admin/products/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`).
- Inventory Ledger (`app/admin/inventory/page.tsx`): Stock on hand, reserved stock, low-stock threshold alerts, manual stock adjustments with movement audit log.
- Orders Fulfillment (`app/admin/orders/page.tsx`, `[id]/page.tsx`): Status transitions (`pending_payment` → `paid` → `processing` → `packed` → `shipped` → `delivered`), customer details, WhatsApp order support button.
- Payment Logs (`app/admin/payments/page.tsx`): Transaction logs, failure reasons, Razorpay reference IDs.
- Customers, Coupons, Announcements & Site Settings (`app/admin/customers/page.tsx`, `app/admin/coupons/page.tsx`, `app/admin/settings/page.tsx`).

### Phase 6: Quality Assurance, SEO, Security & Deployment
- Automated tests (`tests/unit/*`, `tests/integration/*`):
  - Pricing & tax paise calculations.
  - Razorpay signature verification.
  - Inventory reservation & release logic.
  - Idempotent webhook handling.
- SEO & OpenGraph: Dynamic metadata, product JSON-LD schemas, sitemap.xml, robots.txt.
- Security checks: Lint rules for secrets, client component audit.
- Complete documentation files (`README.md`, `docs/supabase-setup.md`, `docs/supabase-rls.md`, `docs/razorpay-setup.md`, `docs/whatsapp-setup.md`, `docs/admin-guide.md`, `docs/deployment.md`, `docs/production-checklist.md`).
- GitHub Actions CI workflow (`.github/workflows/ci.yml`).
