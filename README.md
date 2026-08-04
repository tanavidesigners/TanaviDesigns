# Tanavi by Deepika — E-Commerce Platform

Production-grade Indian designer clothing storefront and administrative studio platform built for **Tanavi by Deepika**.

Powered by Next.js App Router, Supabase PostgreSQL (system of record, RLS policies, Auth), Razorpay Standard Checkout, and WhatsApp shopping integration.

---

## 1. Features & Capabilities

- **Designer Storefront**: Soft rose & ivory luxury visual identity, responsive navigation, dynamic announcement bar, category filter, sorting, variant size selectors, stock awareness, and size guide modal.
- **Supabase System of Record**: PostgreSQL relational schema, atomic inventory reservation functions, Row Level Security (RLS) policies, and administrative analytics views.
- **Razorpay Integration**: Server-calculated pricing in paise (never trusting client inputs), Razorpay order creation, timing-safe HMAC-SHA256 signature verification, and raw body webhook verification with idempotent event deduplication.
- **WhatsApp Integration**: Dynamic pre-filled `wa.me` links across Product Detail Pages (SKU, title, size, price, link), Shopping Bag, Order Tracking, Floating FAB, and Admin Customer Support.
- **Admin Studio Dashboard (`/admin`)**: Real-time Supabase analytics (gross revenue, paid orders, pending orders, inventory alerts), catalogue management, variant stock ledger, order fulfillment status transitions, and payment logs.
- **Strict Zero-Data Policy**: Zero fake statistics or dummy orders. Fresh databases display clean, polished empty states.

---

## 2. Environment Setup

Copy `.env.example` to `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME="Tanavi by Deepika"

NEXT_PUBLIC_SUPABASE_URL=https://wnbckffbhhmxxjbetzvs.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_nc4EgAvRw9x3jQIYXQ1-Jw_BBfHGSC8
DATABASE_URL=postgresql://postgres:SupaBase@2026@db.wnbckffbhhmxxjbetzvs.supabase.co:5432/postgres

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_tanavi_key_id
RAZORPAY_KEY_ID=rzp_test_tanavi_key_id
RAZORPAY_KEY_SECRET=test_razorpay_secret_key_12345
RAZORPAY_WEBHOOK_SECRET=test_webhook_secret_key_12345

NEXT_PUBLIC_WHATSAPP_NUMBER=919482245679
NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE="Hello Tanavi, I would like to know more about your latest designer collection."
```

---

## 3. Database Migration & Seed Execution Guide

To execute all SQL schema migrations, Row Level Security policies, PostgreSQL RPC functions, analytics views, and initial designer catalogue seeding on your Supabase PostgreSQL database:

```bash
# 1. Install dependencies
npm install

# 2. Execute SQL migrations & seed catalogue
npm run db:migrate
```

This runner script executes:
1. `supabase/migrations/00001_tanavi_core_schema.sql` (Core tables & indexes)
2. `supabase/migrations/00002_tanavi_rls_policies.sql` (Row Level Security policies)
3. `supabase/migrations/00003_tanavi_functions_and_views.sql` (RPC functions & Analytics SQL views)
4. `supabase/seed.development.sql` (Designer apparel products, variants, images, announcements)

---

## 4. Local Development & Verification

```bash
# Run unit tests
npm test

# Run TypeScript type check
npm run typecheck

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to view the storefront or `http://localhost:3000/admin` to access the studio dashboard.

---

## 5. Documentation Directory

- [`docs/reference-feature-audit.md`](docs/reference-feature-audit.md): Aanyasri reference feature inventory & gap analysis.
- [`docs/current-state-audit.md`](docs/current-state-audit.md): Codebase audit & architecture summary.
- [`docs/database-migration-plan.md`](docs/database-migration-plan.md): PostgreSQL relational database design.
- [`docs/security-review.md`](docs/security-review.md): Payment security, HMAC signatures, and RLS controls.
- [`docs/supabase-setup.md`](docs/supabase-setup.md): Supabase initialization and migration runner guide.
- [`docs/supabase-rls.md`](docs/supabase-rls.md): Row Level Security policies.
- [`docs/razorpay-setup.md`](docs/razorpay-setup.md): Razorpay integration & webhook architecture.
- [`docs/whatsapp-setup.md`](docs/whatsapp-setup.md): WhatsApp touchpoints and wa.me link generators.
- [`docs/admin-guide.md`](docs/admin-guide.md): Administrative dashboard & fulfillment guide.
- [`docs/deployment.md`](docs/deployment.md): GitHub → Vercel → GoDaddy custom domain deployment guide.
- [`docs/production-checklist.md`](docs/production-checklist.md): Comprehensive production readiness checklist.
