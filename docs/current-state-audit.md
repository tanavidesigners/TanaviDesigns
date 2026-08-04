# Tanavi by Deepika - Current State Audit

## 1. Stack & Architecture

- **Framework**: Next.js `16.2.6` (App Router) running via `vinext` / Cloudflare Worker stub.
- **Languages & Libraries**: TypeScript `5.9.3`, React `19.2.6`, Tailwind CSS `4.2.1`.
- **Current Data Layer**: SQLite (Cloudflare D1) with Drizzle ORM `0.45.2` (`db/schema.ts`).
- **Target Data Layer**: **Supabase PostgreSQL** as primary system of record with Supabase Auth, Supabase Storage, and Row Level Security (RLS).
- **Payment Gateway**: Razorpay integration with stubs in `app/api/payments/razorpay/*`.
- **Messaging**: WhatsApp integration via helper wa.me links.

---

## 2. Identified Weaknesses & Deficiencies

### A. Hardcoded Dummy Data & Mock States
- `app/storefront.tsx`:
  - Hardcoded array of 8 static products (`products` array with fake Unsplash image URLs).
  - Hardcoded `ordersList` state with fake customer names (`kavya@example.com`, `ananya@example.com`) and mock orders (`TNV-24078`, `TNV-24079`).
  - Mock checkout handler with `setTimeout` and hardcoded redirect to `/payment/success?order=TNV-24078`.
  - Fake stock warning strings ("Only 1 left").
  - Fake reviews/testimonials ("Kavya S., Bengaluru").
- `drizzle/seed.sql`: SQLite seed file with dummy product records.

### B. Database & Data Source Misalignment
- The current codebase depends on Cloudflare D1 / Drizzle ORM (`sqliteTable`).
- Prompt mandates: **Supabase PostgreSQL** as primary system of record with SQL migrations committed under `supabase/migrations/`.
- D1/Drizzle configuration must be migrated to official `@supabase/supabase-js` and `@supabase/ssr` server/browser clients and version-controlled SQL migrations.

### C. Razorpay Payment Security & Idempotency
- `app/api/payments/razorpay/create-order/route.ts` currently returns 503 error ("Catalogue seeding is required"). It must be replaced with server-side price calculation, paise integer formatting, Supabase pending order creation, inventory reservation, and Razorpay API order creation.
- `app/api/payments/razorpay/verify/route.ts` missing. Needs timing-safe HMAC-SHA256 signature verification.
- `app/api/webhooks/razorpay/route.ts` currently logs but does not persist `event.id` to a `payment_events` table with unique constraint for idempotency.

### D. Component System & UI Foundation
- All storefront pages (Home, Shop, PDP, Cart, Checkout, Search, Admin Portal, Order Tracking) are currently bundled in a monolithic `app/storefront.tsx` client file (590 lines).
- Lacks modular shadcn/ui components (`components/ui/*`), proper layout structure, server components, and responsive design system tokens.

### E. Inventory Management & Concurrent Checkout Safety
- Inventory table lacks explicit reservation ledger (`inventory_movements`) and PostgreSQL row-level locks / functions to prevent race conditions and overselling during concurrent checkouts.

### F. Accessibility & SEO
- Lack of proper ARIA roles on interactive elements.
- Missing dynamic open graph metadata, structured product JSON-LD schemas, sitemap, and robots.txt.
